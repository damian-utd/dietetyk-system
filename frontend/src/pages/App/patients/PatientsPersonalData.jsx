import React, {useEffect} from "react"
import {requireAuth} from "../../../utils/utils.js";
import PatientForm from "./components/PatientForm.jsx";
import {redirect, useActionData, useOutletContext} from "react-router-dom";
import {updatePatient} from "../../../api/app/patients.js";

export async function loader({ request }) {
    await requireAuth(request)
}

export async function action( { request, params }) {
    const patient_id = params.id
    const formData = await request.formData()
    const data = Object.fromEntries(formData)

    try {
        const result = await updatePatient(patient_id, data)
        redirect("")
        return {message: result.message, patient: result.patient}
    } catch (err) {
        return {error: err.message}
    }
}

export default function PatientsPersonalData() {
    const { patient, setPatient } = useOutletContext()

    const actionData = useActionData()
    const patientAction = actionData?.patient ?? null

    useEffect(() => {
        if(patientAction) setPatient(patientAction)
    }, [patientAction]);

    return (
        <>
            <PatientForm
                defValues={patientAction || patient}
                show="personal"
            />
        </>
    )
}