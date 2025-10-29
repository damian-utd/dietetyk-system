//Patients

import React from "react"
import {
    Form,
    Link
} from "react-router-dom";
import { requireAuth } from "../../../api/utils.js";
import { addPatient } from "../../../api/app/diet.js";

import styles from "./Patients.module.css"

export async function loader( { request }) {
    await requireAuth(request)
    return null
}

export default function Patients() {

    return (
        <div className={styles.patientsBody}>
            <h1>Patients</h1>
            <Link to="add">
                Dodaj pacjenta
            </Link>

        </div>
    )
}