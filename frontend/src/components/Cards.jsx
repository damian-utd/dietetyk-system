//Cards
import React from "react"

export default function Cards({ data, style = {} }){

    // console.log(data)

    const cardElements = Object.entries(data).map(([key, value]) => {

        let content;
        switch(key){
            case "patientsCount":
                content = "Liczba pacjentów"
                break;
            default:
                content = ""
                break;
        }
        console.log(content)
        return (
            <>
                <div key={key} style={style}>
                    <p> {content} </p>
                    {value.value !== undefined ? <h1>{value.value}</h1> : <h1>{value}</h1>}
                </div>
            </>
        )
    })

    return (
        <section className="cardsSection">
            {cardElements}
        </section>
    )
}