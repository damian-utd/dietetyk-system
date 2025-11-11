import React, {useEffect, useState} from "react";
import {roundDec} from "../api/utils.js";

export default function BMIBar({ value, empty = false }) {
    const [position, setPosition] = useState(50)

    const minBMI = 10;
    const maxBMI = 40;
    const targetPosition = roundDec(Math.min(Math.max(((value - minBMI) / (maxBMI - minBMI)) * 100, 0), 100), 1)

    useEffect(() => {
        setPosition(targetPosition);
    }, [targetPosition]);

    return (
        <div className={`bmiBar ${empty ? "empty" : ""}`}>
            <div
                className={`bmiMarker ${empty ? "empty" : ""}`}
                style={{ left: `${position}%` }}
            ></div>
        </div>
    );
}
