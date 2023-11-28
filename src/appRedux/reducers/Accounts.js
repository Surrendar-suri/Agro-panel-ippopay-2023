import { userConstants } from "../../constants/ActionTypes";


const initialState = {
    toggleTab : "virtual_account",
    toggleVirtualTab : "list",
    toggleUpiTab : "list",
    virtualList : [],
    UPICollection : [],
    UPIList : [],
    addUPI : "",
    showCalendar : false
};

export function accounts(state = initialState, action) {
    switch (action.type) {  
        case userConstants.CREATE_ACCOUNT:
            return {
                ...state,
                ...action.payload
            };
        case userConstants.FORCE_UPDATE:
            return {
                ...action.payload
            };
        default:
            return state
    }
}