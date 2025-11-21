//Plans

import React from "react"
import {Link} from "react-router-dom";
import { requireAuth } from "../../../utils/utils.js";

import styles from "./Plans.module.css"

export async function loader( { request }){
    await requireAuth(request)

}

export async function action({ request }) {

}

export default function Plans() {


    return (
        <div className={styles.plansBody}>
            <Link to="create">
                Utwórz plan
            </Link>

        </div>
    )
}