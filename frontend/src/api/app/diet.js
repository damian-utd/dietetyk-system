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
    const res = await fetch("/api/diet/", {
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
    const res = await fetch("/api/diet/", {
        credentials: "include"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error (data.message)
    }

    return data
}

export async function editPlan(planState, id) {
    const res = await fetch(`/api/diet/${id}`, {
        method: "PUT",
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
    const res = await fetch(`/api/diet/${id}`, {
        credentials: "include"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return data
}

export async function deletePlan(id) {
    const res = await fetch(`/api/diet/${id}`, {
        method: "DELETE",
        credentials: "include"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return data
}

export async function getLoggedDietician() {
    const res = await fetch("/api/diet/dietician", {
        credentials: "include"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return data.value
}

export async function updateLoggedDietician(full_name, specialization) {
    const res = await fetch("/api/diet/dietician", {
        credentials: "include",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({full_name, specialization})
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return data.value
}

export async function getPatientsPlans(id) {
    const res = await fetch(`/api/diet/patient/${id}`, {
        credentials: "include"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return data
}

export async function getBannedProducts(condition) {
    const res = await fetch(`/api/diet/search/${condition}`, {
        credentials: "include"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error (data.message)
    }

    return data
}