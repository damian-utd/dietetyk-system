//dashboard

import React from "react"
import {Await, useLoaderData} from "react-router-dom";

import { requireAuth } from "../../../api/utils.js";
import { getPatientsCount } from "../../../api/app/diet.js";
import Cards from "../../../components/Cards.jsx";
import styles from "./Dashboard.module.css"
import LoadingCircle from "../../../components/LoadingCircle.jsx";


export async function loader( { request }){
    await requireAuth(request)

    try{
        return {
            patientsCount: getPatientsCount()
            // liczba utworzonych notatek
            // liczba utworzonych planów
        }

    }
    catch(err) {
        console.log("laoder error: ", err.message)
        return {error: err.message}
    }
}

export default function Dashboard() {
    const promise = useLoaderData()

    return (
        <div className={styles.dashboardBody}>
            <React.Suspense
                fallback={
                <section className="cardsSection">
                    <LoadingCircle/>
                </section>
            }>
                <Await resolve={promise}>
                    {(resolved) => (
                        <Cards data={resolved}/>
                    )}
                </Await>
            </React.Suspense>
        </div>
)
}