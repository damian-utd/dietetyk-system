//diet.js

import {sleep} from "../utils.js";

export async function getPatientsCount() {
    const res = await fetch("/api/diet/patients-count", {
        credentials: "include"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    await sleep(1000) // żeby pokazać deffered data

    return data
}

export async function addPatient(patientData) {
    const res = await fetch("/api/diet/patient-add", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(patientData),
        credentials: "include"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return data
}