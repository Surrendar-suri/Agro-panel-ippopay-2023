
import { SUBMERCHANT_STARTS, SUBMERCHANT_SUCCESS, SUBMERCHANT_FAIL } from '../actions/submerchant';
const initialState = {
    user: null,
    loading: false,
    error: null,
    isSignUp: false,
}

const submerchantReducer = (state = initialState, action) => {

    switch (action.type) {
        case SUBMERCHANT_STARTS:
            return {
                ...state,
                loading: true,
            }
        case SUBMERCHANT_SUCCESS:
            return {
                ...state,
                loading: false,
                isSignUp: true,
                user: action.data,
            }


        case SUBMERCHANT_FAIL:
            return {
                ...state,
                loading: false,
                isSignUp: false,
                error: action.data,
            }

        default:
            return state;
    }
};

export default submerchantReducer;