export async function createProgress(weight, patient_id) {
    const res = await fetch(`/api/progress/`, {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({weight, patient_id}),
        credentials: "include"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return data.value
}

export async function getProgress(id) {
    const res = await fetch(`/api/progress/${id}`, {
        credentials: "include"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return data.value
}

export async function deleteProgress(id) {
    const res = await fetch(`/api/progress/${id}`, {
        credentials: "include",
        method: "DELETE"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return data
}

