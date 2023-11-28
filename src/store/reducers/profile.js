import { FETCH_PROFILE, SUCCESS_FETCH_PROFILE, ERROR_FETCH_PROFILE,REMOVE_PROFILE } from '../actions/profile';

const initialState = {
    user: {},
    loading: false,
}

const profileReducer = (state = initialState, action) => {

    switch (action.type) {
        case FETCH_PROFILE:
            return {
                ...state,
                loading: true
            }
        case SUCCESS_FETCH_PROFILE:
            return {
                ...state,
                loading: false,
                user: action.data,
            }
        case ERROR_FETCH_PROFILE:
            return {
                ...state,
                loading: false,
            }
        case REMOVE_PROFILE:
            return{
                ...state,
                user:null,
            }    

        default:
            return state;
    }
}

export default profileReducer;