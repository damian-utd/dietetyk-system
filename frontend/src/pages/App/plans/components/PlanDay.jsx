//PlanDay

import React, {useState, useRef} from "react"

export default function PlanDay({ day, planDispatch }) {

    const [showMealForm, setShowMealForm] = useState(false)
    const mealName = useRef(null)
    const mealNotes = useRef(null)


    function handleAddMeal() {
        console.log("handleAddMeal")

        if (!showMealForm) {
            setShowMealForm(true)
            return
        }

        planDispatch({
            type: 'addMeal',
            name: mealName.current.value,
            notes: mealNotes.current.value
        })

        setShowMealForm(false)
        mealName.current.value = ""
        mealNotes.current.value = ""
    }

    console.log(day)

    const meals = day.meals.map((meal, index) => {
        return (
            <div key={index} >
                {meal.name} - {meal.notes}
                <ul>
                    {meal.meal_products.map((product, pindex) => (
                        <li key={pindex}>
                            <p>Produkt: {product.product_id}</p>
                            <p>Ilość: {product.quantity} {product.unit}</p>
                        </li>
                    ))}
                </ul>
            </div>
        )
    })

    return (
        <div>
            {meals}

            {showMealForm && <div>
                <input type="text" ref={mealName} placeholder="np. Śniadanie"/>
                <input type="text" ref={mealNotes} placeholder="Notatka... "/>
            </div>}
            <button
                type="button"
                onClick={handleAddMeal}
            >
                + Dodaj posiłek
            </button>

        </div>
    )
}