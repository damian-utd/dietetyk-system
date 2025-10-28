//auth

export async function loginUser(creds) {
    const res = await fetch("api/auth/login", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(creds),
        credentials: "include"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return data

}

export async function registerUser(creds) {
    const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(creds),
        credentials: "include"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return data
}

export async function isLoggedIn() {
    const res = await fetch("/api/auth/profile", {
            credentials: "include"
        })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return data
}

export async function logout() {
    const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return data
}
