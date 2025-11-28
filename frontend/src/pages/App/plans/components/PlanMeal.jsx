import React from "react"
import styles from "../Plans.module.css";

export default function PlanMeal({ meal, planDispatch }) {

    function deleteMeal(order_number) {
        planDispatch({
            type: 'deleteMeal',
            order: order_number
        })
    }

    return (
        <div
            key={meal.order_number}
            className={styles.mealContainer}
        >
            <i className="ri-delete-bin-6-line" onClick={() => deleteMeal(meal.order_number)}></i>
            {meal.name} - {meal.notes}
            <ul>
                {meal.meal_products.map((product, index) => (
                    <li key={index}>
                        <p>Produkt: {product.product_id}</p>
                        <p>Ilość: {product.quantity} {product.unit}</p>

                    </li>
                ))}
            </ul>
        </div>
    )
}