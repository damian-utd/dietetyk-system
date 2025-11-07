import React from "react"
import {useOutletContext} from "react-router-dom";
import {calcBMI, calcBMR, calcTDEE, requireAuth} from "../../../api/utils.js";
import styles from "./Patients.module.css"

export async function loader({ request }) {
    await requireAuth(request)
}

export default function PatientsAnalysis() {
    const { patient } = useOutletContext()
    console.log(patient)
    const bmi = calcBMI(patient.weight, patient.height)
    const bmr = calcBMR(patient.weight, patient.height, patient.age, patient.sex)
    const tdee = calcTDEE(bmr, patient.activity_level)
    const calcs = {
        bmi: bmi,
        bmr: bmr,
        tdee: tdee
    }

    return (
        <section className={styles.patientsSection}>
            <h1>PatientsAnalysis</h1>
        </section>
    )
}