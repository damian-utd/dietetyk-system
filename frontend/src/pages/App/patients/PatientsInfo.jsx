import React from "react"
import {Await, NavLink, useLoaderData} from "react-router-dom";
import {requireAuth} from "../../../api/utils.js";
import {getPatientById} from "../../../api/app/diet.js";
import PatientForm from "./components/PatientForm.jsx";
import styles from "./Patients.module.css";
import LoadingCircle from "../../../components/LoadingCircle.jsx";

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