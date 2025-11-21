import React from "react"
import {useOutletContext} from "react-router-dom";
import {requireAuth, roundDec} from "../../../utils/utils.js";
import {calcBMI, calcBMR, calcTDEE} from "../../../utils/calcs.js"
import styles from "./Patients.module.css"
import Cards from "../../../components/Cards.jsx";

export async function loader({ request }) {
    await requireAuth(request)
}

export default function PatientsAnalysis() {
    const patient = useOutletContext()

    const bmi = calcBMI(patient.weight, patient.height)
    const bmr = calcBMR(patient.weight, patient.height, patient.age, patient.sex)
    const tdee = calcTDEE(bmr, patient.activity_level)

    const calcs = {
        bmi: { ...bmi, value: roundDec(bmi.value, 2), visual: true },
        bmr: { ...bmr, value: roundDec(bmr.value, 0) },
        tdee: { ...tdee, value: roundDec(tdee.value, 0) }
    }

    return (
        <section className={styles.patientsSection}>
            <section>
                <Cards
                    data={calcs}
                    className="big"
                />

            </section>
        </section>
    )
}