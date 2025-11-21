//Sidebar

import React from "react"

import styles from "../Plans.module.css"

export default function PlanSidebar() {
    return (
        <section className={styles.side}>
            <div className={styles.buttonContainer}>
                <button className={styles.saveButton}>Zapisz plan</button>
                <button className={styles.pdfButton}>Wygeneruj pdf</button>
            </div>
            <div className={styles.nutritionProgress}>
                {/* todo - dodać dynamiczny progres makro */}
            </div>
        </section>
    )
}