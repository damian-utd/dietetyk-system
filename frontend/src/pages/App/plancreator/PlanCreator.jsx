//PlanCreator

import React from "react"
import { requireAuth } from "../../../api/utils.js";
import {Form, useActionData, useSubmit} from "react-router-dom";
import {searchProducts} from "../../../api/app/diet.js";

export async function loader( { request }){
    await requireAuth(request)
    return null
}

export async function action({ request }) {
    const formData = await request.formData()
    const search = formData.get("search")

    if (search.length >= 3) {
        try{
            await searchProducts(search)
        } catch (err) {
            return err.message
        }
    }

    return {
        display: search.length >= 3,
        search
    };
        // zamiast query dac wynik z fetcha (w endpoincie dodaj limit 5, a moze bez limitu?)
        // SELECT * FROM products WHERE nazwa_polska ILIKE '%mleko%' AND nazwa_polska ILIKE '%3,5%';
}


export default function PlanCreator() {
    const submit = useSubmit()
    const { display, search } = useActionData() || {}

    return (
        <>
            <h1>PlanCreator</h1>
            <Form method="post" onChange={(event) => submit(event.currentTarget)}>
                <input type="text" name="search"/>
                <button>elo</button>
            </Form>
            {display ? search : ""}

        </>
    )
}