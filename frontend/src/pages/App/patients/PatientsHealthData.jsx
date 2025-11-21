import React from "react"
import {requireAuth} from "../../../utils/utils.js";
import PatientForm from "./components/PatientForm.jsx";
import {useOutletContext} from "react-router-dom";
import {updatePatient} from "../../../api/app/patients.js";

export async function loader({ request }) {
    await requireAuth(request)
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

export default function PatientsHealthData() {
    const patient = useOutletContext()

    return (
        <>
            <PatientForm
                defValues={patient}
                show="health"
            />
        </>

    )
}