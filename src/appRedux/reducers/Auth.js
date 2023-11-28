import { userConstants } from "../../constants/ActionTypes";


const initialState = {
    full_name : "",
    business_name : "",
    phone : "",
    email : "",
    terms_condition : false,
    signup_screen : true,
    login_phone : "",
    login_password : "",
    addBgClass:"signup_bg",
    trans_password:""
};

export function authentication(state = initialState, action) {
    switch (action.type) {
        case userConstants.REGISTER_REQUEST:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
}