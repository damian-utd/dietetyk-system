import assert from "node:assert/strict"
import test from "node:test"
import {
    getDieticianIdForUser,
    requireResourceOwnership
} from "./resourceAuthorization.js"

test("requireResourceOwnership returns an owned resource", async () => {
    const queryable = {
        async query(query, values) {
            assert.match(query, /FROM patients p/)
            assert.deepEqual(values, [12, 7])
            return {rows: [{id: 12, dietician_id: 3}]}
        }
    }

    const resource = await requireResourceOwnership(queryable, 7, "patient", 12)

    assert.deepEqual(resource, {id: 12, dietician_id: 3})
})

test("requireResourceOwnership rejects access to a resource owned by another dietician", async () => {
    const queryable = {
        async query() {
            return {rows: []}
        }
    }

    await assert.rejects(
        requireResourceOwnership(queryable, 7, "note", 99),
        error => error.status === 404
    )
})

test("requireResourceOwnership rejects unsupported resource types", async () => {
    await assert.rejects(
        requireResourceOwnership({}, 7, "user", 1),
        error => error.status === 500
    )
})

test("getDieticianIdForUser returns the dietician linked to the user", async () => {
    const queryable = {
        async query(query, values) {
            assert.match(query, /FROM dieticians/)
            assert.deepEqual(values, [7])
            return {rows: [{id: 3}]}
        }
    }

    assert.equal(await getDieticianIdForUser(queryable, 7), 3)
})
