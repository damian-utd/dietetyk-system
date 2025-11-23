//PlanMetaForm

import React from "react"

import styles from "../Plans.module.css"

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
                    name="patient_id"
                    value={patientId || ""}
                    required
                    className={styles.patient}
                    onChange={(e) => planDispatch({type: 'setField', value: e.target.value, field: e.target.name})}
                >
                    <option value="" disabled>Wybierz pacjenta</option>
                    <option value={-1}>Szablon ogólny</option>
                    {patientsList}
                </select>

                <input
                    type="text"
                    name="title"
                    value={title}
                    placeholder="Tytuł (np. Redukcja 2400kcal)"
                    required
                    className={styles.title}
                    onChange={(e) => planDispatch({type: 'setField', value: e.target.value, field: e.target.name})}
                />
            </div>

            <textarea
                name="description"
                id="description"
                value={description}
                placeholder="Opis... "
                required
                rows={3}
                className={styles.description}
                onChange={(e) => planDispatch({type: 'setField', value: e.target.value, field: e.target.name})}
            />
        </fieldset>
    )
}