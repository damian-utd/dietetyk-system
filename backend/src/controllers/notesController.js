// notesController

import {appDb} from "../config/db.js";

export async function createNote(req, res) {
    const user_id = req.user.id
    const { patient_id, note } = req.body

    try {
        const result = await appDb.query(
            "INSERT INTO dietician_notes " +
            "(dietician_id, patient_id, note) " +
            "SELECT d.id, $2, $3 " +
            "FROM dieticians d " +
            "WHERE d.user_id = $1 " +
            "RETURNING id, dietician_id, patient_id, note, created_at",
            [user_id, patient_id, note]
        )

        res.status(201).json({
            message: "Pomyślnie dodano notatkę",
            value: result.rows[0]
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: "Błąd serwera przy dodawaniu notatki",
        });
    }
}

export async function getNotes(req, res) {
    const patient_id = req.params.id
    const user_id = req.user.id

    try {
        const result = await appDb.query(
            "SELECT dn.id, dn.note, dn.created_at " +
            "FROM dietician_notes dn " +
            "JOIN dieticians d ON d.user_id = $1 " +
            "WHERE patient_id = $2 " +
            "ORDER BY dn.created_at DESC",
            [user_id, patient_id]
        )

        res.status(200).json({
            message: "Pobrano listę notatek",
            value: result.rows
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: "Błąd serwera przy pobieraniu listy notatek",
        });
    }
}

export async function deleteNotes(req, res) {
    const note_id = req.params.id
    const user_id = req.user.id

    try {
        await appDb.query(
            "DELETE " +
            "FROM dietician_notes dn " +
            "USING dieticians d " +
            "WHERE dn.id = $1 AND d.user_id = $2",
            [note_id, user_id]
        )

        res.status(200).json({
            message: "Pomyślnie usunięto notatkę",
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: "Błąd serwera przy usuwaniu notatki",
        });
    }
}

export async function updateNote(req, res) {
    const note_id = req.params.id
    const user_id = req.user.id
    const text = req.body.text

    try {
        const result = await appDb.query(
            "UPDATE dietician_notes " +
            "SET note = $1 " +
            "WHERE id = $2 AND dietician_id = " +
                "(SELECT id FROM dieticians WHERE user_id = $3) " +
            "RETURNING id, note, created_at",
            [text, note_id, user_id]
        )

        res.status(200).json({
            message: "Pomyślnie edytowano notatkę",
            value: result.rows[0]
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: "Błąd serwera przy edytowaniu notatki",
        });
    }
}

export async function getNotesCount(req, res) {
    const user_id = req.user.id

    try {
        const result = await appDb.query(
            "SELECT COUNT(*) " +
            "FROM dietician_notes dn " +
            "JOIN dieticians d ON dn.dietician_id = d.id " +
            "WHERE d.user_id = $1",
            [user_id]
        )

        res.status(200).json({
            message: "Pomyślnie pobrano liczbę notatek",
            value: result.rows[0]?.count
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: "Błąd serwera przy pobieraniu liczby notatek"
        })
    }
}