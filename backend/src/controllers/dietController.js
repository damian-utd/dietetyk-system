import { appDb, productsDb } from "../config/db.js";

export async function searchProducts(req, res) {
    try {
        if (req.user.role !== "dietetyk") return res.status(403).json({
            message: "Brak uprawnień do wykonania operacji"
        })

        const search = req.body.search

        if(!search || search.length < 3) return res.status(400).json({
            message: "Zbyt krótkie lub brak zapytania"
        })

        const searchArray = search.split(" ").filter(word => word !== "").map((s, index) => {
            if (s !== "") {
                return `%${s}%`
            }
        })

        if(!searchArray) return res.status(400).json({
            message: "Zbyt krótkie lub brak zapytania"
        })

        const ilikes = searchArray.map((s, index) => {
            if (index === 0) {
                return `nazwa_polska ILIKE $${index+1} `
            } else {
                return `AND nazwa_polska ILIKE $${index+1} `
            }
        })

        const query =
            "SELECT p.lp, p.nazwa_polska, p.nazwa_angielska, m.bialko_ogolem_g, m.tluszcz_g, m.weglowodany_ogolem_g, w.energia_1169_2012_kcal " +
            "FROM products p " +
            "JOIN makroskladniki m ON p.lp = m.produkt_id " +
            "JOIN wartosci_energetyczne w ON p.lp = w.produkt_id " +
            "WHERE " +
            ilikes.join("")

        const result = await productsDb.query(query, searchArray)

        res.status(200).json({message: "Pomyślnie wyszukano produkty", products: result.rows})

    } catch (err) {
        console.error("Błąd przy wyszukiwaniu produktów", err)
        res.status(500).json({
            message: "Błąd serwera"
        })
    }
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
                        "(meal_id, product_id, quantity, unit) " +
                        "VALUES ($1, $2, $3, $4) ",
                        [meal_id, product.product, product.quantity, product.unit]
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
        res.status(500).json({
            message: "Błąd serwera"
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

        await client.query(
            "UPDATE diet_plans dp " +
            "SET title = $1, description = $2 " +
            "FROM dieticians d " +
            "WHERE d.user_id = $3 AND dp.dietician_id = d.id AND dp.id = $4",
            [planState.title, planState.description, user_id, plan_id]
        )

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
                        "(meal_id, product_id, quantity, unit) " +
                        "VALUES ($1, $2, $3, $4) ",
                        [meal_id, product.product, product.quantity, product.unit]
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
        res.status(500).json({
            message: "Błąd serwera"
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

        const planRes = await appDb.query(
            "SELECT title, description " +
            "FROM diet_plans " +
            "WHERE id = $1 AND dietician_id = $2",
            [plan_id, dietician_id]
        )

        const patientRes = await appDb.query(
            "SELECT patient_id " +
            "FROM patient_diet_plan " +
            "WHERE diet_plan_id = $1",
            [plan_id]
        )



        let plan = {
            currentDayNumber: 1,
            patient_id: patientRes.rows[0]?.patient_id || -1,
            title: planRes.rows[0]?.title,
            description: planRes.rows[0]?.description,
            days: []
        }

        const daysRes = await appDb.query(
            "SELECT id, day_number " +
            "FROM diet_days " +
            "WHERE diet_plan_id = $1 " +
            "ORDER BY day_number ASC",
            [plan_id]
        )

        for(const day of daysRes.rows) {
            plan.days.push({
                day_number: day.day_number,
                meals: []
            })

            const mealsRes = await appDb.query(
                "SELECT * " +
                "FROM meals " +
                "WHERE diet_day_id = $1 " +
                "ORDER BY order_number ASC",
                [day.id]
            )

            for (const meal of mealsRes.rows) {
                plan.days[plan.days.length - 1].meals.push({
                    name: meal.name,
                    notes: meal.notes,
                    order_number: meal.order_number,
                    meal_products: []
                })

                const productsRes = await appDb.query(
                    "SELECT * " +
                    "FROM meal_products " +
                    "WHERE meal_id = $1",
                    [meal.id]
                )

                for (const product of productsRes.rows) {
                    const macroRes = await productsDb.query(
                        "SELECT p.nazwa_polska, m.bialko_ogolem_g, m.tluszcz_g, m.weglowodany_ogolem_g, w.energia_1169_2012_kcal " +
                        "FROM products p " +
                        "JOIN makroskladniki m ON p.lp = m.produkt_id " +
                        "JOIN wartosci_energetyczne w ON p.lp = w.produkt_id " +
                        "WHERE p.lp = $1 ",
                        [product.product_id]
                    )

                    const carbs = Math.round(parseFloat(macroRes.rows[0]?.weglowodany_ogolem_g.replace(",", ".")) * Number(product.quantity)/100 * 100)/100 || 0
                    const energy = Math.round(parseFloat(macroRes.rows[0]?.energia_1169_2012_kcal.replace(",", ".")) * Number(product.quantity)/100 * 100)/100 || 0
                    const fats = Math.round(parseFloat(macroRes.rows[0]?.tluszcz_g.replace(",", ".")) * Number(product.quantity)/100 * 100)/100 || 0
                    const protein = Math.round(parseFloat(macroRes.rows[0]?.bialko_ogolem_g.replace(",", ".")) * Number(product.quantity)/100 * 100)/100 || 0

                    plan.days[plan.days.length - 1].meals[plan.days[plan.days.length - 1].meals.length - 1].meal_products.push({
                        carbs: carbs,
                        energy: energy,
                        fats: fats,
                        name: macroRes.rows[0].nazwa_polska,
                        protein: protein,
                        product: product.product_id,
                        quantity: Number(product.quantity),
                        unit: product.unit
                    })
                }
            }
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

export async function getBannedProducts(req, res) {
    const condition = req.params.condition

    try {
        const result = await productsDb.query(
            "SELECT ARRAY_AGG (produkt_lp ORDER BY produkt_lp) as prod " +
            "FROM produkt_alergeny " +
            "WHERE alergen_id = $1 ",
            [condition]
        )

        res.status(200).json({message: "Pomyślnie pobrano zabronione produkty", value: result.rows[0].prod ?? []})

    } catch (err) {
        console.error("Błąd przy pobieraniu zabronionych produktów", err)
        res.status(500).json({
            message: "Błąd serwera"
        })
    }
}