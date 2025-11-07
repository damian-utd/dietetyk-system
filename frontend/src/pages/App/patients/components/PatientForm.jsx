import React from "react"
import {Form} from "react-router-dom";

import styles from "../Patients.module.css"

export default function PatientForm({ defValues = null, show = "all"}) {



    return (
        <section className={styles.formSection}>
            <Form
                method="POST"
                className={styles.patientForm}
            >
                {/* personal data */}
                {(show === "all" || show === "personal") &&
                    (
                        <>
                            <div className={styles.formGroup}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="first_name">Imię</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        id="first_name"
                                        defaultValue={defValues?.first_name || ""}
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor="last_name">Nazwisko</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        id="last_name"
                                        defaultValue={defValues?.last_name || ""}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="sex">Płeć</label>
                                    <select
                                        name="sex"
                                        id="sex"
                                        defaultValue={defValues?.sex || ""}
                                    >
                                        <option value="" disabled>Wybierz</option>
                                        <option value="male">Mężczyzna</option>
                                        <option value="female">Kobieta</option>
                                        <option value="other">Inne / Nie chcę podawać</option>
                                    </select>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor="age">Wiek</label>
                                    <input
                                        type="number"
                                        name="age"
                                        id="age" min={1} max={99}
                                        defaultValue={defValues?.age || ""}
                                    />
                                </div>
                            </div>
                        </>
                    )
                }

                {/* health data */}
                {(show === "all" || show === "health") &&
                    (
                        <>
                            <div className={styles.formGroup}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="weight">Waga (kg)</label>
                                    <input
                                        type="number"
                                        name="weight"
                                        id="weight" min={0}
                                        defaultValue={defValues?.weight || ""}
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor="height">Wzrost (cm)</label>
                                    <input
                                        type="number"
                                        name="height"
                                        id="height" min={0}
                                        defaultValue={defValues?.height || ""}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="activity_level">Poziom aktywności</label>
                                    <select
                                        name="activity_level"
                                        id="activity_level"
                                        defaultValue={defValues?.activity_level || ""}
                                    >
                                        <option value="" disabled>Wybierz</option>
                                        <option value="1.2">Brak aktywności fizycznej</option>
                                        <option value="1.375">Lekka aktywność</option>
                                        <option value="1.55">Średnia aktywność</option>
                                        <option value="1.725">Wysoka aktywność</option>
                                        <option value="1.9">Bardzo wysoka aktywność fizyczna</option>
                                    </select>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor="goal">Cel</label>
                                    <input
                                        type="text"
                                        name="goal"
                                        id="goal"
                                        defaultValue={defValues?.goal || ""}
                                    />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="conditions">Schorzenia / Alergie</label>
                                <input
                                    type="text"
                                    name="conditions"
                                    id="conditions"
                                    defaultValue={defValues?.conditions || ""}
                                />
                            </div>
                        </>
                    )
                }
                <button className={styles.addPatientButton}>Zapisz</button>
            </Form>
        </section>
)
}