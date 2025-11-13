//Patients

import
    React, { useState, useEffect } from "react"
import {
    Link,
    useLoaderData,
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

    const [message, setMessage] = useState("")
    const [showAlert, setShowAlert] = useState(null)
    const [patients, setPatients] = useState(loaderData?.patients || [])

    async function handleDeletePatient() {
        try {
            await deletePatient(showAlert.id)
            setPatients(prev => prev.filter(p => p.id !== showAlert.id))
            setMessage(`Pomyślnie usunięto pacjenta - ${showAlert.first_name} ${showAlert.last_name}`)
            setShowAlert(null)
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

    const patientRows = patients.map((patient) => {
        return (
            <tr key={patient.id}>
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
                            onClick={() => {
                                setShowAlert({id: patient.id, first_name: patient.first_name, last_name: patient.last_name})
                            }}
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
                <div className={styles.buttonContainer} style={{width: "92rem"}}>
                    <Link to="add" className={styles.addPatientButton}>
                        <i className="ri-add-large-line"></i><span>Dodaj pacjenta</span>
                    </Link>
                </div>
                {showAlert &&
                    <>
                        <div
                            className={styles.overlay}
                            onClick={() => setShowAlert(null)}
                        ></div>
                        <div className={styles.alert}>
                            <span>Czy na pewno chcesz usunąć pacjenta <br/><b>{showAlert.first_name} {showAlert.last_name}</b>?</span>
                            <span>Tej akcji nie można cofnąć</span>
                            <div>
                                <button
                                    onClick={handleDeletePatient}
                                >
                                    Tak
                                </button>
                                <button
                                    onClick={() => setShowAlert(null)}
                                >
                                    Nie
                                </button>
                            </div>
                        </div>
                    </>
                }

            </section>
        </div>
    )
}