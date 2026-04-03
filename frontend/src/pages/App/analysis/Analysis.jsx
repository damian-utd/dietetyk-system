//Analysis

import React, {useReducer} from "react"
import {requireAuth, roundDec} from "../../../utils/utils.js";
import Cards from "../../../components/Cards.jsx";
import {calcBMI, calcBMR, calcTDEE} from "../../../utils/calcs.js";
import patientsStyles from "../patients/Patients.module.css"
import styles from "./Analysis.module.css"

export async function loader( { request }){
    await requireAuth(request)
}

function mReducer(state, action){
    switch(action.type){
        case 'setValue': {
            return {
                ...state,
                [action.field]: action.value
            }
        }
    }
}

export default function Analysis() {

    const [measurements, mDispatch] = useReducer(mReducer, {
        weight: 0,
        height: 0,
        age: 0,
        sex: '',
        activity_level: 0
    })

    const bmi = calcBMI(measurements.weight, measurements.height)
    const bmr = calcBMR(measurements.weight, measurements.height, measurements.age, measurements.sex)
    const tdee = calcTDEE(bmr, measurements.activity_level)

    const calcs = {
        bmi: { ...bmi, value: roundDec(bmi.value, 2), visual: !!bmi.value },
        bmr: { ...bmr, value: roundDec(bmr.value, 0) },
        tdee: { ...tdee, value: roundDec(tdee.value, 0) }
    }

    return (
        <section className={styles.analysisBody}>
            <h1>Analysis</h1>
            <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                    <div>
                        <label htmlFor="weight">Waga</label>
                        <input
                            type="number"
                            id="weight"
                            value={measurements.weight}
                            onChange={(e) =>
                                mDispatch({type: 'setValue', field: e.target.id, value: e.target.value})
                            }
                            className={styles.analysisInput}
                        />
                    </div>
                    <div>
                        <label htmlFor="height">Wzrost</label>
                        <input
                            type="number"
                            id="height"
                            value={measurements.height}
                            onChange={(e) =>
                                mDispatch({type: 'setValue', field: e.target.id, value: e.target.value})
                            }
                            className={styles.analysisInput}
                        />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <div>
                        <label htmlFor="age">Wiek</label>
                        <input
                            type="number"
                            id="age"
                            value={measurements.age}
                            onChange={(e) =>
                                mDispatch({type: 'setValue', field: e.target.id, value: e.target.value})
                            }
                            className={styles.analysisInput}
                        />
                    </div>
                    <div>
                        <label htmlFor="sex">Płeć</label>
                        <select
                            id="sex"
                            defaultValue=""
                            onChange={(e) =>
                                mDispatch({type: 'setValue', field: e.target.id, value: e.target.value})
                            }
                            className={styles.analysisInput}
                        >
                            <option value="" disabled>Wybierz</option>
                            <option value="male">Mężczyzna</option>
                            <option value="female">Kobieta</option>
                            <option value="other">Inne / Nie chcę podawać</option>
                        </select>
                    </div>
                </div>
                <div className={styles.inputGroup}>
                    <div>
                        <label htmlFor="activity_level">Poziom aktywności</label>
                        <select
                            id="activity_level"
                            defaultValue=""
                            onChange={(e) =>
                                mDispatch({type: 'setValue', field: e.target.id, value: e.target.value})
                            }
                            className={styles.analysisInput}

                        >
                            <option value="" disabled>Wybierz</option>
                            <option value="1.2">Brak aktywności fizycznej</option>
                            <option value="1.375">Lekka aktywność</option>
                            <option value="1.55">Średnia aktywność</option>
                            <option value="1.725">Wysoka aktywność</option>
                            <option value="1.9">Bardzo wysoka aktywność fizyczna</option>
                        </select>
                    </div>
                </div>
            </div>

            <Cards
                data={calcs}
                className="big"
            />
        </section>
    )
}