import React, {useEffect, useRef, useState} from "react"
import {createNote, deleteNote, getNotes, updateNote} from "../../../../api/app/notes.js";
import Table from "../../../../components/Table.jsx";
import styles from "../Patients.module.css"
import actionStyles from "../../../../components/ActionButton.module.css"

export default function PatientsNotes({ patient, notesLoader }) {
    const [notes, setNotes] = useState([])
    const [note, setNote] = useState("")
    const editRef = useRef()

    useEffect(() => {
        setNotes(notesLoader.map(r => {
            return {
                id: r.id,
                name: r.note,
                createdAt: r.created_at.slice(0,10)
            }
        }))
    }, [notesLoader]);


    const handleCreateNote = async (text, id) => {
        await createNote(id, text).then(res => {
            setNotes(prev => {
                return [
                    {
                        id: res.id,
                        name: res.note,
                        created_at: res.created_at.slice(0,10)
                    },
                    ...prev
                ]
            })
        })
        setNote("")
    }

    const handleDeleteNote = async (id) => {
        await deleteNote(id)
        setNotes(prev => prev.filter(p => p.id !== id))
    }

    const handleEditNote = async (id, text, edit, setEdit) => {
        if (!edit) {
            setNotes(prev => {
                return prev.map(p => {
                    if (p.id === id) {
                        return {
                            ...p,
                            name:
                                <textarea
                                    defaultValue={text}
                                    ref={editRef}
                                    className={styles.textarea}

                                />
                        }
                    } else return p
                })
            })
            setEdit(id)
        } else {
            await updateNote(id, editRef.current.value)
                .then(res =>
                    setNotes(prev => {
                        return prev.map(p => {
                            if (p.id === id && p.id === res.id) {
                                return {...p, name: res.note}
                            } else return p
                        })
                    })
                )
            setEdit(false)
        }
    }


    return (
        <section className={styles.notesSection}>
            {notes.length > 0 &&
                <Table
                    title={"Notatki pacjenta"}
                    headers={["Notatka", "Data"]}
                    data={notes}
                    delFunc={handleDeleteNote}
                    delText="Czy na pewno chcesz usunąć notatkę"
                    width="half"
                    show={true}
                    showFunc={handleEditNote}
                />
            }

            <div className={`${styles.inputGroup} ${styles.noteInputGroup}`}>
                <textarea
                    placeholder="Notatka..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className={`${styles.textarea} ${styles.newNote}`}
                    rows={3}
                />
                <div>
                    <button
                        onClick={() => handleCreateNote(note, patient.id)}
                        className={actionStyles.actionButton}
                    >
                        Dodaj notatkę
                    </button>
                </div>
            </div>

        </section>
    )
}
