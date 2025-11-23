//PlanDay

import React, {useState, useRef} from "react"

import styles from "../Plans.module.css"

export default function PlanDay({ day, planDispatch }) {

    const [showMealForm, setShowMealForm] = useState(false)
    const mealName = useRef(null)
    const mealNotes = useRef(null)


    function handleAddMeal() {
        if (!showMealForm) {
            setShowMealForm(true)
            return
        }

        planDispatch({
            type: 'addMeal',
            name: mealName.current.value,
            notes: mealNotes.current.value
        })

        setShowMealForm(false)
        mealName.current.value = ""
        mealNotes.current.value = ""
    }

    function handleBack() {
        mealName.current.value = ""
        mealNotes.current.value = ""
        setShowMealForm(false)
    }

    const meals = day.meals.map(meal => {
        return (
            <div key={meal.order_number} >
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
    })

    return (
        <div className={styles.dayContainer}>
            {meals}
            {showMealForm &&
                <div>
                    <input
                        type="text"
                        ref={mealName}
                        placeholder="np. Śniadanie"
                    />
                    <input
                        type="text"
                        ref={mealNotes}
                        placeholder="Notatka... "
                    />
                    <button type="button" onClick={handleBack}>Wróć</button>
                </div>
            }
            <button
                type="button"
                className={`${styles.addMealButton} ${!showMealForm && styles.addMealButtonLarge}`}
                onClick={handleAddMeal}
            >
                + Dodaj posiłek
            </button>

        </div>
    )
}