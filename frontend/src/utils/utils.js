//utils

import {redirect} from "react-router-dom"
import {isLoggedIn} from "../api/auth/auth.js";

export async function requireAuth(request) {

    let pathname = ""
    if (request)
        pathname = new URL(request.url).pathname || ""

    try {
        await isLoggedIn()
    }
    catch(err) {
        console.error(err.message)
        if(err.message === "Brak tokenu autoryzacji") {
            throw redirect(`/login?message=${encodeURIComponent('Najpierw musisz się zalogować')}&redirectTo=${pathname}`)
        } else {
            throw redirect(`/login?message=${encodeURIComponent('Brak uprawnień dietetyka')}&redirectTo=${pathname}`)
        }
    }
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function roundDec(number, precision) {
    const x = Math.pow(10, precision)
    if (typeof number === "string") number = Number(number.replace(",", "."))

    return Math.round(number*x)/x
}



