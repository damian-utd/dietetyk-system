//Patients

import
    React, { useState, useEffect } from "react"
import {
    Link,
    useLoaderData,
    useRevalidator
} from "react-router-dom";

import { requireAuth } from "../../../api/utils.js";
import {deletePatient, getPatients} from "../../../api/app/patients.js";

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
    const revalidator = useRevalidator();
    const [message, setMessage] = useState("")
    const [patients, setPatients] = useState(loaderData.patients)

    async function handleDeletePatient(id, first_name, last_name, index) {
        try {
            await deletePatient(id)
            await revalidator.revalidate()
            setPatients(prev => prev.filter(p => p.id !== id))
            setMessage(`Pomyślnie usunięto pacjenta - ${first_name} ${last_name}`)

        } catch (err) {
            return {error: err.message}
        }
    }

    useEffect(() => {
        if (!message) return
        const timer = setTimeout(() => {
            setMessage("")
        }, 5000)
        return () => clearTimeout(timer);
    }, [message]);

    const patientRows = patients.map((patient, index) => {
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
                        <button
                            className="clearButton"
                            onClick={() => handleDeletePatient(patient.id, patient.first_name, patient.last_name, index)}
                        >
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
                    {message ? <h1 className={styles.message}>{message}</h1> : <div></div>}
                    <div></div>
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
                <div className={styles.buttonContainer}>
                    <Link to="add" className={styles.addPatientButton}>
                        <i className="ri-add-large-line"></i><span>Dodaj pacjenta</span>
                    </Link>
                </div>

            </section>
        </div>
    )
}