//PlanDaysSection

import React from "react"

import daysStyles from "../styles/Days.module.css"
import PlanDay from "./PlanDay.jsx";

export default function PlanDaysSection({ planDispatch, days, currentDayNumber }) {

    const activeStyle = {
        color: "#000",
        borderBottom: "2px solid #7EDC00"
    }

    const daysList = days.map((day, index) =>
        <b
            key={day.day_number}
            onClick={() => planDispatch({type: 'setField', value: day.day_number, field: 'currentDayNumber'})}
            style={index + 1 === currentDayNumber ? activeStyle : {}}
        >
            Dzień {day.day_number}
        </b>
    )

    return (
        <fieldset className={daysStyles.days}>
            <div className={daysStyles.daysHeader}>
                <button
                    type="button"
                    onClick={() => planDispatch({type: 'addDay'})}
                    className={daysStyles.addDayButton}
                >
                    <i className="ri-add-large-line"></i>
                </button>
                <nav className={daysStyles.navDays}>
                    {daysList}
                </nav>
                <button
                    type="button"
                    onClick={() => planDispatch({type: 'removeLastDay'})}
                    className={daysStyles.addDayButton}
                >
                    <i className="ri-subtract-line"></i>
                </button>
            </div>

            <PlanDay
                key={currentDayNumber}
                day={days.find(d => d.day_number === currentDayNumber)}
                planDispatch={planDispatch}
            />
        </fieldset>
    )
}