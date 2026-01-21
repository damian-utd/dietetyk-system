// diet.js

export async function searchProducts(search) {
    const res = await fetch("/api/diet/search", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({search}),
        credentials: "include"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error (data.message)
    }

    return data
}

export async function savePlan(planState) {
    const res = await fetch("/api/diet/save", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({planState}),
        credentials: "include"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error (data.message)
    }

    return data
}

export async function getPlans() {
    const res = await fetch("/api/diet/get", {
        credentials: "include"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error (data.message)
    }

    return data
}

export async function getPlansCount() {
    const res = await fetch("/api/diet/count", {
        credentials: "include"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return {
        value: data.count,
        title: "Liczba planów"
    }
}

export async function getPlanById(id) {
    const res = await fetch(`api/diet/get/${id}`, {
        credentials: "include"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return data
}