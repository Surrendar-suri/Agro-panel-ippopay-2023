
import { LOGIN_STARTS, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_USER, FORGOT_PASSWORD, ERROR_FORGOT_PASSWORD, RESET_PASSWORD, ERROR_RESET_PASSWORD } from '../actions/login';
const initialState = {
    user: null,
    loading: false,
    error: null,
    isLoggedIn: false,
}

const authReducer = (state = initialState, action) => {
    // console.log("action", JSON.stringify(action.data));
    switch (action.type) {
        case LOGIN_STARTS:
            return {
                ...state,
                loading: true,
            }
        case LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.data,
                isLoggedIn: true,
            }
        case LOGIN_FAIL:
            return {
                ...state,
                loading: false,
                isLoggedIn: false,

            }
        case LOGOUT_USER:
            return {
                ...state,
                user: null,
                isLoggedIn: false,

            }
        case FORGOT_PASSWORD:
            return {
                ...state,
                loading: false,
                user: action.data,
            }
        case ERROR_FORGOT_PASSWORD:
            return {
                ...state,
                loading: false,
            }
        case RESET_PASSWORD:
            return {
                ...state,
                loading: false,
                user: action.data
            }
        case ERROR_RESET_PASSWORD:
            return {
                ...state,
                loading: false,
            }
        default:
            return state;
    }
};

export default authReducer;