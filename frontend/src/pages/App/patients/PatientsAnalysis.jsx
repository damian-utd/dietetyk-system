import React, {useState} from "react"
import {NavLink, useOutletContext} from "react-router-dom";
import {requireAuth, roundDec} from "../../../utils/utils.js";
import {calcBMI, calcBMR, calcTDEE} from "../../../utils/calcs.js"
import styles from "./Patients.module.css"
import Cards from "../../../components/Cards.jsx";
import PatientsProgress from "./components/PatientsProgress.jsx";
import PatientsNotes from "./components/PatientsNotes.jsx";
import Table from "../../../components/Table.jsx";
import patientStyles from "./Patients.module.css";

export async function loader({ request }) {
    await requireAuth(request)
}

export default function PatientsAnalysis() {
    const { patient, setPatient, plans } = useOutletContext()
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
        <section className={styles.patientsSection} style={{gap: "2rem"}}>
            <Cards
                data={calcs}
                className="big"
            />

            <div className={styles.patientsOverview}>
                <PatientsProgress
                    patient={patient}
                    setPatient={setPatient}
                    setPatientsWeight={setPatientsWeight}
                />
                <PatientsNotes
                    patient={patient}
                />
            </div>
            <section className={styles.plansSection}>
                {plans?.length > 0 &&
                    <>
                        <Table
                            title={"Plany pacjenta"}
                            headers={["Tytuł", "Opis", "Data utworzenia"]}
                            data={plans}
                            showLink={"plans"}
                        />
                        <div className={patientStyles.buttonContainer} style={{width: "92rem"}}>
                            <NavLink to={`/plans/create?patientId=${patient.id}`}
                                     className={patientStyles.addPatientButton}>
                                Utwórz plan dla tego pacjenta
                            </NavLink>
                        </div>
                    </>

                }
            </section>
        </section>
    )
}