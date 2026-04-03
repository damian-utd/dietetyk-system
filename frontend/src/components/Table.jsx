import React, {useState} from "react"
import styles from "../pages/App/patients/Patients.module.css";
import {Link} from "react-router-dom";
import {roundDec} from "../utils/utils.js";

export default function Table({ title, headers = [], data = [], showLink = null, showFunc = null, delFunc = null, delText = "", width = "" }) {

    const [showAlert, setShowAlert] = useState(null)
    const [edit, setEdit] = useState(false)

    const dataRows = data.map((d) => {
        if(d.length === 0) {
            return null
        }
        const len = roundDec(1 / (Object.keys(d ?? {a:0}).length - 1) * 100, 2)
        const dataColumns = Object.entries(d)
            .slice(1)
            .map(([, value], index) => {
                return (
                    <td
                        key={index}
                        style={{maxWidth: `${len}%`, minWidth: `${len}%`, width: `${len}%`}}
                    >
                        {(value.length > 29)  ? value.slice(0,30).concat("...") : value}
                    </td>
                )
            });

        const optionColumns = (
            <td>
                <div className={styles.optionsRow}>
                    {(showLink && !showFunc) &&
                        <Link to={`/${showLink}/${d.id}`}>
                            <i
                                className="ri-eye-line"
                                style={{color: "#121A0D", fontSize: "1.75rem", lineHeight: "2rem"}}
                            ></i>
                        </Link>
                    }
                    {(!showLink && showFunc) &&
                        <button
                            onClick={() => showFunc(d.id, d.name, edit, setEdit)}
                            style={{border: "none", backgroundColor: "inherit"}}
                            disabled={!edit ^ edit !== d.id}
                        >
                            <i
                                className="ri-eye-line"
                                style={{color: "#121A0D", fontSize: "1.75rem", lineHeight: "2rem"}}
                            ></i>
                        </button>

                    }

                    {(delFunc) &&
                        <button
                            className="clearButton"
                            onClick={() => {
                                setShowAlert({
                                    id: d.id,
                                    name: d.name
                                })
                            }}
                        >
                            <i className="ri-delete-bin-6-line" style={{color: "red", fontSize: "1.75rem",}}></i>
                        </button>
                    }
                </div>
            </td>
        )

        return (
            <tr key={d.id}>
                {dataColumns}
                {optionColumns}
            </tr>
        )
    })

    const headersRow = headers.map((h, index) => {
        return (
            <th key={index}>
                {h}
            </th>
        )
    })

    return (
        <>
            <div className={styles.tableCaption} style={width === "half" ? {justifyContent: "center"} : {}}>
                <h1>{title}</h1>
            </div>
            <table className={styles.patientsTable} style={width === "half" ? {width: "45rem"} : {}}>
                <thead>
                    <tr>
                        {headersRow}
                        <th>Opcje</th>
                    </tr>
                </thead>
                <tbody>
                {dataRows}
                </tbody>
            </table>
            {(delFunc && showAlert) &&
                <>
                    <div
                        className={styles.overlay}
                        onClick={() => setShowAlert(null)}
                    ></div>
                    <div className={styles.alert}>
                        <span>{delText ? delText : "Czy na pewno chcesz to usunąć?"} <br/><b>{showAlert.name}</b>?</span>
                        <span>Tej akcji nie można cofnąć</span>
                        <div>
                            <button
                                onClick={() => {
                                    delFunc(showAlert.id)
                                    setShowAlert(null)
                                }}
                            >
                                Tak
                            </button>
                            <button
                                onClick={() => setShowAlert(null)}
                            >
                                Nie
                            </button>
                        </div>
                    </div>
                </>
            }
        </>
    )
}