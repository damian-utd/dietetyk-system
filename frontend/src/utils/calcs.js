import {roundDec} from "./utils.js";

export function calcBMI(weight, height) {
    const fixedHeight = height/100
    const ratio = !weight || !height ? 0 : weight/(fixedHeight*fixedHeight)
    let unit

    if (ratio <= 0){
        unit = "Brak danych"
    }else if (ratio < 18.5){
        unit = "Niedowaga"
    }else if(ratio < 25){
        unit = "Norma"
    }else if(ratio < 30) {
        unit = "Nadwaga"
    }else if(ratio < 150){
        unit = "Otyłość"
    }else{
        unit = "Brak danych"
    }

    return {
        title: "BMI",
        value: ratio > 150 ? 0 : ratio,
        description: "Wskaźnik masy ciała",
        unit: unit
    }
}

export function calcBMR(weight, height, age, sex) {
    const value = 10 * weight + 6.25 * height - 5 * age

    if (sex === "male") {
        return {
            title: "PPM",
            value: !weight || !height || !age || !sex ? 0 : value + 5,
            description: "Podstawowa przemiana materii",
            unit: !weight || !height || !age || !sex ? "Brak danych" : "kcal"
        }
    }else {
        return {
            title: "PPM",
            value: !weight || !height || !age || !sex ? 0 : value - 161,
            description: "Podstawowa przemiana materii",
            unit: !weight || !height || !age || !sex ? "Brak danych" : "kcal"
        }
    }
}

export function calcTDEE(BMR, activity) {
    return {
        title: "CPM",
        value: !BMR || !activity ? 0 : roundDec(BMR.value * activity, 2),
        description: "Całkowita przemiana materii",
        unit: !BMR || !activity ? "Brak danych" : "kcal"
    }
}

export function calcMacrosForWeight(value, weight = 100) {
    const parsed = parseFloat(value);
    return roundDec(parsed * weight/100, 2)
}