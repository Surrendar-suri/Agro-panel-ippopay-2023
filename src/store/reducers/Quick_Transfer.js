import { userConstants } from "../../constants/ActionTypes";


const initialState = {
    showQuickTransfer : false,
    contactList : [],
    page : 1,
    limit : 10,
    add_new_contact : false,
    selectContact : false,
    selectedSingleContact : {},
    addingPayout : false,
    confirmCreationPayout : false,
    contact_type_list : [
        { value: 'Customer' },
        { value: 'Merchant' },
        { value: 'Employee' },
        { value: 'vendor' },
        { value: 'Supplier' }
    ],
    contact_type_list_copy : [
        { value: 'Customer' },
        { value: 'Merchant' },
        { value: 'Employee' },
        { value: 'vendor' },
        { value: 'Supplier' }
    ],
    drop_down_open : false,
    contact_type : "",
    FundAcntList : [],
    selectedFundAcntList : {},
    FundAcntUpiList : [],
    selectedFundAcntUpiList : {},
    account_type : "bank_acnt",
    account_type_list : "bank_acnt",
    ShowFundAcntList : false,
    ShowFundAcntUpiList : false,
    contact_id : "",
    beneficiary_id:"",
    payoutList:[],
    //account_type : "bank_account",
    contact_name : "",
    phone : "",
    email : "",
    contact_type : "",
    fund_account_list : [],
    contactList : [],
    back_stage : false,
    remove_stage : false,
    drop_down_open : false,
    itemSearchTerm : "",
    totalPage : 0,
    page : 1,
    limit : 50,
    open_picker : false,
    startDate : new Date(),
    endDate : new Date(),
    from: "",
    to: "",
    fromDate:  "",
    toDate: "",
    searchTerm: '',
    filterList: false,
    contactDetail: {},
    modalIsOpen:false,
    transactionDetails:{},
    showContactList:true,
    payment_type:"",
    transaction_ref:"",
    payout_verify_otp:"",
    showPayout:false,    
};

export function quick_transfer(state = initialState, action) {
    switch (action.type) {
        case userConstants.QUICK_TRANSFER:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
}