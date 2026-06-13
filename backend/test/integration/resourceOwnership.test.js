import assert from "node:assert/strict"
import test from "node:test"
import jwt from "jsonwebtoken"
import request from "supertest"
import { app } from "../../app.js"
import { appDb } from "../../src/config/db.js"
import {
    assertTestDatabaseSafety,
    resetIntegrationDatabase
} from "../helpers/testDatabase.js"

const patientGoal = "Utrzymanie masy ciała"

function authCookie(userId) {
    const token = jwt.sign(
        {id: userId, role: "dietetyk"},
        process.env.JWT_SECRET,
        {expiresIn: "5m"}
    )

    return `authToken=${token}`
}

async function seedOwnershipFixtures() {
    await resetIntegrationDatabase(appDb)

    const users = await appDb.query(
        "INSERT INTO users (email, password_hash, role) " +
        "VALUES ('a@example.com', 'unused', 'dietetyk'), ('b@example.com', 'unused', 'dietetyk') " +
        "RETURNING id"
    )
    const [userA, userB] = users.rows

    const dieticians = await appDb.query(
        "INSERT INTO dieticians (user_id, full_name) " +
        "VALUES ($1, 'Dietetyk A'), ($2, 'Dietetyk B') " +
        "RETURNING id",
        [userA.id, userB.id]
    )
    const [dieticianA, dieticianB] = dieticians.rows

    const patients = await appDb.query(
        "INSERT INTO patients (dietician_id, first_name, last_name, goal, weight) " +
        "VALUES ($1, 'Pacjent', 'A', $3, 70), ($2, 'Pacjent', 'B', $3, 80) " +
        "RETURNING id",
        [dieticianA.id, dieticianB.id, patientGoal]
    )
    const [patientA, patientB] = patients.rows

    const note = await appDb.query(
        "INSERT INTO dietician_notes (dietician_id, patient_id, note) " +
        "VALUES ($1, $2, 'Notatka B') RETURNING id",
        [dieticianB.id, patientB.id]
    )

    const plan = await appDb.query(
        "INSERT INTO diet_plans (dietician_id, title) " +
        "VALUES ($1, 'Plan B') RETURNING id",
        [dieticianB.id]
    )

    const progress = await appDb.query(
        "INSERT INTO patient_progress (patient_id, new_weight) " +
        "VALUES ($1, 81), ($1, 80) RETURNING id",
        [patientB.id]
    )

    return {
        cookieA: authCookie(userA.id),
        patientAId: patientA.id,
        patientBId: patientB.id,
        noteBId: note.rows[0].id,
        planBId: plan.rows[0].id,
        progressBId: progress.rows[0].id
    }
}

test.before(async () => {
    await assertTestDatabaseSafety(appDb)
})

test.after(async () => {
    await appDb.end()
})

test("dietician cannot access or modify another dietician's resources", async t => {
    const fixtures = await seedOwnershipFixtures()
    const authorized = (method, path) => request(app)[method](path).set("Cookie", fixtures.cookieA)

    await t.test("own patient can be read", async () => {
        const response = await authorized("get", `/api/patients/${fixtures.patientAId}`)

        assert.equal(response.status, 200)
        assert.equal(response.body.patient.id, fixtures.patientAId)
    })

    await t.test("patient read is denied", async () => {
        const response = await authorized("get", `/api/patients/${fixtures.patientBId}`)
        assert.equal(response.status, 404)
    })

    await t.test("patient update is denied", async () => {
        const response = await authorized("post", `/api/patients/${fixtures.patientBId}/update`)
            .send({first_name: "Zmieniony"})

        assert.equal(response.status, 404)
    })

    await t.test("patient delete is denied", async () => {
        const response = await authorized("delete", `/api/patients/${fixtures.patientBId}`)
        assert.equal(response.status, 404)
    })

    await t.test("note creation for another dietician's patient is denied", async () => {
        const response = await authorized("post", "/api/notes")
            .send({patient_id: fixtures.patientBId, note: "Niedozwolona notatka"})

        assert.equal(response.status, 404)
    })

    await t.test("another dietician's note cannot be updated or deleted", async () => {
        const updateResponse = await authorized("put", `/api/notes/${fixtures.noteBId}`)
            .send({text: "Zmieniona"})
        const deleteResponse = await authorized("delete", `/api/notes/${fixtures.noteBId}`)

        assert.equal(updateResponse.status, 404)
        assert.equal(deleteResponse.status, 404)
    })

    await t.test("plan cannot be assigned to another dietician's patient", async () => {
        const response = await authorized("post", "/api/diet")
            .send({
                planState: {
                    patient_id: fixtures.patientBId,
                    title: "Niedozwolony plan",
                    description: "",
                    days: []
                }
            })

        assert.equal(response.status, 404)
    })

    await t.test("another dietician's plan cannot be read or deleted", async () => {
        const readResponse = await authorized("get", `/api/diet/${fixtures.planBId}`)
        const deleteResponse = await authorized("delete", `/api/diet/${fixtures.planBId}`)

        assert.equal(readResponse.status, 404)
        assert.equal(deleteResponse.status, 404)
    })

    await t.test("another dietician's progress cannot be read or deleted", async () => {
        const readResponse = await authorized("get", `/api/progress/${fixtures.patientBId}`)
        const deleteResponse = await authorized("delete", `/api/progress/${fixtures.progressBId}`)

        assert.equal(readResponse.status, 404)
        assert.equal(deleteResponse.status, 404)
    })

    const preservedResources = await appDb.query(
        "SELECT " +
        "(SELECT COUNT(*) FROM patients WHERE id = $1) AS patient_count, " +
        "(SELECT COUNT(*) FROM dietician_notes WHERE id = $2) AS note_count, " +
        "(SELECT COUNT(*) FROM diet_plans WHERE id = $3) AS plan_count, " +
        "(SELECT COUNT(*) FROM patient_progress WHERE id = $4) AS progress_count",
        [
            fixtures.patientBId,
            fixtures.noteBId,
            fixtures.planBId,
            fixtures.progressBId
        ]
    )

    assert.deepEqual(preservedResources.rows[0], {
        patient_count: "1",
        note_count: "1",
        plan_count: "1",
        progress_count: "1"
    })
})
