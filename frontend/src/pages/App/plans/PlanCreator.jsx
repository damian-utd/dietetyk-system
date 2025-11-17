//PlanCreator

import React from "react"
import {Form, Link, useActionData, useLoaderData, useSubmit} from "react-router-dom";
import { requireAuth } from "../../../api/utils.js";
import {searchProducts} from "../../../api/app/diet.js";

import styles from "./Plans.module.css"
import {getPatients} from "../../../api/app/patients.js";

export async function loader( { request }){
    await requireAuth(request)

    try {
        return await getPatients()
    } catch (error) {
        throw new Error(error.message);
    }

}

export async function action({ request }) {
    const formData = await request.formData()
    const form_id = formData.get("form_id")

    switch (form_id) {
        case "1":
        {
            const search = formData.get("search")

            if (search.length >= 3) {
                try{
                    return await searchProducts(search)
                } catch (err) {
                    return err.message
                }
            }

            break;
        }
    }
}

export default function PlanCreator() {
    const submit = useSubmit()
    const actionData = useActionData()
    const loaderData = useLoaderData()

    const patients = loaderData?.patients || []

    const searchResults = actionData ? actionData.products.map((product) => {
        const {lp, nazwa_polska, nazwa_angielska} = product
        return (
            <div key={lp}>
                {nazwa_polska}
            </div>
        )
    }) : ""

    const patientsList = patients.map((patient) => {
        return (
            <option key={patient.id} value={patient.id}>
                {patient.first_name} {patient.last_name}
            </option>
        )
    })

    return (
        <div className={styles.planCreatorBody}>
            <h1>Wybierz pacjenta</h1>
            <select>
                <option value={false}>Nie wybieram</option>
                {patientsList}
            </select>

            <section className={styles.searchSection}>
                <Form
                    method="post"
                    onChange={(event) => submit(event.currentTarget)}
                >
                    <input name="form_id" hidden defaultValue="1"/>
                    <input type="search" name="search" defaultValue=""/>
                </Form>
                <div>
                    {searchResults}
                </div>
            </section>

        </div>
    )
}