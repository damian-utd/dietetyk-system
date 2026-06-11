import React, {useEffect, useState} from "react"
import {createProgress, deleteProgress, getProgress} from "../../../../api/app/progress.js";
import {roundDec} from "../../../../utils/utils.js";
import Table from "../../../../components/Table.jsx";
import styles from "../Patients.module.css"
import actionStyles from "../../../../components/ActionButton.module.css"

export default function PatientsProgress({ patient, setPatient, setPatientsWeight, progressLoader }) {

    const [progress, setProgress] = useState([])
    const [newWeight, setNewWeight] = useState(patient.weight)

    useEffect(  () => {
        setProgress(progressLoader.map(r => {
            return {
                id: r.id,
                name: r.new_weight.concat(" kg"),
                createdAt: r.created_at.slice(0, 10)
            }
        }))
    }, [progressLoader]);

    const handleCreateProgress = async (weight, id) => {
        await createProgress(weight, id).then(res => {
            setProgress(prev => {
                return [
                    {
                        id: res.id,
                        name: res.new_weight.concat(" kg"),
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
        if (id === progress[0].id) {
            setPatientsWeight(roundDec(progress[1].name.slice(0, -3), 2))
            setPatient(prev => {
                return {
                    ...prev,
                    weight: roundDec(parseFloat(progress[1].name.slice(0, -3)), 2)
                }
            })
        }
        setProgress(prev => prev.filter(p => p.id !== id))
    }

    return (
        <section className={styles.progressSection}>
            {progress.length > 0 &&
                <Table
                    title={"Postępy pacjenta"}
                    headers={["Waga", "Data"]}
                    data={progress}
                    delFunc={progress.length > 1 ? handleDeleteProgress : null}
                    delText="Czy na pewno chcesz usunąć wpis postępu"
                    width="half"
                />
            }
            <div className={`${styles.inputGroup} ${styles.progressInputGroup}`}>
                <button
                    onClick={() => handleCreateProgress(newWeight, patient.id)}
                    className={actionStyles.actionButton}
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
