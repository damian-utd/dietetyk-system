//Plans

import React, {useEffect, useState} from "react"
import {Link, NavLink, useLoaderData} from "react-router-dom";
import { requireAuth } from "../../../utils/utils.js";

import {getPlans} from "../../../api/app/diet.js";
import Table from "../../../components/Table.jsx";
import styles from "./Plans.module.css"
import actionStyles from "../../../components/ActionButton.module.css"

export async function loader( { request }){
    await requireAuth(request)

    try {
        return await getPlans()
    } catch (err) {
        return {error: err.message}
    }
}

export default function Plans() {
    const loaderData = useLoaderData()

    const [plans, setPlans] = useState([])

    useEffect(() => {
        if(loaderData?.plans) {
            setPlans(loaderData.plans.map(p => {
                return {
                    id: p.id,
                    name: p.title,
                    description: p.description,
                    createdAt: p.created_at.slice(0, 10)
                }
            }))
        }
    }, [loaderData?.plans]);

    return (
        <div className={styles.plansBody}>
            <section className={styles.plansSection}>
                <Table
                    title={"Plany żywieniowe"}
                    headers={["Tytuł", "Opis", "Data utworzenia"]}
                    data={plans}
                    showLink={"plans"}
                />
                <div className={`${actionStyles.buttonContainer} ${actionStyles.wideButtonContainer} ${actionStyles.listActions}`}>
                    <Link to="create" className={actionStyles.actionButton}>
                        Utwórz plan
                    </Link>
                </div>
            </section>
        </div>
)
}
