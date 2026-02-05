import React, {useEffect, useState} from "react"
import {createNote, deleteNote, getNotes, updateNote} from "../../../../api/app/notes.js";

export default function PatientsNotes({ patient }) {
    const [notes, setNotes] = useState([])
    const [note, setNote] = useState("")
    const [showAddNote, setShowAddNote] = useState(false)
    const [showEditNote, setShowEditNote] = useState({id: 0, text: ""})

    useEffect(() => {
        const func = async () => await getNotes(patient.id)
        func().then(res => setNotes(res))
    }, [patient]);


    const handleCreateNote = async (text, id) => {
        await createNote(id, text).then(res => {
            setNotes(prev => {
                return [
                    ...prev,
                    {
                        id: res.id,
                        note: res.note,
                        created_at: res.created_at
                    }
                ]
            })
        })
        setNote("")
    }

    const handleDeleteNote = async (id) => {
        await deleteNote(id)
        setNotes(prev => prev.filter(p => p.id !== id))
    }

    const handleUpdateNote = async (id, text) => {
        await updateNote(id, text).then(() => {
            setNotes(prev => {
                return prev.map(p => {
                    if (p.id === showEditNote.id) return {...p, note: showEditNote.text}
                    else return p
                })
            })
            setShowEditNote({id: 0, text: ""})
        })
    }

    const handleEditNote = (id, text) => {
        if (showEditNote.id ) {
            setShowEditNote({id: 0, text: ""})
        } else {

            setShowEditNote({id: id, text: text})
        }
    }

    console.log(showEditNote)

    const notesList = notes ? notes.map(n => {
        return (
            <div key={n.id}>
                {showEditNote.id === n.id ?
                    <textarea
                        value={showEditNote.text}
                        onChange={(e) =>
                            setShowEditNote(prev =>
                                ({...prev, text: e.target.value})
                            )
                        }
                    /> :
                    <span>{n.note} </span>
                }
                <span>{n.created_at.slice(0, 10)} </span>
                {(showEditNote.id === n.id || !showEditNote.id) && <button onClick={() => handleEditNote(n.id, n.note)}>{showEditNote.id === n.id ? "Cofnij" : "Edytuj"}</button>}
                {showEditNote.id === n.id && <button onClick={() => handleUpdateNote(showEditNote.id, showEditNote.text)}>Zapisz zmiany</button>}
                <button onClick={() => handleDeleteNote(n.id)}>Usuń</button>
            </div>
        )
    }) : null

    return (
        <div>
            <button onClick={() => setShowAddNote(prev => !prev)}>{!showAddNote ? "Dodaj notatkę" : "Nie dodawaj nowej notatki"}</button>
            {showAddNote &&
                <div>
                    <textarea
                        placeholder="Notatka..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                    <button onClick={() => handleCreateNote(note, patient.id)}>Zapisz notatkę</button>
                </div>
            }
            {notesList}
        </div>
    )
}