import React from "react"

import styles from "./Auth.module.css"
import {Outlet} from "react-router-dom";

export default function Auth() {

    return (
        <div className={styles.authBody}>
            <div className={styles.authContainer}>
                <img
                    src="/file.svg"
                    alt="logo"
                    className={styles.logo}
                />

                <Outlet />
            </div>
        </div>
    )
}
