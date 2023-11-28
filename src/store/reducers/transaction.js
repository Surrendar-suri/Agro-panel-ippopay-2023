import { SUCCESS_FETCH_TRANSACTION_LIST,FAIL_FETCH_TRANSACTION_LIST } from '../actions/transaction';

const initialState = {
    user: {},
    loading: false,
}

const transactionReducer = (state = initialState, action) => {

    switch (action.type) {
        
        case SUCCESS_FETCH_TRANSACTION_LIST:
            return {
                ...state,
                loading: false,
                user: action.data,
            }
        case FAIL_FETCH_TRANSACTION_LIST:
            return {
                ...state,
                loading: false,
            }
        

        default:
            return state;
    }
}

export default transactionReducer;