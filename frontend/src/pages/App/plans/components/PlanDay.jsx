//PlanDay

import React, {useState, useRef, useEffect} from "react"

import daysStyles from "../styles/Days.module.css"
import PlanMeal from "./PlanMeal.jsx";
import PlanMacros from "./PlanMacros.jsx";
import {calcMacrosForWeight} from "../../../../utils/calcs.js";

export default function PlanDay({ day, planDispatch }) {

    const [showMealForm, setShowMealForm] = useState(false)
    const [dayMacros, setDayMacros] = useState({energy: 0, protein: 0, carbs: 0, fats: 0})
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
                setDayMacros={setDayMacros}
            />
        )
    })

    const calculateDayMacros = (day) =>
        day.meals.reduce(
            (dayAcc, meal) => {
                meal.meal_products.forEach(mp => {
                    dayAcc.energy  += calcMacrosForWeight(mp.energy,  mp.quantity);
                    dayAcc.protein += calcMacrosForWeight(mp.protein, mp.quantity);
                    dayAcc.carbs   += calcMacrosForWeight(mp.carbs,   mp.quantity);
                    dayAcc.fats    += calcMacrosForWeight(mp.fats,    mp.quantity);
                });
                return dayAcc;
            },
            { energy: 0, protein: 0, carbs: 0, fats: 0 }
        );

    useEffect(() => {
        setDayMacros(calculateDayMacros(day));
    }, [day]);


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
            <div className={daysStyles.daySummary}>
                <PlanMacros
                    energy={dayMacros?.energy || 0}
                    protein={dayMacros?.protein || 0}
                    carbs={dayMacros?.carbs || 0}
                    fats={dayMacros?.fats || 0}
                />
            </div>
        </div>
    )
}