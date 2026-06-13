import React, {useState} from "react"
import styles from "./Table.module.css";
import {Link} from "react-router-dom";
import {roundDec} from "../utils/utils.js";
import Modal from "./Modal.jsx";

export default function Table({ title, headers = [], data = [], showLink = null, showFunc = null, delFunc = null, delText = "", width = "" }) {

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
                                className={`ri-eye-line ${styles.viewIcon}`}
                            ></i>
                        </Link>
                    }
                    {(!showLink && showFunc) &&
                        <button
                            onClick={() => showFunc(d.id, d.name, edit, setEdit)}
                            className={styles.viewButton}
                            disabled={!edit ^ edit !== d.id}
                        >
                            <i
                                className={`ri-eye-line ${styles.viewIcon}`}
                            ></i>
                        </button>

                    }

                    <Modal
                        delFunc = {delFunc}
                        delText = {delText}
                        data = {d}
                    />
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
            <table className={styles.table} style={width === "half" ? {width: "45rem"} : {}}>
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
        </>
    )
}
