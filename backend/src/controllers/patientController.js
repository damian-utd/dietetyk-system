// patientController
import { appDb } from "../config/db.js";
import { isValidPatientGoal } from "../utils/patientGoals.js";
import {
    getDieticianIdForUser,
    requireResourceOwnership
} from "../services/resourceAuthorization.js";

export async function getPatients(req, res) {
    try {
    const userId = req.user.id
    const result = await appDb.query(
        "SELECT p.* " +
        "FROM patients p " +
        "JOIN dieticians d ON p.dietician_id = d.id " +
        "WHERE d.user_id = $1 " +
        "ORDER BY p.created_at DESC ",
        [userId]
    )

    res.json({patients: result.rows})

    } catch(err) {
        console.error("Błąd przy pobieraniu pacjentów", err)
        res.status(500).json({message: "Błąd serwera"})
    }

}

export async function getPatientsCount(req, res) {
    try {
        const userId = req.user.id
        const result = await appDb.query(
            "SELECT COUNT(*) AS count " +
            "FROM patients p " +
            "JOIN dieticians d ON p.dietician_id = d.id " +
            "WHERE d.user_id = $1 ",
            [userId]
        )

        res.json(Number(result.rows[0].count));

    } catch(err) {
        console.error("Błąd przy pobieraniu liczby pacjentów", err)
        res.status(500).json({message: "Błąd serwera"})
    }
}

export async function addPatient(req, res) {
    const user_id = req.user.id
    const { first_name, last_name, age, sex, weight, height, activity_level, goal, conditions } = req.body

    if (!isValidPatientGoal(goal)) {
        return res.status(400).json({message: "Wybierz prawidłowy cel żywieniowy"})
    }

    const client = await appDb.connect()

    try {
        await client.query("BEGIN")
        const dietician_id = await getDieticianIdForUser(client, user_id)

        const result = await client.query(
            "INSERT INTO patients " +
            "(dietician_id, first_name, last_name, age, sex, weight, height, activity_level, goal, conditions) " +
            "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) " +
            "RETURNING id, first_name, last_name, created_at",
            [dietician_id, first_name, last_name, age, sex, weight, height, activity_level, goal, conditions]
        )

        const patient = result.rows[0];

        await client.query(
            "INSERT INTO patient_progress " +
            "(patient_id, new_weight) " +
            "VALUES ($1, $2) ",
            [patient.id, weight]
        )

        await client.query("COMMIT")
        res.status(201).json({ message: "Pomyślnie dodano pacjenta", patient});

    } catch(err) {
        await client.query("ROLLBACK")

        console.error("Błąd przy dodawaniu pacjenta", err)
        res.status(err.status ?? 500).json({
            message: err.status ? err.message : "Błąd serwera"
        })
    } finally {
        await client.release()
    }
}

export async function getPatientById(req, res) {
    const patient_id = req.params.id
    const user_id = req.user.id

    try {
        await requireResourceOwnership(appDb, user_id, "patient", patient_id)

        const result = await appDb.query(
            "SELECT p.* " +
            "FROM patients p " +
            "JOIN dieticians d ON p.dietician_id = d.id " +
            "WHERE d.user_id = $1 AND p.id = $2",
            [user_id, patient_id]
        )

        const patient = result.rows[0]

        res.status(200).json({message: "Pomyślnie pobrano pacjenta", patient})

    } catch(err) {
        console.error("Błąd przy pobieraniu pacjenta")
        res.status(err.status ?? 500).json({
            message: err.status ? err.message : "Błąd serwera"
        })
    }
}

export async function updatePatient(req, res) {
    const patient_id = req.params.id;
    const user_id = req.user.id;

    if (req.body.goal !== undefined && !isValidPatientGoal(req.body.goal)) {
        return res.status(400).json({ message: "Wybierz prawidłowy cel żywieniowy" });
    }

    const fields = [
        "first_name",
        "last_name",
        "age",
        "sex",
        "weight",
        "height",
        "activity_level",
        "goal",
        "conditions"
    ];

    const updates = [];
    const values = [];
    let index = 1;

    for (const field of fields) {
        if (req.body[field] !== undefined && req.body[field] !== null) {
            updates.push(`${field} = $${index}`);
            values.push(req.body[field]);
            index++;
        }
    }

    if (updates.length === 0) {
        return res.status(400).json({ message: "Brak danych do aktualizacji" });
    }

    values.push(patient_id, user_id);

    const query = `
        UPDATE patients p
        SET ${updates.join(", ")}
        FROM dieticians d
        WHERE p.id = $${index}
            AND d.user_id = $${index + 1}
            AND p.dietician_id = d.id
        RETURNING p.*;
    `;

    try {
        await requireResourceOwnership(appDb, user_id, "patient", patient_id);

        const result = await appDb.query(query, values);
        const patient = result.rows[0];
        res.status(200).json({
            message: "Pomyślnie zaktualizowano pacjenta",
            patient,
        });
    } catch (err) {
        console.error(err.message);
        res.status(err.status ?? 500).json({
            message: err.status ? err.message : "Błąd serwera przy aktualizowaniu pacjenta",
        });
    }
}

export async function deletePatient(req, res) {
    const patient_id = req.params.id;
    const user_id = req.user.id

    const client = await appDb.connect()

    try {
        await client.query("BEGIN")
        await requireResourceOwnership(client, user_id, "patient", patient_id)

        const result = await client.query(
            "DELETE " +
            "FROM patients p " +
            "USING dieticians d " +
            "WHERE " +
            "d.user_id = $1 AND " +
            "p.id = $2 AND " +
            "p.dietician_id = d.id " +
            "RETURNING p.*",
            [user_id, patient_id]
        )

        if (result.rowCount === 0) {
            const error = new Error("Nie znaleziono pacjenta lub brak uprawnień")
            error.status = 404
            throw error
        }

        const patient = result.rows[0]

        await client.query(
            "DELETE FROM patient_diet_plan " +
            "WHERE patient_id = $1",
            [patient_id]
        )

        await client.query("COMMIT")
        res.status(200).json({
            message: "Pomyślnie usunięto pacjenta",
            patient,
        });


    } catch(err) {
        await client.query("ROLLBACK")
        console.error("Błąd przy usuwaniu pacjenta")
        res.status(err.status ?? 500).json({
            message: err.status ? err.message : "Błąd serwera"
        })
    } finally {
        client.release()
    }
}


