import React from "react";
import BmiBar from "./BmiBar.jsx";

export default function Cards({ data, className = "" }) {

    const cardElements = Object.entries(data).map(([key, {title, value, unit = "", description = "", visual = ""}]) => {

        return (
            <div key={key} className={`card ${className}`}>
                {!description ? <span>{title}</span> : <span><b>{title}</b> - {description}</span>}
                <h1>{value}{unit && ` - ${unit}`}</h1>
                {className === "big" && <>{visual ? <BmiBar value={value} /> : <BmiBar empty={true}/>}</>}
            </div>
        )
    })

    return (
        <section className="cardsSection">
            {cardElements}
        </section>
    );
}
