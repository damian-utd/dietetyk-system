import React, {useState} from "react"
import {NavLink, Outlet, useLoaderData, useNavigate} from "react-router-dom";

import { logout } from "../../api/auth/auth.js";

import styles from "./Main.module.css"
import {requireAuth} from "../../utils/utils.js";
import {getLoggedDietician} from "../../api/app/diet.js";

export async function loader({ request }) {
    await requireAuth(request)
    return await getLoggedDietician()
}



export default function Layout() {
    const dietician = useLoaderData()
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
        color: "#39513d",
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
                <a href="https://remixicon.com" className={styles.remix}>
                    Icons by Remix Icon
                </a>
            </nav>
            <section className={styles.container}>
                <header>
                        <h1>
                            {dietician?.full_name &&
                                <span>
                                    {dietician.full_name}
                                </span>
                            }
                            {(dietician.full_name && dietician.specialization) && <i className="ri-separator" style={{marginInline: '4px'}}></i>}
                            {dietician?.specialization &&
                                <span>
                                    {dietician.specialization}
                                </span>
                            }
                        </h1>
                    <NavLink to={"settings"}>
                        <i className="ri-user-settings-line"></i>
                    </NavLink>
                </header>
                <Outlet/>
            </section>
        </div>
    )
}