//PlanCreator

import React, {useState} from "react"
import {useLoaderData, Form} from "react-router-dom";

import styles from "./Plans.module.css"
import {getPatients} from "../../../api/app/patients.js";
import Day from "./Day.jsx"

export async function loader( { request } ){
    // await requireAuth(request)

    try {
        return await getPatients()
    } catch (error) {
        throw new Error(error.message);
    }

}

export async function action( {request} ) {
    // const formData = await request.formData()
    // const data = Object.fromEntries(formData);

    // console.log(data)
}



export default function PlanCreator() {
    const loaderData = useLoaderData()

    const [days, setDays] = useState([
        {
            day_number: 1,
            meals: [
                {
                    name: "Śniadanie",
                    order_number: 1,
                    notes: "",
                    meal_products: [
                        {
                            product_id: "mleko",
                            quantity: 150,
                            unit: "ml"
                        },
                        {
                            product_id: "płatki",
                            quantity: 100,
                            unit: "g"
                        },
                    ]
                },
                {
                    name: "Obiad",
                    order_number: 2,
                    notes: "",
                    meal_products: [
                        {
                            product_id: "kurczak",
                            quantity: 350,
                            unit: "g"
                        },
                        {
                            product_id: "ugotowany ryż",
                            quantity: 150,
                            unit: "g"
                        },
                    ]
                }
            ]
        },
    ])

    function addDay() {
        setDays(prev => (
            [...prev, {day_number: prev.length+1, meals: []}]
        ))
    }

    function removeLastDay() {
        if(days.length === 1) return

        if(days.slice(-1)[0].day_number === currentDayNumber) setCurrentDayNumber(prev => Math.max(1, prev - 1))

        setDays(prev => prev.slice(0, -1));
    }

    const [currentDayNumber, setCurrentDayNumber] = useState(1)

    const patients = loaderData?.patients || []

    const patientsList = patients.map((patient) => {
        return (
            <option key={patient.id} value={patient.id}>
                {patient.first_name} {patient.last_name}
            </option>
        )
    })

    const activeStyle = {
        color: "#000",
        borderBottom: "2px solid #7EDC00"
    }

    const daysList = days.map((day, index) =>
        <b
            key={index}
            onClick={() => setCurrentDayNumber(day.day_number)}
            style={index + 1 === currentDayNumber ? activeStyle : {}}
        >
            Dzień {day.day_number}
        </b>
    )

    return (
        <div className={styles.planCreatorBody}>
            <Form method="post" className={styles.main}>
                <fieldset className={styles.metaData}>
                    <legend>Stwórz plan dietetyczny</legend>
                    <div>
                        <select
                            name="patient_id"
                            defaultValue=""
                            required
                            className={styles.patient}
                        >
                            <option value="" disabled>Wybierz pacjenta</option>
                            <option value={-1}>Szablon ogólny</option>
                            {patientsList}
                        </select>

                        <input
                            type="text"
                            name="title"
                            placeholder="Tytuł (np. Redukcja 2400kcal)"
                            required
                            className={styles.title}
                        />
                    </div>

                    <textarea
                        name="description"
                        id="description"
                        placeholder="Opis... "
                        required
                        rows={3}
                        className={styles.description}
                    />
                </fieldset>
                <fieldset className={styles.days}>
                    <div className={styles.daysHeader}>
                        <button
                            type="button"
                            onClick={addDay}
                            className={styles.addDayButton}
                        >
                            <i className="ri-add-large-line"></i>
                        </button>
                        <nav className={styles.navDays}>
                            {daysList}
                        </nav>
                        <button
                            type="button"
                            onClick={removeLastDay}
                            className={styles.addDayButton}
                        >
                            <i className="ri-subtract-line"></i>
                        </button>
                    </div>

                    <Day
                        day={days.find(d => d.day_number === currentDayNumber)}
                    />
                </fieldset>
            </Form>
            <section className={styles.side}>
                <div className={styles.buttonContainer}>
                    <button className={styles.saveButton}>Zapisz plan</button>
                    <button className={styles.pdfButton}>Wygeneruj pdf</button>
                </div>
                <div className={styles.nutritionProgress}>
                {/*    dodać dynamiczny progres makro */}
                </div>
            </section>

        </div>
    )
}