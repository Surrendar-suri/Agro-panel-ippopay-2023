import {SUCCESS_INVOICE_LIST,ERROR_INVOICE_LIST} from '../actions/invoice';

const initialState = {
    user: {},
    loading: false,
}

const invoiceReducer = (state = initialState, action) => {

    switch (action.type) {
        
        case SUCCESS_INVOICE_LIST:
            return {
                ...state,
                loading: false,
                user: action.data,
            }
        case ERROR_INVOICE_LIST:
            return {
                ...state,
                loading: false,
            }
           

        default:
            return state;
    }
}

export default invoiceReducer;