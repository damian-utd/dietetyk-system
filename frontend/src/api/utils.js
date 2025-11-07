//utils

import {redirect} from "react-router-dom"
import {isLoggedIn} from "./auth/auth.js";

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

export function roundDec(number, precision) {
    const x = Math.pow(10, precision)

    return Math.round(number*x)/x
}

export function calcBMI(weight, height) {
    const fixedHeight = height/100
    const ratio = weight/(fixedHeight*fixedHeight)
    let description
    if (ratio < 18.5){
        description = "Niedowaga"
    }else if(ratio < 25){
        description = "Norma"
    }else if(ratio < 30) {
        description = "Nadwaga"
    }else{
        description = "Otyłość"
    }

    return {
        title: "BMI",
        value: ratio,
        description: description
    }
}

export function calcBMR(weight, height, age, sex) {
    if (sex === "male") {
        return {
            title: "PPM",
            value: 10 * weight + 6.25 * height - 5 * age + 5,
            description: "Podstawowa przemiana materii"
        }
    }else {
        return {
            title: "PPM",
            value: 10 * weight + 6.25 * height - 5 * age - 161,
            description: "Podstawowa przemiana materii"
        }
    }
}

export function calcTDEE(BMR, activity) {
    return {
        title: "CPM",
        value: BMR.value * activity,
        description: "Całkowita przemiana materii"
    }
}

