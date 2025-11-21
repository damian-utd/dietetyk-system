//dashboard

import React from "react"
import {useLoaderData} from "react-router-dom";

import { requireAuth } from "../../../utils/utils.js";
import { getPatientsCount } from "../../../api/app/patients.js";
import Cards from "../../../components/Cards.jsx";
import styles from "./Dashboard.module.css"


export async function loader( { request }){
    await requireAuth(request)

    try{
        return {
            patientsCount: await getPatientsCount(),
            notesCount: { value: 2, title: "Liczba notatek" }, // sztuczny async
            plansCount: { value: 1, title: "Liczba planów" }
        }

    }
    catch(err) {
        console.log("laoder error: ", err.message)
        return {error: err.message}
    }
}

export default function Dashboard() {
    const loaderData = useLoaderData()

    return (
        <div className={styles.dashboardBody}>
            <Cards
                data={loaderData}
            />
        </div>
)
}