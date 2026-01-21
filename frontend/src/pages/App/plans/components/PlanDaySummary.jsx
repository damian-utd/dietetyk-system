import React, {useRef, useState} from "react"
import daysStyles from "../styles/Days.module.css";
import {calcBMR, calcTDEE} from "../../../../utils/calcs.js";
import PlanMacros from "./PlanMacros.jsx";
import {roundDec} from "../../../../utils/utils.js";


export default function PlanDaySummary({dayMacros, patient}) {

    const [ratios, setRatios] = useState({carbs: 0.6, proteins: 0.15, fats: 0.25})

    const {energy, protein, carbs, fats} = dayMacros

    // const tdee = (calcTDEE(calcBMR(patient.weight, patient.height, patient.age, patient.sex), patient.activity_level).value)
    const tdee = 2500

    function updateRatio(key, value) {
        const newValue = Number(value)
        if (newValue < 0 || newValue > 1) return

        setRatios(prev => {
            const restKeys = Object.keys(prev).filter(k => k !== key)

            const restSum = restKeys.reduce((sum, k) => sum + prev[k], 0)

            let next = {
                ...prev,
                [key]: newValue
            }

            if (restSum === 0) {
                const raw = (1 - newValue) / restKeys.length
                next[restKeys[0]] = raw
                next[restKeys[1]] = raw
            } else {
                const scale = (1 - newValue) / restSum
                next[restKeys[0]] = prev[restKeys[0]] * scale
                next[restKeys[1]] = prev[restKeys[1]] * scale
            }

            const rounded = {}
            let sum = 0

            Object.keys(next).forEach((k, i, arr) => {
                if (i === arr.length - 1) {
                    rounded[k] = roundDec(1 - sum, 2)
                } else {
                    rounded[k] = roundDec(next[k], 2)
                    sum += rounded[k]
                }
            })

            return rounded
        })
    }



    const pFinal = roundDec(tdee * ratios.proteins / 4, 2)
    const cFinal = roundDec(tdee * ratios.carbs / 4, 2)
    const fFinal = roundDec(tdee * ratios.fats / 9, 2)

    return (
        <div className={daysStyles.daySummary}>
            <div>
                Energia
            </div>
            <div>
                Białko
            </div>
            <div>
                Węglowodany
            </div>
            <div>
                Tłuszcze
            </div>
            <div>
                {energy} / {tdee} kcal
            </div>
            <div>
                {protein} / {pFinal} g
            </div>
            <div>
                {carbs} / {cFinal} g
            </div>
            <div>
                {fats} / {fFinal} g
            </div>
            <div>
                Procentowy udział B/W/T w diecie
            </div>
            <div className={daysStyles.macroAction}>
                <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={roundDec(ratios.proteins*100, 2)}
                    onChange={e => updateRatio("proteins", e.target.value/100)}
                />
                <span>%</span>
            </div>
            <div className={daysStyles.macroAction}>
                <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={roundDec(ratios.carbs*100, 2)}
                    onChange={e => updateRatio("carbs", e.target.value/100)}
                />
                <span>%</span>
            </div>
            <div className={daysStyles.macroAction}>
                <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={roundDec(ratios.fats*100, 2)}
                    onChange={e => updateRatio("fats", e.target.value/100)}
                />
                <span>%</span>
            </div>
        </div>
    )
}