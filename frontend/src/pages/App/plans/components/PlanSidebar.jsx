//Sidebar

import React from "react"

import sideStyles from "../styles/Side.module.css"
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {deletePlan, getPlanInPDF} from "../../../../api/app/diet.js";
import Modal from "../../../../components/Modal.jsx";

export default function PlanSidebar({ clearPlan, patient, patientId }) {

    const location = useLocation()
    const params = useParams()
    const navigate = useNavigate()

    async function handleDeletePlan() {
        try {
            await deletePlan(params.id)
            navigate(-1)
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async function handleGetPlanInPDF() {
        try {
            await getPlanInPDF(params.id)
        } catch (error) {
            throw new Error(error.message);
        }
    }

    const conditions = ["Brak", "Gluten", "Skorupiaki", "Jaja", "Ryby", "Orzeszki ziemne (arachidowe)", "Soja", "Mleko", "Orzechy", "Seler", "Gorczyca", "Nasiona sezamu", "Dwutlenek siarki", "Łubin", "Mięczaki"]

    return (
        <section className={sideStyles.side}>
            <div className={sideStyles.buttonContainer}>
                {location.pathname === "/plans/create" ?
                    <button className={sideStyles.saveButton} name="intent" value="create" form="planForm">Zapisz plan</button> :
                    <div className={sideStyles.buttonContainer}>
                        <button className={patientId !== (patient?.id ?? -1) ? sideStyles.saveButtonLocked : sideStyles.saveButton} name="intent" value="update" form="planForm" disabled={patientId !== (patient?.id || -1)}>Edytuj aktualny plan</button>
                        <button className={sideStyles.saveButton} name="intent" value="create" form="planForm">Zapisz jako nowy plan</button>
                    </div>

                }

                {
                    location.pathname !== "/plans/create" ?
                    <button
                        type="button"
                        className={sideStyles.pdfButton}
                        onClick={handleGetPlanInPDF}
                    >
                        Wygeneruj pdf
                    </button> : <div></div>
                }
                {location.pathname === "/plans/create" ?
                    <Modal
                        delFunc={clearPlan}
                        delText={"Czy na pewno chcesz wyczyścić kreator?"}
                        buttonClass={sideStyles.saveButton}
                        buttonText="Wyczyść plan"
                    />
                    :
                    <Modal
                        delFunc={handleDeletePlan}
                        delText={"Czy na pewno chcesz usunąć plan żywieniowy?"}
                        buttonClass={sideStyles.saveButton}
                        buttonText="Usuń plan"
                    />
                }

            </div>
            <div className={sideStyles.nutritionProgress}>
                {patient?.conditions && <h1>Alergie: {conditions[patient.conditions]}</h1>}
                {patient?.goal && <h1>Cel: {patient.goal}</h1>}
            </div>
        </section>
    )
}