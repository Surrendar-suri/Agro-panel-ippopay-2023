import {SUCCESS_INVOICEDUE_LIST,ERROR_INVOICEDUE_LIST} from '../actions/invoice';

const initialState = {
    user: {},
    loading: false,
}

const invoiceReducer = (state = initialState, action) => {

    switch (action.type) {
        
        case SUCCESS_INVOICEDUE_LIST:
            return {
                ...state,
                loading: false,
                user: action.data,
            }
        case ERROR_INVOICEDUE_LIST:
            return {
                ...state,
                loading: false,
            }
           

        default:
            return state;
    }
}

export default invoiceReducer;