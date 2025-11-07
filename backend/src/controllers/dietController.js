import { appDb } from "../config/db.js";

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

    try {
        // const result = await appDb.query(
        //     "INSERT INTO patients " +
        //     "(dietician_id, first_name, last_name, age, sex, weight, height, activity_level, goal, conditions) " +
        //     "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) " +
        //     "RETURNING first_name, last_name, created_at ",
        //     [dietician_id, first_name, last_name, age, sex, weight, height, activity_level, goal, conditions]
        // )

        const result = await appDb.query(
            "INSERT INTO patients " +
            "(dietician_id, first_name, last_name, age, sex, weight, height, activity_level, goal, conditions) " +
            "SELECT d.id, $2, $3, $4, $5, $6, $7, $8, $9, $10 " +
            "FROM dieticians d " +
            "WHERE d.user_id = $1 " +
            "RETURNING first_name, last_name, created_at",
            [user_id, first_name, last_name, age, sex, weight, height, activity_level, goal, conditions]
        )

        const patient = result.rows[0];

        res.status(201).json({ message: "Pomyślnie dodano pacjenta", patient});

    } catch(err) {
        console.error("Błąd przy dodawaniu pacjenta", err)
        res.status(500).json({message: "Błąd serwera"})
    }
}

export async function getPatientById(req, res) {
    const patient_id = req.params.id
    const user_id = req.user.id

    try {
        const result = await appDb.query(
            "SELECT p.* " +
            "FROM patients p " +
            "JOIN dieticians d ON p.dietician_id = d.id " +
            "WHERE d.user_id = $1 AND p.id = $2",
            [user_id, patient_id]
        )

        const patient = result.rows[0]

        res.status(201).json({message: "Pomyślnie pobrano pacjenta", patient})

    } catch(err) {
        console.error("Błąd przy pobieraniu pacjenta")
        res.status(500).json({message: "Błąd serwera"})
    }
}

export async function updatePatient(req, res) {
    const patient_id = req.params.id;
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

    values.push(patient_id);

    const query = `
        UPDATE patients
        SET ${updates.join(", ")}
        WHERE id = $${index}
        RETURNING *;
    `;

    try {
        const result = await appDb.query(query, values);
        const patient = result.rows[0];
        res.status(200).json({
            message: "Pomyślnie zaktualizowano pacjenta",
            patient,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: "Błąd serwera przy aktualizowaniu pacjenta",
        });
    }
}
