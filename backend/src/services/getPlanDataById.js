import { appDb, productsDb } from "../config/db.js";

export async function getPlanDataById(plan_id, dietician_id) {

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

                const carbs = Math.round(parseFloat(macroRes.rows[0]?.weglowodany_ogolem_g.replace(",", ".")) * 100) / 100 || 0
                const energy = Math.round(parseFloat(macroRes.rows[0]?.energia_1169_2012_kcal.replace(",", ".")) * 100) / 100 || 0
                const fats = Math.round(parseFloat(macroRes.rows[0]?.tluszcz_g.replace(",", ".")) * 100) / 100 || 0
                const protein = Math.round(parseFloat(macroRes.rows[0]?.bialko_ogolem_g.replace(",", ".")) * 100) / 100 || 0

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

    return plan
}