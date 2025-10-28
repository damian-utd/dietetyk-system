//CardsSection
import React from "react"
import Card from "./Card.jsx"
import {Await} from "react-router-dom";
import LoadingCircle from "../../../../components/LoadingCircle.jsx";

export default function CardsSection({ data }){

    const cardElements = Object.entries(data).map(([key, value]) => {
        return (
            <React.Suspense key={key} fallback={<LoadingCircle/>}>
                <Await resolve={value}>
                    {(resolved) => (
                        <Card>
                            { key === "patientsCount" && <p> Liczba pacjentów </p> }
                            <h1>{resolved}</h1>
                        </Card>
                    )}
                </Await>
            </React.Suspense>
        )
    })

    return (
        <div>
            {cardElements}
        </div>

    )
}