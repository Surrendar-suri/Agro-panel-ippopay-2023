import { FETCH_BUSINESS_LIST, SUCCESS_FETCH_BUSINESS, ERROR_FETCH_BUSINESS,REMOVE_BUSINESS_LIST } from '../actions/businessList';

const initialState = {
    user: {},
    loading: false,
}

const businessReducer = (state = initialState, action) => {

    switch (action.type) {
        case FETCH_BUSINESS_LIST:
            return {
                ...state,
                loading: true
            }
        case SUCCESS_FETCH_BUSINESS:
            return {
                ...state,
                loading: false,
                user: action.data,
            }
        case ERROR_FETCH_BUSINESS:
            return {
                ...state,
                loading: false,
            }
        case REMOVE_BUSINESS_LIST:
            return {
                ...state,
                user:null
            }
        default:
            return state;
    }
}

export default businessReducer;