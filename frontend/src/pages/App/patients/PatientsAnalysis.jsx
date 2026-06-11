import React, {useState} from "react"
import {NavLink, useLoaderData, useOutletContext} from "react-router-dom";
import {requireAuth, roundDec} from "../../../utils/utils.js";
import {calcBMI, calcBMR, calcTDEE} from "../../../utils/calcs.js"
import styles from "./Patients.module.css"
import Cards from "../../../components/Cards.jsx";
import PatientsProgress from "./components/PatientsProgress.jsx";
import PatientsNotes from "./components/PatientsNotes.jsx";
import Table from "../../../components/Table.jsx";
import actionStyles from "../../../components/ActionButton.module.css";
import {getProgress} from "../../../api/app/progress.js";
import {getNotes} from "../../../api/app/notes.js";

export async function loader({ request, params }) {
    await requireAuth(request)
    const patient_id = params.id
    try {
        return {
            progress: await getProgress(patient_id),
            notes: await getNotes(patient_id)
        }
    } catch (err) {
        return {error: err.message}
    }
}

export default function PatientsAnalysis() {
    const { patient, setPatient, plans } = useOutletContext()
    const [patientsWeight, setPatientsWeight] = useState(patient.weight)
    const loaderData = useLoaderData()

    const bmi = calcBMI(patientsWeight, patient.height)
    const bmr = calcBMR(patientsWeight, patient.height, patient.age, patient.sex)
    const tdee = calcTDEE(bmr, patient.activity_level)

    const calcs = {
        bmi: { ...bmi, value: roundDec(bmi.value, 2), visual: true },
        bmr: { ...bmr, value: roundDec(bmr.value, 0) },
        tdee: { ...tdee, value: roundDec(tdee.value, 0) }
    }

    return (
        <section className={`${styles.patientsSection} ${styles.analysisSection}`}>
            <Cards
                data={calcs}
                className="big"
            />

            <div className={styles.patientsOverview}>
                <PatientsProgress
                    patient={patient}
                    setPatient={setPatient}
                    setPatientsWeight={setPatientsWeight}
                    progressLoader={loaderData?.progress || []}
                />
                <PatientsNotes
                    patient={patient}
                    notesLoader={loaderData?.notes || []}
                />
            </div>
            <section className={styles.plansSection}>
                {plans?.length > 0 &&
                    <>
                        <Table
                            title={"Plany żywieniowe pacjenta"}
                            headers={["Tytuł", "Opis", "Data utworzenia"]}
                            data={plans}
                            showLink={"plans"}
                        />
                        <div className={`${actionStyles.buttonContainer} ${actionStyles.wideButtonContainer}`}>
                            <NavLink to={`/plans/create?patientId=${patient.id}`}
                                     className={actionStyles.actionButton}>
                                Utwórz plan dla tego pacjenta
                            </NavLink>
                        </div>
                    </>

                }
            </section>
        </section>
    )
}
