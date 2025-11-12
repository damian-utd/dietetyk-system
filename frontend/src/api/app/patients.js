//patients.js

import {sleep} from "../utils.js";

export async function getPatientsCount() {
    const res = await fetch("/api/patients/count", {
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
    const res = await fetch("/api/patients", {
        credentials: "include"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return data
}

export async function addPatient(patientData) {
    const res = await fetch("/api/patients/add", {
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
    const res = await fetch(`/api/patients/${id}`, {
        credentials: "include"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return data
}

export async function updatePatient(id, patientData) {
    const res = await fetch(`/api/patients/${id}/update`, {
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

export async function deletePatient(id) {
    const res = await fetch(`/api/patients/${id}`, {
        method: "DELETE",
        credentials: "include"
    });

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return data
}