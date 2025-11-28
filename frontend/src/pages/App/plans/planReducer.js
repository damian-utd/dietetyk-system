export function planReducer(state, action) {
    switch(action.type) {

        case 'setDefault': {
            return {
                patient_id: null,
                title: "",
                description: "",
                days: [{
                    day_number: 1,
                    meals: []
                }],
                currentDayNumber: 1
            }
        }

        case 'setField': {
            return {
                ...state,
                [action.field]: action.value
            }
        }

        case 'addDay': {
            return {
                ...state,
                currentDayNumber: state.days.length+1,
                days: [
                    ...state.days,
                    {
                        day_number: state.days.length+1,
                        meals: []
                    }
                ]
            }
        }

        case 'removeLastDay': {
            if (state.days.length === 1) return state

            const isCurrentDay = state.days.at(-1).day_number === state.currentDayNumber
            const newCurrentDay = isCurrentDay ? Math.max(1, state.currentDayNumber - 1) : state.currentDayNumber

            return {
                ...state,
                currentDayNumber: newCurrentDay,
                days: state.days.slice(0, -1)
            }
        }

        case 'addMeal': {
            return {
                ...state,
                days: state.days.map(day => {
                    if (day.day_number === state.currentDayNumber) {
                        return {
                            ...day,
                            meals: [
                                ...day.meals,
                                {
                                    name: action.name,
                                    notes: action.notes,
                                    order_number: day.meals.length+1,
                                    meal_products: []
                                }
                            ]
                        }
                    } else {
                        return day
                    }

                })
            }
        }

        case 'deleteMeal': {
            return {
                ...state,
                days: state.days.map(day => {
                    if (day.day_number === state.currentDayNumber) {
                        return {
                            ...day,
                            meals: day.meals
                                .filter(meal => meal.order_number !== action.order)
                                .map(meal => {
                                    if(meal.order_number > action.order){
                                        return {
                                            ...meal,
                                            order_number: meal.order_number - 1
                                        }
                                    }
                                    return meal
                                })
                        }
                    } else {
                        return day
                    }
                })
            }
        }

        case 'updateMeal': {
            return {
                ...state,
                days: state.days.map(day => {
                    if (day.day_number === state.currentDayNumber) {
                        return {
                            ...day,
                            meals: day.meals.map(meal => {
                                if (meal.order_number === action.order) {
                                        return {
                                            ...meal,
                                            [action.field]: action.value
                                        }
                                }
                                return meal
                            })
                        }
                    } else {
                        return day
                    }
                })
            }
        }

        default:
            return state
    }
}

export function initPlanState(initialState) {
    try {
        const lSData = localStorage.getItem("planData")

        if (lSData) {
            const lSDataParsed = JSON.parse(lSData)

            if (
                typeof lSDataParsed === "object" &&
                'title' in lSDataParsed &&
                'description' in lSDataParsed &&
                'days' in lSDataParsed
            ) {
                return lSDataParsed
            }
        }

    } catch (err) {
        console.warn("Invalid planData in LocalStorage", err)
    }

    return initialState
}