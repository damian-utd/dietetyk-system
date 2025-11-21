import React from "react"
import {
    NavLink,
    redirect
} from "react-router-dom"

import PatientForm from "./components/PatientForm.jsx"

import styles from "./Patients.module.css"
import { addPatient } from "../../../api/app/patients.js";
import {requireAuth} from "../../../api/utils.js";

export async function action({ request }) {
    const formData = await request.formData()
    const data = Object.fromEntries(formData);

    try {
        await addPatient(data)
        return  redirect("/patients")
    } catch(err) {
        return err.message
    }
}

export async function loader( { request }) {
    await requireAuth(request)
    return null
}

export default function PatientAdd() {

    return (
        <div className={styles.patientsBody}>
            <NavLink to="/patients">
                <i className="ri-arrow-go-back-line"></i> Powrót
            </NavLink>
            <PatientForm/>
        </div>
    )
}