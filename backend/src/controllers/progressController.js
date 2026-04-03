// progressController
import { appDb } from "../config/db.js";

export async function createProgress(req, res) {
    const client = await appDb.connect()
    const { weight, patient_id } = req.body

    try {

        await client.query("BEGIN")

        const result = await client.query(
            "INSERT INTO patient_progress " +
            "(patient_id, new_weight) " +
            "VALUES ($1, $2) " +
            "RETURNING id, new_weight, created_at",
            [patient_id, weight]
        )

        await client.query(
            "UPDATE patients " +
            "SET weight = $1 " +
            "WHERE id = $2 ",
            [weight, patient_id]
        )

        await client.query("COMMIT")
        res.status(201).json({
            message: "Progres zapisany",
            value: result.rows[0]
        })

    } catch (err) {
        await client.query("ROLLBACK")

        console.error(err.message);
        res.status(500).json({
            message: "Błąd serwera przy dodawaniu progresu",
        });
    } finally {
        client.release()
    }
}

export async function getProgress(req, res) {
    const patient_id = req.params.id

    try {

        const result = await appDb.query(
            "SELECT id, new_weight, created_at " +
            "FROM patient_progress " +
            "WHERE patient_id = $1 " +
            "ORDER BY created_at DESC",
            [patient_id]
        )

        res.status(200).json({
            message: "Pobrano listę progresów",
            value: result.rows
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: "Błąd serwera przy pobieraniu listy progresów",
        });
    }
}

export async function deleteProgress(req, res) {
    const progress_id = req.params.id

    try {
        await appDb.query(
            "DELETE " +
            "FROM patient_progress " +
            "WHERE id = $1 ",
            [progress_id]
        )

        res.status(200).json({
            message: "Pomyślnie usunięto progres",
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: "Błąd serwera przy usuwaniu progresu",
        });
    }
}

export async function updateProgress(req, res) {

}