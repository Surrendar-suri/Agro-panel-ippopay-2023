import { FETCH_TAXLIST_SUCCESS, FETCH_TAXLIST_FAIL,FETCH_TAXESDETAIL_SUCCESS,FETCH_TAXESDETAIL_FAIL } from '../actions/tax';

const initialState = {
    user: {},
    loading: false,
}

const taxReducer = (state = initialState, action) => {

    switch (action.type) {
        
        case FETCH_TAXLIST_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.data,
            }
        case FETCH_TAXLIST_FAIL:
            return {
                ...state,
                loading: false,
            }
        

        default:
            return state;
    }
}

export default taxReducer;