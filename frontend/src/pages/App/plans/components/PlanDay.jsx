//PlanDay

import React, {useState, useRef} from "react"

import daysStyles from "../styles/Days.module.css"
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

    const meals = day.meals.map((meal, index) => {
        return (
            <PlanMeal
                key={meal.order_number}
                meal={meal}
                planDispatch={planDispatch}
                isLast={index === day.meals.length - 1 && !showMealForm}
            />
        )
    })

    return (
        <div className={daysStyles.dayContainer}>
            {meals}
            <div className={daysStyles.mealFormContainer}>
                {showMealForm &&
                    <div className={daysStyles.mealForm}>
                        <button
                            type="button"
                            onClick={clearMealForm}
                            className={daysStyles.backArrow}
                        >
                            <i className="ri-arrow-left-fill"></i>
                        </button>
                        <input
                            type="text"
                            ref={mealName}
                            placeholder="np. Śniadanie"
                            className={daysStyles.mealInput}
                            onKeyDown={(e) => e.key === "Enter" && handleAddMeal()}
                        />
                        <input
                            type="text"
                            ref={mealNotes}
                            placeholder="Notatka... "
                            className={daysStyles.mealInput}
                            onKeyDown={(e) => e.key === "Enter" && handleAddMeal()}
                        />
                    </div>
                }
                <button
                    type="button"
                    className={`${daysStyles.addMealButton} ${!showMealForm && daysStyles.addMealButtonLarge}`}
                    onClick={handleAddMeal}
                >
                    <i className="ri-add-large-line"></i> Dodaj posiłek
                </button>
            </div>

        </div>
    )
}