// import React from "react";
//
// export default function BMIBar({ value }) {
//     const minBMI = 10;
//     const maxBMI = 40;
//     const position = Math.min(Math.max(((value - minBMI) / (maxBMI - minBMI)) * 100, 0), 100);
//
//     return (
//         <div className="bmiBar">
//             <div className="bmiSection" style={{ backgroundColor: "orange", flex: 18.5 - 10, borderTopLeftRadius: "16px", borderBottomLeftRadius: "16px" }}></div>
//             <div className="bmiSection" style={{ backgroundColor: "green", flex: 25 - 18.5 }}></div>
//             <div className="bmiSection" style={{ backgroundColor: "yellow", flex: 30 - 25 }}></div>
//             <div className="bmiSection" style={{ backgroundColor: "red", flex: 40 - 30, borderTopRightRadius: "16px", borderBottomRightRadius: "16px" }}></div>
//
//             <div className="bmiMarker" style={{ left: `50%` }}></div>
//         </div>
//     );
// }

import React from "react";

export default function BMIBar({ value }) {
    const minBMI = 10;
    const maxBMI = 40;
    const position = Math.min(Math.max(((value - minBMI) / (maxBMI - minBMI)) * 100, 0), 100);
    console.log(position)
    return (
        <div className="bmiBar">
            <div
                className="bmiMarker"
                style={{ left: `${position}%` }}
            ></div>
        </div>
    );
}
