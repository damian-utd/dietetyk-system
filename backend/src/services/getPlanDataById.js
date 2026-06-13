import { appDb } from "../config/db.js";

export async function getPlanDataById(plan_id, dietician_id) {

    const planRes = await appDb.query(
        "SELECT title, description " +
        "FROM diet_plans " +
        "WHERE id = $1 AND dietician_id = $2",
        [plan_id, dietician_id]
    )

    if (planRes.rows.length === 0) {
        return null
    }

    const patientRes = await appDb.query(
        "SELECT patient_id " +
        "FROM patient_diet_plan " +
        "WHERE diet_plan_id = $1",
        [plan_id]
    )



    let plan = {
        currentDayNumber: 1,
        patient_id: patientRes.rows[0]?.patient_id || -1,
        title: planRes.rows[0].title,
        description: planRes.rows[0].description,
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
                "SELECT fdc_id, name, quantity, unit, energy, protein, carbs, fats " +
                "FROM meal_products " +
                "WHERE meal_id = $1",
                [meal.id]
            )

            for (const product of productsRes.rows) {
                plan.days[plan.days.length - 1].meals[plan.days[plan.days.length - 1].meals.length - 1].meal_products.push({
                    fdcId: product.fdc_id,
                    name: product.name,
                    quantity: Number(product.quantity),
                    unit: product.unit,
                    energy: Number(product.energy),
                    protein: Number(product.protein),
                    carbs: Number(product.carbs),
                    fats: Number(product.fats)
                })
            }
        }
    }

    return plan
}
