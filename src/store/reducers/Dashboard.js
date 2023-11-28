import { userConstants } from "../../constants/ActionTypes";


const initialState = {
    virtual_acnt_created : false,
    acnt_balance : "",
    available_balance:"0",
    company_name : "",
    account_number : "",
    ifsc : "",
    business:{},
    contact_name:"",
    amount:"",
    note:"",
    pay_mode:"",
    trans_ref:"",
    showBankTransfer:false,
    account_number_bank : "",
    ifsc_bank : "",
    upivpaModal:false,
    upivpabank:"yesbank",
    upivpaid:"",
    show_upi_error:false,
    upi_id:"",
    TransactionList : [],
    page : 1,
    limit : 5,
    totalPage : 0,
    isTransDetail: false,
    checkMode:null,
    dashboardResults:{},
    dashboardPayoutTotalResults:{},
    dashboardPayoutCountResults:{},
    upi_vpa_id:""
};

export function dashboard(state = initialState, action) {
    switch (action.type) {  
        case userConstants.DASHBOARD:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
}