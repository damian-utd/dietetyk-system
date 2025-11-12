//PlanCreator

import React from "react"
import {Form, useActionData, useSubmit} from "react-router-dom";
import { requireAuth } from "../../../api/utils.js";
import {searchProducts} from "../../../api/app/diet.js";

import styles from "./PlanCreator.module.css"

export async function loader( { request }){
    await requireAuth(request)
    return null
}

export async function action({ request }) {
    const formData = await request.formData()
    const search = formData.get("search")

    if (search.length >= 3) {
        try{
            return await searchProducts(search)
        } catch (err) {
            return err.message
        }
    }
}


export default function PlanCreator() {
    const submit = useSubmit()
    const actionData = useActionData()

    const searchResults = actionData ? actionData.products.map((product) => {
        const {lp, nazwa_polska, nazwa_angielska} = product
        return (
            <div key={lp}>
                {nazwa_polska}
            </div>
        )
    }) : ""

    return (
        <div className={styles.planCreatorBody}>
            <h1>PlanCreator</h1>
            <section className={styles.searchSection}>
                <Form
                    method="post"
                    onChange={(event) => submit(event.currentTarget)}
                >
                    <input type="search" name="search" defaultValue="mlek"/>
                </Form>
                <div>
                    {searchResults}
                </div>
            </section>

        </div>
    )
}