import React, {useState} from "react"
import mealsStyles from "../styles/Meals.module.css";
import daysStyles from "../styles/Days.module.css"
import PlanProducts from "./PlanProducts.jsx";

export default function PlanMeal({ meal, planDispatch, isLast }) {

    const [showNameInput, setShowNameInput] = useState(false)
    const [showNotesInput, setShowNotesInput] = useState(false)
    const [showSearchProducts, setShowSearchProducts] = useState(false)

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
        <section className={`${mealsStyles.mealSection} ${isLast ? mealsStyles.lastMeal : ''}`}>
            <div
                key={meal.order_number}
                className={`${mealsStyles.mealContainer}`}
            >
                <div>
                    <i className={`ri-delete-bin-6-line`} style={{fontSize: "1.5rem", cursor: "pointer"}}
                       onDoubleClick={() => deleteMeal()}>
                    </i>
                    <div className={mealsStyles.mealTitle} >
                        {showNameInput
                            ? <input
                                defaultValue={meal.name}
                                className={daysStyles.mealInput}
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
                                className={daysStyles.mealInput}
                                name="update_meal_notes"
                                onBlur={(e) => updateMeal(e)}
                                onKeyDown={(e) => e.key === "Enter" && updateMeal(e)}
                                autoFocus={true}
                            />
                            : <span
                                className={mealsStyles.mealNotes}
                                onDoubleClick={() => setShowNotesInput(true)}
                            >
                                {meal.notes}
                            </span>}
                    </div>
                    <div className={mealsStyles.mealInfo}>
                        białko: 10g
                        węglowodany: 10g
                        tłuszcze: 10g
                    </div>

                </div>
                <button type="button" className={daysStyles.addMealButton} onClick={() => setShowSearchProducts(prev => !prev)}>{showSearchProducts ? "Ukryj" : "Dodaj produkt"}</button>
            </div>
            <PlanProducts
                meal={meal}
                showSearchProducts={showSearchProducts}
                planDispatch={planDispatch}
            />

        </section>
    )
}