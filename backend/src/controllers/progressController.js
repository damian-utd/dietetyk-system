// progressController
import { appDb } from "../config/db.js";
import { requireResourceOwnership } from "../services/resourceAuthorization.js";

export async function createProgress(req, res) {
    const client = await appDb.connect()
    const user_id = req.user.id
    const { weight, patient_id } = req.body

    try {
        await client.query("BEGIN")
        const patient = await requireResourceOwnership(client, user_id, "patient", patient_id)

        const result = await client.query(
            "INSERT INTO patient_progress " +
            "(patient_id, new_weight) " +
            "SELECT p.id, $2 " +
            "FROM patients p " +
            "WHERE p.id = $1 AND p.dietician_id = $3 " +
            "RETURNING id, new_weight, created_at",
            [patient_id, weight, patient.dietician_id]
        )

        if (result.rowCount === 0) {
            const error = new Error("Nie znaleziono zasobu lub brak uprawnień")
            error.status = 404
            throw error
        }

        await client.query(
            "UPDATE patients " +
            "SET weight = $1 " +
            "WHERE id = $2 AND dietician_id = $3",
            [weight, patient_id, patient.dietician_id]
        )

        await client.query("COMMIT")
        res.status(201).json({
            message: "Progres zapisany",
            value: result.rows[0]
        })

    } catch (err) {
        await client.query("ROLLBACK")

        console.error(err.message);
        res.status(err.status ?? 500).json({
            message: err.status ? err.message : "Błąd serwera przy dodawaniu progresu",
        });
    } finally {
        client.release()
    }
}

export async function getProgress(req, res) {
    const user_id = req.user.id;
    const patient_id = req.params.id;

    try {
        const resource = await requireResourceOwnership(appDb, user_id, "patient", patient_id)
        const dietician_id = resource.dietician_id

        const result = await appDb.query(
            "SELECT pp.id, pp.new_weight, pp.created_at " +
            "FROM patient_progress pp " +
            "JOIN patients p ON pp.patient_id = p.id " +
            "WHERE pp.patient_id = $1 AND p.dietician_id = $2 " +
            "ORDER BY pp.created_at DESC",
            [patient_id, dietician_id]
        );

        res.status(200).json({
            message: "Pobrano listę progresów",
            value: result.rows
        });

    } catch (err) {
        console.error(err.message);
        res.status(err.status ?? 500).json({
            message: err.status ? err.message : "Błąd serwera przy pobieraniu listy progresów",
        });
    }
}

export async function deleteProgress(req, res) {
    const client = await appDb.connect();
    const user_id = req.user.id;
    const progress_id = req.params.id;

    try {
        await client.query("BEGIN");
        const authorizedProgress = await requireResourceOwnership(
            client,
            user_id,
            "progress",
            progress_id
        )
        const dietician_id = authorizedProgress.dietician_id

        const progress = authorizedProgress

        const progressCountRes = await client.query(
            "SELECT COUNT(*) " +
            "FROM patient_progress pp " +
            "JOIN patients p ON pp.patient_id = p.id " +
            "WHERE p.dietician_id = $1 AND pp.patient_id = $2",
            [dietician_id, progress.patient_id]
        )

        const progressCount = parseInt(progressCountRes.rows[0]?.count ?? "0", 10);

        if (progressCount < 2) {
            await client.query("ROLLBACK");
            return res.status(400).json({
                message: "Usunięcie jedynego postępu jest zabronione"
            });
        }

        const latestProgressRes = await client.query(
            "SELECT id, new_weight, created_at " +
            "FROM patient_progress " +
            "WHERE patient_id = $1 " +
            "ORDER BY created_at DESC, id DESC " +
            "LIMIT 1",
            [progress.patient_id]
        );

        const latestProgress = latestProgressRes.rows[0];
        const isLatestProgress = latestProgress?.id === progress.id;

        await client.query(
            "DELETE FROM patient_progress pp " +
            "USING patients p " +
            "WHERE pp.id = $1 AND pp.patient_id = p.id AND p.dietician_id = $2",
            [progress_id, dietician_id]
        );

        if (isLatestProgress) {
            const newLatestProgressRes = await client.query(
                "SELECT new_weight " +
                "FROM patient_progress " +
                "WHERE patient_id = $1 " +
                "ORDER BY created_at DESC, id DESC " +
                "LIMIT 1",
                [progress.patient_id]
            );

            const newLatestWeight = newLatestProgressRes.rows[0]?.new_weight ?? null;

            await client.query(
                "UPDATE patients " +
                "SET weight = $1 " +
                "WHERE id = $2 AND dietician_id = $3",
                [newLatestWeight, progress.patient_id, dietician_id]
            );
        }

        await client.query("COMMIT");

        res.status(200).json({
            message: "Pomyślnie usunięto progres",
        });

    } catch (err) {
        await client.query("ROLLBACK");
        console.error(err.message);
        res.status(err.status ?? 500).json({
            message: err.status ? err.message : "Błąd serwera przy usuwaniu progresu",
        });
    } finally {
        client.release();
    }
}

export async function updateProgress(req, res) {

}
