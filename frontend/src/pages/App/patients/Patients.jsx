//Patients

import React from "react"
import { requireAuth } from "../../../api/utils.js";
import { addPatient } from "../../../api/app/diet.js";
import {Form} from "react-router-dom";

export async function loader( { request }) {
    await requireAuth(request)
    return null
}

export async function action({ request }) {
    const formData = await request.formData()
    const data = Object.fromEntries(formData);

    try {
        await addPatient(data)
    } catch(err) {
        return err.message
    }
}

export default function Patients() {

    return (
        <>
            <h1>Patients</h1>
            <Form
                method="POST"
            >
                <label htmlFor="first_name">Imię</label>
                <input type="text" name="first_name" id="first_name"/>

                <label htmlFor="last_name">Nazwisko</label>
                <input type="text" name="last_name" id="last_name"/>

                <label htmlFor="age">Wiek</label>
                <input type="number" name="age" id="age" min={1} max={99}/>

                <label htmlFor="sex">Płeć</label>
                <select name="sex" id="sex">
                    {/*<option disabled selected>Wybierz</option>*/}
                    <option value="male">Mężczyzna</option>
                    <option value="female">Kobieta</option>
                    <option value="other">Inne / Nie chcę podawać</option>
                </select>

                <label htmlFor="weight">Waga (kg)</label>
                <input type="text" name="weight" id="weight" min={0}/>

                <label htmlFor="height">Wzrost (cm)</label>
                <input type="text" name="height" id="height" min={0} />

                <label htmlFor="activity_level">Poziom aktywności</label>
                <select name="activity_level" id="activity_level">
                    {/*<option disabled selected>Wybierz</option>*/}
                    <option value="1">Brak aktywności fizycznej</option>
                    <option value="2">Lekka aktywność</option>
                    <option value="3">Średnia aktywność</option>
                    <option value="4">Wysoka aktywność</option>
                    <option value="5">Bardzo wysoka aktywność fizyczna</option>
                </select>

                <label htmlFor="goal">Cel</label>
                <input type="text" name="goal" id="goal"/>

                <label htmlFor="conditions">Schorzenia / Alergie</label>
                <input type="text" name="conditions" id="conditions"/>

            </Form>
        </>
    )
}