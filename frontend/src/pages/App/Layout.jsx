import React from "react"
import {NavLink, Outlet, useNavigate} from "react-router-dom";

import { logout } from "../../api/auth/auth.js";

import styles from "./Main.module.css"
import {requireAuth} from "../../api/utils.js";

export async function loader() {
    await requireAuth()

    /*
        todo
            w loaderze pobrać dane dietetyka
            w headerze wyswietlić te dane
            ikonke wsadzić w navlink do informacji o dietetyku
     */
}

export default function Layout() {

    const navigate = useNavigate()

    async function handleLogout() {
        try {
            await logout()
            navigate("/login")
        } catch(err) {
            throw err.message
        }
    }

    const activeStyles = {
        color: "#7EDC00",
        backgroundColor: "rgba(126, 220, 0, 0.2)"
    }

    return (
        <div className={styles.mainBody}>
            <nav className={styles.navBar}>

                <NavLink
                    to="dashboard"
                    style={({isActive}) => isActive ? activeStyles : null}
                >
                    <i className="ri-home-3-line"></i>
                    Strona główna
                </NavLink>
                <NavLink
                    to="patients"
                    style={({isActive}) => isActive ? activeStyles : null}
                >
                    <i className="ri-group-line"></i>
                    Pacjenci
                </NavLink>
                <NavLink
                    to="plans"
                    style={({isActive}) => isActive ? activeStyles : null}
                >
                    <i className="ri-profile-line"></i>
                    Plany dietetyczne
                </NavLink>
                <NavLink
                    to="plancreator"
                    style={({isActive}) => isActive ? activeStyles : null}
                >
                    <i className="ri-restaurant-line"></i>
                    Stwórz plan
                </NavLink>
                <NavLink
                    to="calcs"
                    style={({isActive}) => isActive ? activeStyles : null}
                >
                    <i className="ri-file-chart-line"></i>
                    Analiza
                </NavLink>
                <button
                    onClick={handleLogout}
                >
                    <i className="ri-logout-circle-line"></i>
                    Wyloguj
                </button>
            </nav>
            <section className={styles.container}>
                <header>
                    <h1>Damian Ratańczuk - dietetyk kliniczny</h1>
                    <i className="ri-user-line icon"></i>
                </header>
                <Outlet/>
            </section>
        </div>
    )
}