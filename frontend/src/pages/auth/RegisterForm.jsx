import React from "react"
import {Form, Link, redirect, useActionData} from "react-router-dom";

import { registerUser } from "../../api/auth/auth.js";

import styles from "./Auth.module.css"

// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request }) {
    const formData = await request.formData()

    const email = formData.get("email")
    const password = formData.get("password")
    const repeatPassword = formData.get("repeatPassword")

    if (password !== repeatPassword) {
        return "Hasła muszą być takie same!"
    }

    try{
        const data = await registerUser({ email, password })
        console.log("Pomyślnie zarejestrowano. Dane: ", data)
        return redirect("/login")
    } catch(err) {
        return err.message
    }
}

export default function RegisterForm() {

    const errorMessage = useActionData()

    return(
        <section>
            <label htmlFor="auth">
                <h1>Załóż konto</h1>
                <p>Zarejestruj się, aby zacząć zarządzać swoimi planami dietetycznymi i pacjentami.</p>
            </label>
            <Form method="post" className={styles.authForm} name="auth">
                <label htmlFor="email" className="sr-only">Login</label>
                <input id="email" type="text" name="email" placeholder="Adres email"/>

                <label htmlFor="password" className="sr-only">Hasło</label>
                <input id="password" type="password" name="password" placeholder="Hasło"/>
                <label htmlFor="repeat-password" className="sr-only">Powtórz Hasło</label>
                <input id="repeat-password" type="password" name="repeatPassword" placeholder="Powtórz Hasło"/>
                <button>Zarejestruj się</button>
            </Form>
            <Link to="/login">Masz już konto? Zaloguj się!</Link>
            {errorMessage && <h1>{errorMessage}</h1>}
        </section>
    )
}