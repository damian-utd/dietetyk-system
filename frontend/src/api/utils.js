//utils

import { redirect } from "react-router-dom"
import { isLoggedIn } from "./auth/auth.js";

export async function requireAuth(request) {

    let pathname = ""
    if (request)
        pathname = new URL(request.url).pathname || ""

    try {
        await isLoggedIn()
    }
    catch(err) {
        console.error(err.message)
        throw redirect(`/login?message=${encodeURIComponent('Najpierw musisz się zalogować')}&redirectTo=${pathname}`
        )
    }
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}