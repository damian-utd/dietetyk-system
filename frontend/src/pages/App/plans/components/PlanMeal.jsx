import React, {useState, useEffect} from "react"
import mealsStyles from "../styles/Meals.module.css";
import daysStyles from "../styles/Days.module.css"
import PlanProducts from "./PlanProducts.jsx";
import {roundDec} from "../../../../utils/utils.js";
import {calcMacrosForWeight} from "../../../../utils/calcs.js";
import PlanMacros from "./PlanMacros.jsx";

export default function PlanMeal({ meal, planDispatch, isLast }) {

    const [showNameInput, setShowNameInput] = useState(false)
    const [showNotesInput, setShowNotesInput] = useState(false)
    const [showSearchProducts, setShowSearchProducts] = useState(false)
    const [mealMacros, setMealMacros] = useState({id: meal.order_number, energy: 0, protein: 0, carbs: 0, fats: 0})

    function deleteMeal() {
        planDispatch({
            type: 'deleteMeal',
            order: meal.order_number
        })
    }

    function updateMeal(e) {
        if (e.target.name === "update_meal_name") {
            planDispatch({
                type: 'updateMeal',
                order: meal.order_number,
                field: 'name',
                value: e.target.value
            })
            setShowNameInput(false)
        }
        if (e.target.name === "update_meal_notes") {
            planDispatch({
                type: 'updateMeal',
                order: meal.order_number,
                field: 'notes',
                value: e.target.value
            })
            setShowNotesInput(false)
        }
    }

    useEffect(() => {
        const energy = roundDec(meal.meal_products.reduce((acc, product) => acc + calcMacrosForWeight(product.energy, product.quantity), 0), 2)
        const protein = roundDec(meal.meal_products.reduce((acc, product) => acc + calcMacrosForWeight(product.protein, product.quantity), 0), 2)
        const carbs = roundDec(meal.meal_products.reduce((acc, product) => acc + calcMacrosForWeight(product.carbs, product.quantity), 0), 2)
        const fats = roundDec(meal.meal_products.reduce((acc, product) => acc + calcMacrosForWeight(product.fats, product.quantity), 0), 2)

        setMealMacros(prev => {
            return {
                ...prev,
                energy,
                protein,
                carbs,
                fats
            }
        })


        
    }, [meal.meal_products]);



    return (
        <section className={`${mealsStyles.mealSection} ${isLast ? mealsStyles.lastMeal : ''}`}>
            <div
                key={meal.order_number}
                className={`${mealsStyles.mealContainer}`}
            >
                <i className={`ri-delete-bin-6-line`} style={{fontSize: "2rem", cursor: "pointer"}}
                   onDoubleClick={() => deleteMeal()}>
                </i>
                <div className={mealsStyles.mealMeta}>
                    <div className={mealsStyles.mealTitle}>
                        {showNameInput
                            ? <input
                                defaultValue={meal.name}
                                className={daysStyles.mealInput}
                                name="update_meal_name"
                                onBlur={(e) => updateMeal(e)}
                                onKeyDown={(e) => e.key === "Enter" && updateMeal(e)}
                                autoFocus={true}
                            />
                            : <h2
                                onDoubleClick={() => setShowNameInput(prev => !prev)}
                            >
                                {meal.name}
                            </h2>}
                        {showNotesInput
                            ? <input
                                defaultValue={meal.notes}
                                className={daysStyles.mealInput}
                                name="update_meal_notes"
                                onBlur={(e) => updateMeal(e)}
                                onKeyDown={(e) => e.key === "Enter" && updateMeal(e)}
                                autoFocus={true}
                            />
                            : <span
                                className={mealsStyles.mealNotes}
                                onDoubleClick={() => setShowNotesInput(true)}
                            >
                                {meal.notes}
                            </span>}
                    </div>
                    <PlanMacros
                        energy={mealMacros.energy}
                        protein={mealMacros.protein}
                        carbs={mealMacros.carbs}
                        fats={mealMacros.fats}
                    />
                </div>
                <button type="button" className={daysStyles.addMealButton} onClick={() => setShowSearchProducts(prev => !prev)}>{showSearchProducts ? "Ukryj" : "Dodaj produkt"}</button>
            </div>
            <PlanProducts
                meal={meal}
                showSearchProducts={showSearchProducts}
                planDispatch={planDispatch}
            />

        </section>
    )
}