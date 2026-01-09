//PlanMetaForm

import React from "react"

import styles from "../styles/Plans.module.css"

export default function PlanMetaSection({ patients, planDispatch, patientId, title, description }) {

    const patientsList = patients.map((patient) => {
        return (
            <option key={patient.id} value={patient.id}>
                {patient.first_name} {patient.last_name}
            </option>
        )
    })

    return (
        <fieldset className={styles.metaData}>
            <legend>Stwórz plan dietetyczny</legend>
            <div>
                <select
                    value={patientId || ""}
                    required
                    className={styles.patient}
                    onChange={(e) => planDispatch({type: 'setField', value: e.target.value, field: 'patient_id'})}
                >
                    <option value="" disabled>Wybierz pacjenta</option>
                    <option value={-1}>Szablon ogólny</option>
                    {patientsList}
                </select>

                <input
                    type="text"
                    value={title}
                    placeholder="Tytuł (np. Redukcja 2400kcal)"
                    required
                    className={styles.title}
                    onChange={(e) => planDispatch({type: 'setField', value: e.target.value, field: 'title'})}
                />
            </div>

            <textarea
                id="description"
                value={description}
                placeholder="Opis... "
                required
                rows={3}
                className={styles.description}
                onChange={(e) => planDispatch({type: 'setField', value: e.target.value, field: 'description'})}
            />
        </fieldset>
    )
}