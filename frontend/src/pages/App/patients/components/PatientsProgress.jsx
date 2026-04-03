import React, {useEffect, useState} from "react"
import {createProgress, deleteProgress, getProgress} from "../../../../api/app/progress.js";
import {roundDec} from "../../../../utils/utils.js";
import Table from "../../../../components/Table.jsx";
import styles from "../Patients.module.css"

export default function PatientsProgress({ patient, setPatient, setPatientsWeight }) {

    const [progress, setProgress] = useState([])
    const [newWeight, setNewWeight] = useState(patient.weight)

    useEffect(  () => {
        const func = async () => await getProgress(patient.id)
        func().then(res =>
            setProgress(res.map(r => {
                return {
                    id: r.id,
                    name: r.new_weight.concat(" kg"),
                    createdAt: r.created_at.slice(0, 10)
                }
            }))
        )
    }, [patient]);

    const handleCreateProgress = async (weight, id) => {
        await createProgress(weight, id).then(res => {
            setProgress(prev => {
                return [
                    {
                        id: res.id,
                        new_weight: res.new_weight.concat(" kg"),
                        created_at: res.created_at.slice(0, 10)
                    },
                    ...prev
                ]
            })
            setPatientsWeight(roundDec(res.new_weight, 2))
            setPatient(prev => {
                return {
                    ...prev,
                    weight: roundDec(res.new_weight, 2)
                }
            })
        })
    }
    const handleDeleteProgress = async (id) => {
        await deleteProgress(id)
        setProgress(prev => prev.filter(p => p.id !== id))
    }

    return (
        <section className={styles.progressSection}>
            {progress.length > 0 &&
                <Table
                    title={"Progres pacjenta"}
                    headers={["Waga", "Data"]}
                    data={progress}
                    delFunc={handleDeleteProgress}
                    delText="Czy na pewno chcesz usunąć progres"
                    width="half"
                />
            }
            <div className={styles.inputGroup} style={{flexDirection: "row", alignItems: "center", gap: "2rem"}}>
                <button
                    onClick={() => handleCreateProgress(newWeight, patient.id)}
                    className={styles.addPatientButton}
                >
                    Dodaj progres
                </button>
                <input
                    value={newWeight}
                    onChange={(e) =>
                        setNewWeight(e.target.value)
                    }
                />
            </div>
        </section>
    )
}