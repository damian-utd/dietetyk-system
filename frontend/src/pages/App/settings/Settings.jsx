import React from "react"
import {Form, useLoaderData} from "react-router-dom";
import {getLoggedDietician, updateLoggedDietician} from "../../../api/app/diet.js";
import {requireAuth} from "../../../utils/utils.js";
import styles from "./Settings.module.css"
import patientStyles from "../patients/Patients.module.css"

export async function loader({request}) {
    await requireAuth(request)
    return await getLoggedDietician()
}

export async function action({request}) {
    const formData = await request.formData()
    const name = formData.get("full_name")
    const spec = formData.get("specialization")

    try {
        return await updateLoggedDietician(name, spec)
    } catch (err) {
        return err.message
    }
}

export default function Settings() {
    const loaderData = useLoaderData()

    return (
        <section className={styles.settingsBody}>
            <Form method="POST">
                <div className={styles.inputGroup}>
                    <label htmlFor="{'full_name'}">
                        Imię i nazwisko
                    </label>
                    <input
                        type={'text'}
                        name={'full_name'}
                        defaultValue={loaderData.full_name}
                        placeholder={'Imię i nazwisko'}
                        className={styles.settingsInput}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="{'specialization'}">
                        Specjalizacja
                    </label>
                    <input
                        type={'text'}
                        name={'specialization'}
                        defaultValue={loaderData.specialization}
                        placeholder={'Specjalizacja'}
                        className={styles.settingsInput}
                    />
                </div>
                <div>
                    <button className={patientStyles.addPatientButton}>
                        Zapisz
                    </button>
                </div>
            </Form>
        </section>
    )
}