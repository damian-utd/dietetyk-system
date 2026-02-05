import React, {useEffect, useState} from "react"
import {createProgress, deleteProgress, getProgress} from "../../../../api/app/progress.js";
import {roundDec} from "../../../../utils/utils.js";

export default function PatientsProgress({ patient, setPatientsWeight }) {

    const [progress, setProgress] = useState([])
    const [newWeight, setNewWeight] = useState(patient.weight)

    useEffect(  () => {
        const func = async () => await getProgress(patient.id)
        func().then(res => setProgress(res))
    }, [patient]);

    const handleCreateProgress = async (weight, id) => {
        await createProgress(weight, id).then(res => {
            setProgress(prev => {
                return [
                    ...prev,
                    {
                        id: res.id,
                        new_weight: res.new_weight,
                        created_at: res.created_at
                    }
                ]
            })
            setPatientsWeight(roundDec(res.new_weight, 2))
        })
    }
    const handleDeleteProgress = async (id) => {
        await deleteProgress(id)
        setProgress(prev => prev.filter(p => p.id !== id))
    }

    const progressList = progress === null ?
        <div></div> :
        progress.map(p => {
            return (
                <div key={p.id}>
                    <span>{roundDec(p.new_weight, 2)} kg </span>
                    <span>{p.created_at.slice(0, 10)} </span>
                    <button onClick={() => handleDeleteProgress(p.id)}>Usuń</button>
                </div>
            )
        })

    return (
        <div>
            <input
                value={newWeight}
                onChange={(e) =>
                        setNewWeight(e.target.value)
                }
            />
            <button onClick={() => handleCreateProgress(newWeight, patient.id)}>Dodaj progres</button>
            {progressList}
        </div>
    )
}