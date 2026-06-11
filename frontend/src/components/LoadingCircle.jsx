import React from "react"
import styles from "./LoadingCircle.module.css"

export default function LoadingCircle() {

    return (
        <div className={styles.spinner}>
            <i className="ri-loader-4-line"></i>
        </div>
    )
}
