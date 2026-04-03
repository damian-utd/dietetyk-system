//Patients

import
    React, { useState, useEffect } from "react"
import {
    Link,
    useLoaderData,
} from "react-router-dom";

import { requireAuth } from "../../../utils/utils.js";
import {deletePatient, getPatients} from "../../../api/app/patients.js";

import styles from "./Patients.module.css"
import Table from "../../../components/Table.jsx";

export async function loader( { request }) {
    await requireAuth(request)

    try {
        return await getPatients()
    } catch (err) {
        return {error: err.message}
    }

}

export default function Patients() {
    const loaderData = useLoaderData()

    const [patients, setPatients] = useState([])

    const conditions = ["Brak", "Gluten", "Skorupiaki", "Jaja", "Ryby", "Orzeszki ziemne (arachidowe)", "Soja", "Mleko", "Orzechy", "Seler", "Gorczyca", "Nasiona sezamu", "Dwutlenek siarki", "Łubin", "Mięczaki"]

    useEffect(() => {
        if(loaderData?.patients) {
            setPatients(loaderData.patients.map(p => {
                return {
                    id: p.id,
                    name: p.first_name.concat(" ", p.last_name),
                    age: p.age,
                    conditions: conditions[p.conditions]
                }
            }))
        }
    }, [loaderData?.patients]);

    async function handleDeletePatient(id) {
        try {
            await deletePatient(id)
            setPatients(prev => prev.filter(p => p.id !== id))
        } catch (err) {
            return {error: err.message}
        }
    }


    return (
        <div className={styles.patientsBody}>
            <section className={styles.patientsSection}>
                <Table
                    title={"Pacjenci"}
                    headers={["Imię i Nazwisko", "Wiek", "Schorzenia / Alergie"]}
                    data={patients}
                    showLink={"patients"}
                    delFunc={handleDeletePatient}
                    delText={"Czy na pewno chcesz usunąć pacjenta"}
                />
                <div className={styles.buttonContainer} style={{width: "92rem"}}>
                    <Link to="add" className={styles.addPatientButton}>
                        <i className="ri-add-large-line"></i><span>Dodaj pacjenta</span>
                    </Link>
                </div>
            </section>
        </div>
    )
}