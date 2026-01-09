import React from "react"
import mealsStyles from "../styles/Meals.module.css";

export default function PlanMacros({energy, protein, carbs, fats}) {

    return (
        <div className={mealsStyles.mealMacros}>
            <span className={mealsStyles.mealNotes}>
                Energia: {energy} kcal
            </span>
            <span className={mealsStyles.mealNotes}>
                Białko: {protein} g
            </span>
            <span className={mealsStyles.mealNotes}>
                Węglowodany: {carbs} g
            </span>
            <span className={mealsStyles.mealNotes}>
                Tłuszcz: {fats} g
            </span>
        </div>
    )
}