
import { REGISTER_STARTS, REGISTER_SUCCESS, REGISTER_FAIL } from '../actions/register';
const initialState = {
    user: null,
    loading: false,
    error: null,
    isSignUp: false,
}

const registerReducer = (state = initialState, action) => {
    // console.log("action",JSON.stringify(action.data));
    switch (action.type) {
        case REGISTER_STARTS:
            return {
                ...state,
                loading: true,
            }
        case REGISTER_SUCCESS:
            return {
                ...state,
                loading: false,
                isSignUp: true,
                user: action.data,
            }
        case REGISTER_FAIL:
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

export default registerReducer;