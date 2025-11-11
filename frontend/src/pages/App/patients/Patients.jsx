//Patients

import React from "react"
import {
    Link,
    useLoaderData
} from "react-router-dom";

import { requireAuth } from "../../../api/utils.js";
import { getPatients } from "../../../api/app/patients.js";

import styles from "./Patients.module.css"

export async function loader( { request }) {
    await requireAuth(request)

    try {
        return await getPatients()
    } catch (err) {
        return {error: err.message}
    }

}

export default function Patients() {
    const loaderData = useLoaderData()

    const patientRows = loaderData.patients.map(patient => {

        return (
            <tr key={patient.id} className={styles.tableRow}>
                <td>{`${patient.first_name} ${patient.last_name}`}</td>
                <td>{patient.age}</td>
                <td>{patient.conditions === "" ? "Brak" : patient.conditions }</td>
                <td>
                    <div className={styles.optionsRow}>
                        <Link to={`${patient.id}`}>
                            <i className="ri-eye-line"
                               style={{color: "#121A0D", fontSize: "1.75rem", lineHeight: "2rem"}}></i>
                        </Link>
                        <button className="clearButton">
                            <i className="ri-delete-bin-6-line" style={{color: "red", fontSize: "1.75rem", }}></i>
                        </button>
                    </div>
                </td>
            </tr>
        )
    })

    return (
        <div className={styles.patientsBody}>
            <section className={styles.patientsSection}>
                <div className={styles.tableCaption}>
                    <h1>Pacjenci</h1>

                </div>
                <table className={styles.patientsTable}>
                    <thead>
                        <tr>
                            <th>Imię i Nazwisko</th>
                            <th>Wiek</th>
                            <th>Schorzenia / Alergie</th>
                            <th>Opcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patientRows}
                    </tbody>
                </table>
                <Link to="add" className={styles.addPatientButton}>
                    <i className="ri-add-large-line"></i><span>Dodaj pacjenta</span>
                </Link>
            </section>
        </div>
    )
}