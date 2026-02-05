//Sidebar

import React from "react"

import sideStyles from "../styles/Side.module.css"
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {deletePlan} from "../../../../api/app/diet.js";

export default function PlanSidebar({ clearPlan, patient }) {

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

    return (
        <section className={sideStyles.side}>
            <div className={sideStyles.buttonContainer}>
                <button className={sideStyles.saveButton} form="planForm">Zapisz plan</button>
                <button type="button" className={sideStyles.pdfButton}>Wygeneruj pdf</button>
                {location.pathname === "/plans/create" ?
                    <button
                        type="button"
                        className={sideStyles.saveButton}
                        onClick={clearPlan}
                    >
                        Wyczysc plan
                    </button> :
                    <button
                        type="button"
                        className={sideStyles.saveButton}
                        onClick={handleDeletePlan}
                    >
                        Usuń plan
                    </button>
                }

            </div>
            <div className={sideStyles.nutritionProgress}>
                {patient?.conditions && <h1>{patient.conditions}</h1>}
                {patient?.goal && <h1>{patient.goal}</h1>}
            </div>
        </section>
    )
}