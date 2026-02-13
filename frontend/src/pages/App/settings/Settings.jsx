import React from "react"
import {Form, useLoaderData} from "react-router-dom";
import {getLoggedDietician, updateLoggedDietician} from "../../../api/app/diet.js";

export async function loader() {
    return await getLoggedDietician()
}

export async function action({request}) {
    const formData = await request.formData()
    const name = formData.get("full_name")
    const spec = formData.get("specialization")

    try {
        return await updateLoggedDietician(name, spec)
    } catch (err) {
        return err.message
    }
}

export default function Settings() {
    const loaderData = useLoaderData()

    console.log(loaderData)

    return (
        <section>
            <Form method="POST">
                <input
                    type={'text'}
                    name={'full_name'}
                    defaultValue={loaderData.full_name}
                    placeholder={'Imię i nazwisko'}
                />
                <input
                    type={'text'}
                    name={'specialization'}
                    defaultValue={loaderData.specialization}
                    placeholder={'Specjalizacja'}
                />
                <button>
                    Zapisz
                </button>
            </Form>
        </section>
    )
}