import { SUCCESS_CHANGE_PASSWORD, ERROR_CHANGE_PASSWORD } from '../actions/password';

const initialState = {
    user: null,
    loading: false,
}

const profileReducer = (state = initialState, action) => {

    switch (action.type) {
        case SUCCESS_CHANGE_PASSWORD:
            return {
                ...state,
                loading: false,
                user: action.data,
            }
        case ERROR_CHANGE_PASSWORD:
            return {
                ...state,
                loading: false,
            }
        default:
            return state;
    }
}

export default profileReducer;