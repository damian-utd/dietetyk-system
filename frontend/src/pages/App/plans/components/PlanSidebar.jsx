//Sidebar

import React from "react"

import sideStyles from "../styles/Side.module.css"

export default function PlanSidebar({ clearPlan }) {

    return (
        <section className={sideStyles.side}>
            <div className={sideStyles.buttonContainer}>
                <button className={sideStyles.saveButton} form="planForm">Zapisz plan</button>
                <button type="button" className={sideStyles.pdfButton}>Wygeneruj pdf</button>
                <button type="button" className={sideStyles.saveButton} onClick={clearPlan}>Wyczysc plan</button>
            </div>
            <div className={sideStyles.nutritionProgress}>
            {/* todo - dodać dynamiczny progres makro */}
            </div>
        </section>
    )
}