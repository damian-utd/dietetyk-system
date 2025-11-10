import React, {useEffect, useRef, useState} from "react";
import {roundDec} from "../api/utils.js";

export default function BMIBar({ value }) {
    const [position, setPosition] = useState(50)

    const minBMI = 10;
    const maxBMI = 40;
    const targetPosition = roundDec(Math.min(Math.max(((value - minBMI) / (maxBMI - minBMI)) * 100, 0), 100), 1)

    useEffect(() => {
        setPosition(targetPosition);
    }, [targetPosition]);

    return (
        <div className="bmiBar">
            <div
                className="bmiMarker"
                style={{ left: `${position}%` }}
            ></div>
        </div>
    );
}
