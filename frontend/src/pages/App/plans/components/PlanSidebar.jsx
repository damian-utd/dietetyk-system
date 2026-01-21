//Sidebar

import React, {useEffect, useState} from "react"

import sideStyles from "../styles/Side.module.css"
import {calcBMR, calcMacrosForWeight, calcTDEE} from "../../../../utils/calcs.js";
import {roundDec} from "../../../../utils/utils.js";
import PlanMacros from "./PlanMacros.jsx";

export default function PlanSidebar({ clearPlan, days, patient }) {

    const [planMacros, setPlanMacros] = useState({energy: 0, protein: 0, carbs: 0, fats: 0})

    const tdee = (calcTDEE(calcBMR(patient?.weight, patient?.height, patient?.age, patient?.sex), patient?.activity_level).value) || 0

    const calculatePlanMacros = (days) =>
        days.reduce(
            (daysAcc, day) => {
                day.meals.forEach(m => m.meal_products.forEach(mp => {
                    daysAcc.energy  += calcMacrosForWeight(mp.energy,  mp.quantity);
                    daysAcc.protein += calcMacrosForWeight(mp.protein, mp.quantity);
                    daysAcc.carbs   += calcMacrosForWeight(mp.carbs,   mp.quantity);
                    daysAcc.fats    += calcMacrosForWeight(mp.fats,    mp.quantity);
                }))

                return daysAcc
        },
            { energy: 0, protein: 0, carbs: 0, fats: 0 }
    )

    useEffect(() => {
        setPlanMacros(calculatePlanMacros(days));
    }, [days]);

    return (
        <section className={sideStyles.side}>
            <div className={sideStyles.buttonContainer}>
                <button className={sideStyles.saveButton} form="planForm">Zapisz plan</button>
                <button type="button" className={sideStyles.pdfButton}>Wygeneruj pdf</button>
                <button type="button" className={sideStyles.saveButton} onClick={clearPlan}>Wyczysc plan</button>
            </div>
            <div className={sideStyles.nutritionProgress}>
                {patient?.conditions && <h1>{patient.conditions}</h1>}
                {patient?.goal && <h1>{patient.goal}</h1>}
            {/* todo - dodać dynamiczny progres makro */}
                <PlanMacros
                    energy={planMacros.energy}
                    protein={planMacros.protein}
                    carbs={planMacros.carbs}
                    fats={planMacros.fats}
                />
            </div>
        </section>
    )
}