//dashboard

import React from "react"
import { useLoaderData } from "react-router-dom";

import { requireAuth } from "../../../api/utils.js";
import { getPatientsCount } from "../../../api/app/diet.js";
import CardsSection from "./components/CardsSection.jsx";
import styles from "./Dashboard.module.css"


export async function loader( { request }){
    await requireAuth(request)

    try{
        return {
            patientsCount: getPatientsCount()
        }

    }
    catch(err) {
        console.log("laoder error: ", err.message)
        return {error: err.message}
    }
}

export default function Dashboard() {
    const rest = useLoaderData()

    return (
        <div className={styles.dashboardBody}>
            <section className={styles.cardsSection}>
                <CardsSection data={rest}/>
            </section>
        </div>
    )
}