//Plans

import React from "react"
import {Link, NavLink, useLoaderData} from "react-router-dom";
import { requireAuth } from "../../../utils/utils.js";

import styles from "./styles/Plans.module.css"
import {getPlans} from "../../../api/app/diet.js";

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

    const plansList = loaderData?.plans.map(plan => {
        return (
            <div key={plan.id}>
                <span>{plan.title } </span>
                <span>{plan.description} </span>
                <span>{plan.created_at} </span>
                <NavLink to={`/plans/${plan.id}`}>Pokaż</NavLink>
            </div>
        )
    }) || null

    return (
        <div className={styles.plansBody}>
            <div>
                {plansList}
            </div>
            <Link to="create">
                Utwórz plan
            </Link>

        </div>
    )
}