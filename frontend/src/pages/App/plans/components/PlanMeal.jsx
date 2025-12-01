import React, {useState} from "react"
import styles from "../Plans.module.css";
import mealsStyles from "../styles/Meals.module.css";
import daysStyles from "../styles/Days.module.css"

export default function PlanMeal({ meal, planDispatch, isLast }) {

    const [showNameInput, setShowNameInput] = useState(false)
    const [showNotesInput, setShowNotesInput] = useState(false)

    function deleteMeal() {
        planDispatch({
            type: 'deleteMeal',
            order: meal.order_number
        })
    }

    function updateMeal(e) {
        if (e.target.name === "update_meal_name") {
            planDispatch({
                type: 'updateMeal',
                order: meal.order_number,
                field: 'name',
                value: e.target.value
            })
            setShowNameInput(false)
        }
        if (e.target.name === "update_meal_notes") {
            planDispatch({
                type: 'updateMeal',
                order: meal.order_number,
                field: 'notes',
                value: e.target.value
            })
            setShowNotesInput(false)
        }
    }

    return (
        <div
            key={meal.order_number}
            className={`${styles.mealContainer} ${isLast ? styles.lastMeal : ''}`}
        >
            <div>
                <i className={`ri-delete-bin-6-line`} style={{fontSize: "1.5rem", cursor: "pointer"}}
                   onDoubleClick={() => deleteMeal()}></i>
                <div className={styles.mealTitle} >
                    {showNameInput
                        ? <input
                            defaultValue={meal.name}
                            className={styles.mealInput}
                            name="update_meal_name"
                            onBlur={(e) => updateMeal(e)}
                            onKeyDown={(e) => e.key === "Enter" && updateMeal(e)}
                            autoFocus={true}
                        />
                        : <h3
                            onDoubleClick={() => setShowNameInput(prev => !prev)}
                        >
                            {meal.name}
                        </h3>}
                    {showNotesInput
                        ? <input
                            defaultValue={meal.notes}
                            className={styles.mealInput}
                            name="update_meal_notes"
                            onBlur={(e) => updateMeal(e)}
                            onKeyDown={(e) => e.key === "Enter" && updateMeal(e)}
                            autoFocus={true}
                        />
                        : <span
                            className={styles.mealNotes}
                            onDoubleClick={() => setShowNotesInput(true)}
                        >
                            {meal.notes}
                        </span>}
                </div>
                <div className={styles.mealInfo}>
                    białko: 10g
                    węglowodany: 10g
                    tłuszcze: 10g
                </div>

            </div>
            <button type="button" className={styles.addMealButton}>Dodaj produkt</button>


            {/*<ul>*/}
            {/*    {meal.meal_products.map((product, index) => (*/}
            {/*        <li key={index}>*/}
            {/*            <p>Produkt: {product.product_id}</p>*/}
            {/*            <p>Ilość: {product.quantity} {product.unit}</p>*/}

            {/*        </li>*/}
            {/*    ))}*/}
            {/*</ul>*/}
        </div>
    )
}