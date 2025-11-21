import React from "react"
import {NavLink, useLoaderData, Outlet} from "react-router-dom";
import {requireAuth} from "../../../utils/utils.js";
import {getPatientById} from "../../../api/app/patients.js";
import styles from "./Patients.module.css";


export async function loader( { request, params }) {
    await requireAuth(request)

    const patient_id = params.id
    try {
        return await getPatientById(patient_id)
    } catch (err) {
        return {error: err.message}
    }
}

export default function PatientsInfo() {
    const {message, patient} = useLoaderData()

    const activeStyle = {
        color: "#000",
        borderBottom: "2px solid #7EDC00"
    }

    return (
        <div className={styles.patientsBody}>
            <h1 className={styles.title}>Pacjent - {patient.first_name} {patient.last_name}</h1>
            <nav className={styles.patientsInfoNav}>
                <NavLink
                    to="."
                    style={({isActive}) => (isActive ? activeStyle : null)}
                    end
                >
                    Analiza
                </NavLink>
                <NavLink
                    to="health"
                    style={({isActive}) => (isActive ? activeStyle : null)}
                >
                    Dane zdrowotne
                </NavLink>
                <NavLink
                    to="personal"
                    style={({isActive}) => (isActive ? activeStyle : null)}
                >
                    Dane osobowe
                </NavLink>
            </nav>

            <Outlet context={patient}/>

        </div>
    )
}