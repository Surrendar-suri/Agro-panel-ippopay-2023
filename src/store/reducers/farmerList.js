import { FETCH_FARMER_LIST, SUCCESS_FETCH_FARMER, ERROR_FETCH_FARMER,REMOVE_FARMER_LIST } from '../actions/farmerList';

const initialState = {
    user: {},
    loading: false,
}

const businessReducer = (state = initialState, action) => {

    switch (action.type) {
        case FETCH_FARMER_LIST:
            return {
                ...state,
                loading: true
            }
        case SUCCESS_FETCH_FARMER:
            return {
                ...state,
                loading: false,
                user: action.data,
            }
        case ERROR_FETCH_FARMER:
            return {
                ...state,
                loading: false,
            }
        case REMOVE_FARMER_LIST:
            return {
                user:null
            }
        default:
            return state;
    }
}

export default businessReducer;