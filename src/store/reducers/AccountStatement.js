import { userConstants } from "../../constants/ActionTypes";

const initialState = {
    page : 1,
    limit : 10,
    totalPage : 0,
    TransactionList : [],
    open_picker : false,
    startDate : new Date(),
    endDate : new Date(),
    from: "",
    to: "",
    fromDate:  "",
    toDate: "",
    isTransDetail: false,
    TransactionDetail: {}
};

export function account_statement(state = initialState, action) {
    switch (action.type) {  
        case userConstants.ACCOUNT_STATEMENT:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
}