//Plans

import React from "react"
import {Form, Link, useActionData, useLoaderData, useSubmit} from "react-router-dom";
import { requireAuth } from "../../../api/utils.js";
import {searchProducts} from "../../../api/app/diet.js";

import styles from "./Plans.module.css"
import {getPatients} from "../../../api/app/patients.js";

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