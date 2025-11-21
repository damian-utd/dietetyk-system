export function planReducer(state, action) {
    switch(action.type) {

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

            }
        }

        default:
            return state
    }
}