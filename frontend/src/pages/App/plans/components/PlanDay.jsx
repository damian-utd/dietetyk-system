//PlanDay

import React, {useState, useRef} from "react"

import styles from "../Plans.module.css"
import PlanMeal from "./PlanMeal.jsx";

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

    function clearMealForm() {
        mealName.current.value = ""
        mealNotes.current.value = ""
        setShowMealForm(false)
    }

    const meals = day.meals.map(meal => {
        return (
            <PlanMeal
                key={meal.order_number}
                meal={meal}
                planDispatch={planDispatch}
            />
        )
    })

    return (
        <div className={styles.dayContainer}>
            {meals}
            <div className={styles.mealFormContainer}>
                {showMealForm &&
                    <div className={styles.mealForm}>
                        <button
                            type="button"
                            onClick={clearMealForm}
                            className={styles.backArrow}
                        >
                            <i className="ri-arrow-left-fill"></i>
                        </button>
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
                    </div>
                }
                <button
                    type="button"
                    className={`${styles.addMealButton} ${!showMealForm && styles.addMealButtonLarge}`}
                    onClick={handleAddMeal}
                >
                    <i className="ri-add-large-line"></i> Dodaj posiłek
                </button>
            </div>

        </div>
    )
}