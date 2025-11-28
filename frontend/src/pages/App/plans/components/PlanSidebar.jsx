//Sidebar

import React from "react"

import styles from "../Plans.module.css"

export default function PlanSidebar({ clearPlan }) {

    return (
        <section className={styles.side}>
            <div className={styles.buttonContainer}>
                <button className={styles.saveButton} form="planForm">Zapisz plan</button>
                <button type="button" className={styles.pdfButton}>Wygeneruj pdf</button>
                <button type="button" className={styles.saveButton} onClick={clearPlan}>Wyczysc plan</button>
            </div>
            <div className={styles.nutritionProgress}>
            {/* todo - dodać dynamiczny progres makro */}
            </div>
        </section>
    )
}