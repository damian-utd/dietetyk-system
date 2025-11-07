import React from "react"
import {NavLink, useLoaderData, Outlet} from "react-router-dom";
import {requireAuth} from "../../../api/utils.js";
import {getPatientById} from "../../../api/app/diet.js";
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

export default function PatientsInfo() {
    const { patient } = useLoaderData()

    return (
        <div className={styles.patientsBody}>
            <nav className={styles.patientsInfoNav}>
                <NavLink
                    to="./"
                    style={({isActive}) => (
                        isActive ? "" : ""
                    )}
                >
                    Analiza
                </NavLink>
                <NavLink
                    to="health"
                    style={({isActive}) => (
                        isActive ? "" : ""
                    )}
                >
                    Dane zdrowotne
                </NavLink>
                <NavLink
                    to="personal"
                    style={({isActive}) => (
                        isActive ? "" : ""
                    )}
                >
                    Dane osobowe
                </NavLink>
            </nav>

            <Outlet context={patient}/>

        </div>
    )
}