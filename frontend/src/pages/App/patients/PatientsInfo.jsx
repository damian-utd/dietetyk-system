import React from "react"
import {NavLink, useLoaderData} from "react-router-dom";
import {requireAuth} from "../../../api/utils.js";
import {getPatientById, updatePatient} from "../../../api/app/diet.js";
import PatientForm from "./components/PatientForm.jsx";
import styles from "./Patients.module.css";


export async function loader( { request, params }) {
    await requireAuth(request)

    const patient_id = params.id
    try {
        return {
            patient: await getPatientById(patient_id)}
    } catch (err) {
        return {error: err.message}
    }
}

export async function action( { request, params }) {
    const patient_id = params.id
    const formData = await request.formData()
    const data = Object.fromEntries(formData)

    try {
        const patient = await updatePatient(patient_id, data)
        return {message: patient.message}
    } catch (err) {
        return {error: err.message}
    }
}

export default function PatientsInfo() {
    const { patient } = useLoaderData()

    return (
        <div className={styles.patientsBody}>
            <NavLink to="/patients">
                <i className="ri-arrow-go-back-line"></i> Powrót
            </NavLink>
            <PatientForm defValues={ patient.patient }/>

        </div>
    )
}