// diet.js

import download from "downloadjs"

function serializeProduct(product) {
    return {
        fdcId: Number(product.fdcId),
        name: product.name,
        quantity: Number(product.quantity),
        unit: product.unit,
        energy: Number(product.energy),
        protein: Number(product.protein),
        carbs: Number(product.carbs),
        fats: Number(product.fats)
    }
}

function serializePlan(planState) {
    return {
        patient_id: planState.patient_id ? Number(planState.patient_id) : null,
        title: planState.title,
        description: planState.description,
        days: planState.days.map(day => ({
            day_number: Number(day.day_number),
            meals: day.meals.map(meal => ({
                name: meal.name,
                notes: meal.notes,
                order_number: Number(meal.order_number),
                meal_products: meal.meal_products.map(serializeProduct)
            }))
        }))
    }
}

async function savePlanRequest(planState, url, method) {
    const res = await fetch(url, {
        method,
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({planState: serializePlan(planState)}),
        credentials: "include"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error (data.message)
    }

    return data
}

export async function savePlan(planState) {
    return savePlanRequest(planState, "/api/diet/", "POST")
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
    return savePlanRequest(planState, `/api/diet/${id}`, "PUT")
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

export async function getPlanInPDF(id) {
    const res = await fetch(`/api/diet/${id}/pdf`, {
        credentials: "include"
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message)
    }

    const blob = await res.blob()

    const contentDisposition = res.headers.get("Content-Disposition")
    const filename = getFilenameFromHeader(contentDisposition) || `plan-${id}.pdf`

    download(blob, filename, "application/pdf")
}

function getFilenameFromHeader(header) {
    if (!header) return null

    const match = header.match(/filename="?(.+?)"?$/)
    return match ? match[1] : null
}
