import React from "react"

import sideStyles from "../styles/Side.module.css"
import {calcBMR, calcTDEE} from "../../../../utils/calcs.js";
import {roundDec} from "../../../../utils/utils.js";

export default function PlanDaySummary({dayMacros, patient, currentDayNumber}) {
    const {energy = 0, protein = 0, carbs = 0, fats = 0} = dayMacros ?? {}
    const tdee = calcTDEE(
        calcBMR(patient?.weight, patient?.height, patient?.age, patient?.sex),
        patient?.activity_level
    ).value || 0

    const macroCalories = protein * 4 + carbs * 4 + fats * 9
    const macroItems = [
        {label: "Białko", value: protein, share: macroCalories ? protein * 4 / macroCalories * 100 : 0},
        {label: "Węglowodany", value: carbs, share: macroCalories ? carbs * 4 / macroCalories * 100 : 0},
        {label: "Tłuszcze", value: fats, share: macroCalories ? fats * 9 / macroCalories * 100 : 0}
    ]
    const energyProgress = tdee ? energy / tdee * 100 : 0

    return (
        <section className={sideStyles.daySummary}>
            <div className={sideStyles.summaryHeader}>
                <div>
                    <span>Podsumowanie</span>
                    <h2>Dzień {currentDayNumber}</h2>
                </div>
                <strong>{energy} kcal</strong>
            </div>

            <div className={sideStyles.energySummary}>
                <div className={sideStyles.summaryRow}>
                    <span>Energia względem CPM</span>
                    <span>{tdee ? `${roundDec(energyProgress, 0)}%` : "Brak danych pacjenta"}</span>
                </div>
                <div className={sideStyles.progressTrack}>
                    <span style={{width: `${Math.min(energyProgress, 100)}%`}} />
                </div>
                {tdee > 0 && <small>{energy} / {tdee} kcal</small>}
            </div>

            <div className={sideStyles.macroList}>
                {macroItems.map(macro => (
                    <div className={sideStyles.macroItem} key={macro.label}>
                        <div className={sideStyles.summaryRow}>
                            <strong>{macro.label}</strong>
                            <span>{macro.value} g · {roundDec(macro.share, 0)}%</span>
                        </div>
                        <div className={sideStyles.progressTrack}>
                            <span style={{width: `${macro.share}%`}} />
                        </div>
                    </div>
                ))}
            </div>
            <small className={sideStyles.summaryHint}>
                Udział makroskładników wyliczony z wartości energetycznej aktualnego dnia.
            </small>
        </section>
    )
}
