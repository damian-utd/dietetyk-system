import React from "react"
import mealsStyles from "../styles/Meals.module.css";
import {roundDec} from "../../../../utils/utils.js";

export default function PlanMacros({energy, protein, carbs, fats}) {

    return (
        <div className={mealsStyles.mealMacros}>
            <span className={mealsStyles.mealNotes}>
                Energia: {roundDec(energy, 2)} kcal
            </span>
            <span className={mealsStyles.mealNotes}>
                Białko: {roundDec(protein, 2)} g
            </span>
            <span className={mealsStyles.mealNotes}>
                Węglowodany: {roundDec(carbs, 2)} g
            </span>
            <span className={mealsStyles.mealNotes}>
                Tłuszcz: {roundDec(fats, 2)} g
            </span>
        </div>
    )
}