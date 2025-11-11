// diet.js

export async function searchProducts(search) {
    const res = await fetch ("/api/diet/search", {
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