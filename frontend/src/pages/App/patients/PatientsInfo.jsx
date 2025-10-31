import React from "react"
import {useLoaderData} from "react-router-dom";
import {requireAuth} from "../../../api/utils.js";
import {getPatientById} from "../../../api/app/diet.js";

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
    const { patient } = useLoaderData()
    console.log(patient)

    return (
        <h1>Patients info</h1>
    )
}