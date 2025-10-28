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
        // res.status(500).json({message: "Błąd serwera"})
    } catch(err) {
        console.error("Błąd przy pobieraniu liczby pacjentów", err)
        res.status(500).json({message: "Błąd serwera"})
    }
}

export async function addPatient(req, res) {
    const dietician_id = req.user.id
    const { first_name, last_name, age, sex, weight, height, activity_level, goal, conditions } = req.body

    try {
        const result = await appDb.query(
            "INSERT INTO patients " +
            "(dietician_id, first_name, last_name, age, sex, weight, height, activity_level, goal, conditions) " +
            "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) " +
            "RETURNING first_name, last_name, created_at",
            [dietician_id, first_name, last_name, age, sex, weight, height, activity_level, goal, conditions]
        )

        const patient = result.rows[0];

        res.status(201).json({ message: "Pomyślnie dodano pacjenta", patient});

    } catch(err) {
        console.error("Błąd przy dodawaniu pacjenta", err)
        res.status(500).json({message: "Błąd serwera"})
    }
}