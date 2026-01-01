export const setFilter = (val) => {
    return ({
        type: 'SET',
        payload: {
            value: val
        }
    })
}

const filterReducer = (state = '', action) => {
    switch (action.type){
        case 'SET': {
            return action.payload.value
        }
        default: {
            return state
        }
            
    }
}

export default filterReducer