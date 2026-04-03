export async function createNote(patient_id, note) {
    const res = await fetch(`/api/notes/`, {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({patient_id, note}),
        credentials: "include"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return data.value
}

export async function getNotes(patient_id) {
    const res = await fetch(`/api/notes/${patient_id}`, {
        credentials: "include"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return data.value
}

export async function deleteNote(note_id) {
    const res = await fetch(`/api/notes/${note_id}`, {
        credentials: "include",
        method: "DELETE"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return data.value
}

export async function updateNote(note_id, text) {
    const res = await fetch(`/api/notes/${note_id}`, {
        credentials: "include",
        method: "PUT",
        body: JSON.stringify({text}),
        headers: {"Content-Type" : "application/json"},
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return data.value
}

export async function getNotesCount() {
    const res = await fetch(`/api/notes/count`, {
        credentials: "include"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return {
        value: data.value,
        title: "Liczba notatek"
    }
}