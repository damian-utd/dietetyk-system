import React, {useState} from "react"
import {useOutletContext} from "react-router-dom";
import {requireAuth, roundDec} from "../../../utils/utils.js";
import {calcBMI, calcBMR, calcTDEE} from "../../../utils/calcs.js"
import styles from "./Patients.module.css"
import Cards from "../../../components/Cards.jsx";
import PatientsProgress from "./components/PatientsProgress.jsx";
import PatientsNotes from "./components/PatientsNotes.jsx";

export async function loader({ request }) {
    await requireAuth(request)
}

export default function PatientsAnalysis() {
    const patient = useOutletContext()
    const [patientsWeight, setPatientsWeight] = useState(patient.weight)

    const bmi = calcBMI(patientsWeight, patient.height)
    const bmr = calcBMR(patientsWeight, patient.height, patient.age, patient.sex)
    const tdee = calcTDEE(bmr, patient.activity_level)

    const calcs = {
        bmi: { ...bmi, value: roundDec(bmi.value, 2), visual: true },
        bmr: { ...bmr, value: roundDec(bmr.value, 0) },
        tdee: { ...tdee, value: roundDec(tdee.value, 0) }
    }

    return (
        <section className={styles.patientsSection}>
            <Cards
                data={calcs}
                className="big"
            />

            <div>
                <PatientsProgress
                    patient={patient}
                    setPatientsWeight={setPatientsWeight}
                />
                <PatientsNotes
                    patient={patient}
                />
            </div>
        </section>
    )
}