import { FETCH_TAXESDETAIL_SUCCESS,FETCH_TAXESDETAIL_FAIL } from '../actions/taxDetails';

const initialState = {
    user: {},
    loading: false,
}

const taxDetailReducer = (state = initialState, action) => {

    switch (action.type) {
        
        
        case FETCH_TAXESDETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.data,
            }
        case FETCH_TAXESDETAIL_FAIL:
            return {
                ...state,
                loading: false,
            }

        default:
            return state;
    }
}

export default taxDetailReducer;