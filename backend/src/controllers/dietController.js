import { appDb } from "../config/db.js";
import {getPlanDataById} from "../services/getPlanDataById.js";
import {getPDFFromPlan} from "../services/getPDFFromPlan.js";

function getProductSnapshotValues(mealId, product) {
    const fdcId = Number(product.fdcId)
    const quantity = Number(product.quantity)
    const nutrientValues = [product.energy, product.protein, product.carbs, product.fats]
    const nutrients = nutrientValues.map(Number)
    const name = product.name?.trim()
    const unit = product.unit?.trim()

    if (
        !Number.isInteger(fdcId) ||
        fdcId <= 0 ||
        !name ||
        !unit ||
        !Number.isFinite(quantity) ||
        quantity <= 0 ||
        quantity > 10000 ||
        nutrientValues.some(value => value === null || value === undefined || value === "") ||
        nutrients.some(value => !Number.isFinite(value) || value < 0)
    ) {
        const error = new Error("Nieprawidłowe dane produktu")
        error.status = 400
        throw error
    }

    return [mealId, fdcId, name, quantity, unit, ...nutrients]
}

export async function savePlan(req,res) {
    const client = await appDb.connect()

    try {
        if (req.user.role !== "dietetyk") {
            return res.status(403).json({
                message: "Brak uprawnień do wykonania operacji"
            })
        }

        const user_id = req.user.id

        const dieticianRes = await appDb.query(
            "SELECT id FROM dieticians WHERE user_id = $1;",
            [user_id]
        );

        const dietician_id = dieticianRes.rows[0]?.id;
        if (!dietician_id) {
            return res.status(404).json({
                message: "Brak dietetyka przypisanego do konta uzytkownika"
            })
        }

        const planState = req.body.planState
        if(!planState) {
            return res.status(400).json({
                message: "Brak danych do zapisania"
            })
        }

        await client.query("BEGIN")

        const planResult = await client.query(
            "INSERT INTO diet_plans " +
            "(dietician_id, title, description) " +
            "VALUES ($1, $2, $3) " +
            "RETURNING id, created_at",
            [dietician_id, planState.title, planState.description]
        )

        const plan_id = planResult.rows[0].id

        for (const day of planState.days) {
            const dayRes = await client.query(
                "INSERT INTO diet_days " +
                "(diet_plan_id, day_number) " +
                "VALUES ($1, $2) " +
                "RETURNING id",
                [plan_id, day.day_number]
            )
            const day_id = dayRes.rows[0].id

            for (const meal of day.meals) {
                const mealRes = await client.query(
                    "INSERT INTO meals " +
                    "(diet_day_id, name, order_number, notes) " +
                    "VALUES ($1, $2, $3, $4) " +
                    "RETURNING id",
                    [day_id, meal.name, meal.order_number, meal.notes]
                )
                const meal_id = mealRes.rows[0].id

                for (const product of meal.meal_products) {
                    await client.query(
                        "INSERT INTO meal_products " +
                        "(meal_id, fdc_id, name, quantity, unit, energy, protein, carbs, fats) " +
                        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ",
                        getProductSnapshotValues(meal_id, product)
                    )
                }
            }
        }

        if(planState.patient_id > 0) {
            await client.query(
                "INSERT INTO patient_diet_plan " +
                "(patient_id, diet_plan_id) " +
                "VALUES ($1, $2) ",
                [planState.patient_id, plan_id]
            )
        }

        await client.query("COMMIT")
        res.status(201).json({
            message: "Plan zapisany"
        })

    } catch (err) {
        await client.query("ROLLBACK")

        console.error("Błąd przy zapisywaniu planu", err)
        res.status(err.status ?? 500).json({
            message: err.status ? err.message : "Błąd serwera"
        })

    } finally {
        client.release()
    }
}

export async function editPlan(req, res) {
    const client = await appDb.connect()

    try {
        if (req.user.role !== "dietetyk") {
            return res.status(403).json({
                message: "Brak uprawnień do wykonania operacji"
            })
        }

        const user_id = req.user.id

        const dieticianRes = await appDb.query(
            "SELECT id FROM dieticians WHERE user_id = $1;",
            [user_id]
        );

        const dietician_id = dieticianRes.rows[0]?.id;
        if (!dietician_id) {
            return res.status(404).json({
                message: "Brak dietetyka przypisanego do konta uzytkownika"
            })
        }

        const planState = req.body.planState
        if(!planState) {
            return res.status(400).json({
                message: "Brak danych do zapisania"
            })
        }

        const plan_id = req.params.id

        await client.query("BEGIN")

        const updateResult = await client.query(
            "UPDATE diet_plans dp " +
            "SET title = $1, description = $2 " +
            "FROM dieticians d " +
            "WHERE d.user_id = $3 AND dp.dietician_id = d.id AND dp.id = $4",
            [planState.title, planState.description, user_id, plan_id]
        )

        if (updateResult.rowCount === 0) {
            const error = new Error("Nie znaleziono planu")
            error.status = 404
            throw error
        }

        await client.query(
            "DELETE FROM diet_days " +
            "WHERE diet_plan_id = $1",
            [plan_id]
        )

        for (const day of planState.days) {
            const dayRes = await client.query(
                "INSERT INTO diet_days " +
                "(diet_plan_id, day_number) " +
                "VALUES ($1, $2) " +
                "RETURNING id",
                [plan_id, day.day_number]
            )
            const day_id = dayRes.rows[0].id

            for (const meal of day.meals) {
                const mealRes = await client.query(
                    "INSERT INTO meals " +
                    "(diet_day_id, name, order_number, notes) " +
                    "VALUES ($1, $2, $3, $4) " +
                    "RETURNING id",
                    [day_id, meal.name, meal.order_number, meal.notes]
                )
                const meal_id = mealRes.rows[0].id

                for (const product of meal.meal_products) {
                    await client.query(
                        "INSERT INTO meal_products " +
                        "(meal_id, fdc_id, name, quantity, unit, energy, protein, carbs, fats) " +
                        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ",
                        getProductSnapshotValues(meal_id, product)
                    )
                }
            }
        }

        // zamiast delete + insert można zrobić
        // INSERT ON CONFLICT DO UPDATE + DELETE nadmiarowych rekordów

        // const patientPlanResult = await client.query(
        //     ""
        // )

        await client.query("COMMIT")
        res.status(200).json({
            message: "Plan edytowany"
        })
    } catch (err) {
        await client.query("ROLLBACK")

        console.error("Błąd przy edytowaniu planu", err)
        res.status(err.status ?? 500).json({
            message: err.status ? err.message : "Błąd serwera"
        })

    } finally {
        client.release()
    }
}

export async function getPlans(req, res) {
    try{
        if (req.user.role !== "dietetyk") {
            return res.status(403).json({
                message: "Brak uprawnień do wykonania operacji"
            })
        }

        const user_id = req.user.id

        const dieticianRes = await appDb.query(
            "SELECT id FROM dieticians WHERE user_id = $1",
            [user_id]
        );

        const dietician_id = dieticianRes.rows[0]?.id;
        if (!dietician_id) {
            return res.status(404).json({
                message: "Brak dietetyka przypisanego do konta uzytkownika"
            })
        }

        const result = await appDb.query(
            "SELECT id, title, description, created_at " +
            "FROM diet_plans " +
            "WHERE dietician_id = $1 " +
            "ORDER BY created_at DESC",
            [dietician_id]
        )

        res.status(200).json({message: "Pomyślnie pobrano plany", plans: result.rows})

    } catch(err) {
        console.error("Błąd przy pobieraniu planów", err)
        res.status(500).json({
            message: "Błąd serwera"
        })
    }
}

export async function getPlansCount(req, res) {
    try {
        const userId = req.user.id
        const result = await appDb.query(
            "SELECT COUNT(*) AS count " +
            "FROM diet_plans dp " +
            "JOIN dieticians d ON dp.dietician_id = d.id " +
            "WHERE d.user_id = $1 ",
            [userId]
        )

        const count = result.rows[0]?.count

        res.status(200).json({message: "Pomyślnie pobrano plany", count});

    } catch(err) {
        console.error("Błąd przy pobieraniu liczby planów", err)
        res.status(500).json({message: "Błąd serwera"})
    }
}

export async function getPlanById(req, res) {
    try{
        if (req.user.role !== "dietetyk") {
            return res.status(403).json({
                message: "Brak uprawnień do wykonania operacji"
            })
        }

        const user_id = req.user.id

        const dieticianRes = await appDb.query(
            "SELECT id FROM dieticians WHERE user_id = $1",
            [user_id]
        );

        const dietician_id = dieticianRes.rows[0]?.id;
        if (!dietician_id) {
            return res.status(404).json({
                message: "Brak dietetyka przypisanego do konta uzytkownika"
            })
        }

        const plan_id = req.params.id

        const plan = await getPlanDataById(plan_id, dietician_id)

        if (!plan) {
            return res.status(404).json({
                message: "Nie znaleziono planu"
            })
        }

        res.status(200).json({message: "Pomyślnie pobrano plany", plan})

    } catch(err) {
        console.error("Błąd przy pobieraniu planów", err)
        res.status(500).json({
            message: "Błąd serwera"
        })
    }
}

export async function deletePlan(req, res) {
    try{
        if (req.user.role !== "dietetyk") {
            return res.status(403).json({
                message: "Brak uprawnień do wykonania operacji"
            })
        }

        const user_id = req.user.id

        const dieticianRes = await appDb.query(
            "SELECT id FROM dieticians WHERE user_id = $1",
            [user_id]
        );

        const dietician_id = dieticianRes.rows[0]?.id;
        if (!dietician_id) {
            return res.status(404).json({
                message: "Brak dietetyka przypisanego do konta uzytkownika"
            })
        }

        const plan_id = req.params.id

        const result = appDb.query(
            "DELETE " +
            "FROM diet_plans " +
            "WHERE id = $1 AND dietician_id = $2",
            [plan_id, dietician_id]
        )

        res.status(200).json({message: "Pomyślnie usunięto plan", id: plan_id})

    } catch(err) {
        console.error("Błąd przy usuwaniu planu", err)
        res.status(500).json({
            message: "Błąd serwera"
        })
    }
}

export async function getLoggedDietician(req, res) {
    const user_id = req.user.id

    try{
        const result = await appDb.query(
            "SELECT full_name, specialization " +
            "FROM dieticians " +
            "WHERE user_id = $1",
            [user_id]
        )

        res.status(200).json({
            message: "Pomyślnie pobrano dietetyka",
            value: result.rows[0]
        })

    } catch (err) {
        console.error("Błąd przy pobieraniu dietetyka", err)
        res.status(500).json({
            message: "Błąd serwera"
        })
    }
}

export async function updateLoggedDietician(req, res) {
    const user_id = req.user.id

    const {full_name, specialization} = req.body

    try {
        const result = await appDb.query(
            "UPDATE dieticians " +
            "SET full_name = $1, specialization = $2 " +
            "WHERE user_id = $3 " +
            "RETURNING full_name, specialization",
            [full_name, specialization, user_id]
        )

        res.status(200).json({
            message: "Pomyślnie edytowano dietetyka",
            value: result.rows[0]
        })

    } catch (err) {
        console.error("Błąd przy edytowaniu dietetyka", err)
        res.status(500).json({
            message: "Błąd serwera"
        })
    }
}

export async function getPatientsPlans(req, res) {
    try{
        const patient_id = req.params.id

        if (req.user.role !== "dietetyk") {
            return res.status(403).json({
                message: "Brak uprawnień do wykonania operacji"
            })
        }

        const user_id = req.user.id

        const dieticianRes = await appDb.query(
            "SELECT id FROM dieticians WHERE user_id = $1",
            [user_id]
        );

        const dietician_id = dieticianRes.rows[0]?.id;
        if (!dietician_id) {
            return res.status(404).json({
                message: "Brak dietetyka przypisanego do konta uzytkownika"
            })
        }

        const result = await appDb.query(
            "SELECT dp.id, dp.title, dp.description, dp.created_at " +
            "FROM diet_plans dp " +
            "JOIN patient_diet_plan pdp " +
            "ON pdp.diet_plan_id = dp.id AND pdp.patient_id = $2 " +
            "WHERE dp.dietician_id = $1 " +
            "ORDER BY dp.created_at DESC",
            [dietician_id, patient_id]
        )

        res.status(200).json({message: "Pomyślnie pobrano plany", plans: result.rows})

    } catch(err) {
        console.error("Błąd przy pobieraniu planów", err)
        res.status(500).json({
            message: "Błąd serwera"
        })
    }
}

export async function getPlanInPDF(req, res) {
    try{
        if (req.user.role !== "dietetyk") {
            return res.status(403).json({
                message: "Brak uprawnień do wykonania operacji"
            })
        }

        const user_id = req.user.id

        const dieticianRes = await appDb.query(
            "SELECT id FROM dieticians WHERE user_id = $1",
            [user_id]
        );

        const dietician_id = dieticianRes.rows[0]?.id;
        if (!dietician_id) {
            return res.status(404).json({
                message: "Brak dietetyka przypisanego do konta uzytkownika"
            })
        }

        const plan_id = req.params.id

        const plan = await getPlanDataById(plan_id, dietician_id)

        if (!plan) {
            return res.status(404).json({
                message: "Nie znaleziono planu"
            })
        }

        const pdf = await getPDFFromPlan(plan)

        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", `attachment; filename="plan-${plan.title}.pdf"`)
        return res.send(pdf)

    } catch(err) {
        console.error("Błąd przy generowaniu PDF planu", err)
        res.status(500).json({
            message: "Błąd serwera"
        })
    }
}
