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

    return {
        value: data,
        title: "Liczba pacjentów"
    }
}

export async function getPatients() {
    const res = await fetch("/api/diet/patients", {
        credentials: "include"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return data
}

export async function addPatient(patientData) {
    const res = await fetch("/api/diet/patients-add", {
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

export async function getPatientById(id) {
    const res = await fetch(`/api/diet/patients/${id}`, {
        credentials: "include"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return data
}

export async function updatePatient(id, patientData) {
    const res = await fetch(`/api/diet/patients/${id}/update`, {
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