import React from "react";
import BmiBar from "./BmiBar.jsx";
import styles from "./Cards.module.css";

export default function Cards({ data, className = "" }) {

    const cardElements = Object.entries(data).map(([key, {title, value, unit = "", description = "", visual = ""}]) => {

        return (
            <div key={key} className={`${styles.card} ${className === "big" ? styles.big : ""}`}>
                {!description ? <span>{title}</span> : <span><b>{title}</b> - {description}</span>}
                <h1>{value}{unit && ` - ${unit}`}</h1>
                {className === "big" && <>{visual ? <BmiBar value={value} /> : <BmiBar empty={true}/>}</>}
            </div>
        )
    })

    return (
        <section className={styles.cardsSection}>
            {cardElements}
        </section>
    );
}
