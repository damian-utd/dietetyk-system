//PlanDay

import React, {useState, useRef, useEffect} from "react"

import daysStyles from "../styles/Days.module.css"
import PlanMeal from "./PlanMeal.jsx";
import PlanMacros from "./PlanMacros.jsx";
import {calcMacrosForWeight} from "../../../../utils/calcs.js";
import PlanDaySummary from "./PlanDaySummary.jsx";
import {roundDec} from "../../../../utils/utils.js";

export default function PlanDay({ day, planDispatch, patient }) {

    const [showMealForm, setShowMealForm] = useState(false)
    const [dayMacros, setDayMacros] = useState({day_number: day.day_number, energy: 0, protein: 0, carbs: 0, fats: 0})
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
                condition={patient?.conditions}
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

                return Object.fromEntries(
                    Object.entries(dayAcc).map(([key, value]) => [
                        key,
                        roundDec(value, 2)
                    ])
                )
            },
            { day_number: day.day_number, energy: 0, protein: 0, carbs: 0, fats: 0 }
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
            <PlanDaySummary
                dayMacros={dayMacros}
                patient={patient}
            />
        </div>
    )
}