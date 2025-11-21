import React from "react"
import styles from "./Plans.module.css";
import {Form, useActionData, useSubmit} from "react-router-dom";
import {searchProducts} from "../../../api/app/diet.js";

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

export default function SearchProducts() {
    const actionData = useActionData()
    const submit = useSubmit()

    const searchResults = actionData ? actionData?.products.map((product) => {
        const {lp, nazwa_polska, nazwa_angielska} = product
        return (
            <div key={lp}>
                {nazwa_polska}
            </div>
        )
    }) : ""

    return (
        <section className={styles.searchSection}>
            <Form
                method="post"
                onChange={(event) => submit(event.currentTarget)}
            >
                <input type="search" name="search" defaultValue=""/>
            </Form>
            <div>
                {searchResults}
            </div>
        </section>
    )
}