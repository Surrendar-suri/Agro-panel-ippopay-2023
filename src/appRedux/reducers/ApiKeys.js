import { userConstants } from "../../constants/ActionTypes";

const initialState = {
    apikeys:{},
    whitelist_ip: [],
    isapikeys:false,
    modalIsOpen:false,
    add_ip:""
};

export function api_details(state = initialState, action) {
    switch (action.type) {  
        case userConstants.API_DETAILS:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
}