//Day

import React from "react"

export default function PlanDay({ day }) {

    const meals = day.meals.map((meal, index) => {
        return (
            <div key={index} >
                {meal.name}
                <ul>
                    {meal.meal_products.map((product, pindex) => (
                        <li key={pindex}>
                            <p>Produkt: {product.product_id}</p>
                            <p>Ilość: {product.quantity} {product.unit}</p>
                        </li>
                    ))}
                </ul>
            </div>
        )
    })

    return (
        <div>
            {meals}
            <div onClick={() => {}}>+</div> {/* dodać funkcje addMeal */}
        </div>
    )
}