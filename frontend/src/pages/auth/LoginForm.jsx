//LoginForm

import React from "react"
import {Form, Link, redirect, useLoaderData} from "react-router-dom";

import {loginUser} from "../../api/auth/auth.js"

import styles from "./Auth.module.css"

export async function action({ request }) {
    const formData = await request.formData()
    const email = formData.get("email")
    const password = formData.get("password")

    const path = new URL(request.url).searchParams.get("redirectTo") || "/dashboard"

    try {
        await loginUser({ email, password } )
        return redirect(path)
    } catch(err) {
        return err.message
    }
}

export async function loader({ request }) {
    return new URL(request.url).searchParams.get("message")
}

export default function LoginForm() {
    const authMessage = useLoaderData()

    return(
        <section>
            <label htmlFor="auth">
                <h1>Witamy Ponownie</h1>
                <p>Zaloguj się, aby zarządzać swoimi planami dietetycznymi i pacjentami.</p>
            </label>
            <Form method="post" className={styles.authForm} name="auth" id="auth">
                <label htmlFor="email" className="sr-only">Login</label>
                <input id="email" type="text" name="email" placeholder="Adres email"/>

                <label htmlFor="password" className="sr-only">Hasło</label>
                <input id="password" type="password" name="password" placeholder="Hasło"/>
                <button>Zaloguj</button>
            </Form>
            <Link to="/register">Nie masz konta? Zarejestruj się</Link>
            {authMessage && <h1 className={styles.authMessage}>{authMessage}</h1>}
        </section>
    )
}






