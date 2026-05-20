// progressController
import { appDb } from "../config/db.js";

export async function createProgress(req, res) {
    const client = await appDb.connect()
    const user_id = req.user.id
    const { weight, patient_id } = req.body

    try {
        const dieticianRes = await client.query(
            "SELECT id FROM dieticians WHERE user_id = $1",
            [user_id]
        );

        const dietician_id = dieticianRes.rows[0]?.id;
        if (!dietician_id) {
            return res.status(404).json({
                message: "Brak dietetyka przypisanego do konta użytkownika"
            });
        }

        const patientRes = await client.query(
            "SELECT id FROM patients WHERE id = $1 AND dietician_id = $2",
            [patient_id, dietician_id]
        );

        if (!patientRes.rows[0]) {
            return res.status(404).json({
                message: "Nie znaleziono pacjenta przypisanego do zalogowanego dietetyka"
            });
        }

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
    const user_id = req.user.id;
    const patient_id = req.params.id;

    try {
        const dieticianRes = await appDb.query(
            "SELECT id FROM dieticians WHERE user_id = $1",
            [user_id]
        );

        const dietician_id = dieticianRes.rows[0]?.id;
        if (!dietician_id) {
            return res.status(404).json({
                message: "Brak dietetyka przypisanego do konta użytkownika"
            });
        }

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
        res.status(500).json({
            message: "Błąd serwera przy pobieraniu listy progresów",
        });
    }
}

export async function deleteProgress(req, res) {
    const client = await appDb.connect();
    const user_id = req.user.id;
    const progress_id = req.params.id;

    try {
        const dieticianRes = await client.query(
            "SELECT id FROM dieticians WHERE user_id = $1",
            [user_id]
        );

        const dietician_id = dieticianRes.rows[0]?.id;
        if (!dietician_id) {
            return res.status(404).json({
                message: "Brak dietetyka przypisanego do konta użytkownika"
            });
        }

        await client.query("BEGIN");

        const progressRes = await client.query(
            "SELECT pp.id, pp.patient_id, pp.created_at " +
            "FROM patient_progress pp " +
            "JOIN patients p ON pp.patient_id = p.id " +
            "WHERE pp.id = $1 AND p.dietician_id = $2",
            [progress_id, dietician_id]
        );

        const progress = progressRes.rows[0];
        if (!progress) {
            await client.query("ROLLBACK");
            return res.status(404).json({
                message: "Nie znaleziono progresu przypisanego do pacjenta zalogowanego dietetyka"
            });
        }

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
            "DELETE FROM patient_progress " +
            "WHERE id = $1",
            [progress_id]
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
        res.status(500).json({
            message: "Błąd serwera przy usuwaniu progresu",
        });
    } finally {
        client.release();
    }
}

export async function updateProgress(req, res) {

}