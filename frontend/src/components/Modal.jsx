import React, {useState} from "react"
import styles from "../pages/App/patients/Patients.module.css";

export default function Modal({ delFunc, delText, data = {id: 0, name: ""}, buttonClass = "clearButton", buttonText = "" }) {
    const [showAlert, setShowAlert] = useState(null)

    return (
        <>
            {(delFunc) &&
                <button
                    type="button"
                    className={buttonClass}
                    onClick={() => {
                        setShowAlert({
                            id: data.id,
                            name: data.name
                        })
                    }}
                >
                    {buttonText ? buttonText : <i className="ri-delete-bin-6-line" style={{color: "red", fontSize: "1.75rem",}}></i>}
                </button>
            }

            {(delFunc && showAlert) &&
            <>
                <div
                    className={styles.overlay}
                    onClick={() => setShowAlert(null)}
                ></div>
                <div className={styles.alert}>
                    <span>{delText ? delText : "Czy na pewno chcesz to usunąć?"} {showAlert.name && <><br/><b>{showAlert.name}</b>?</>}</span>
                    <span>Tej akcji nie można cofnąć</span>
                    <div>
                        <button
                            type="button"
                            onClick={() => {
                                showAlert.id === -1 ? delFunc() : delFunc(showAlert.id)
                                setShowAlert(null)
                            }}
                        >
                            Tak
                        </button>
                        <button
                            type="button"
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