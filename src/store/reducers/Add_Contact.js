import { userConstants } from "../../constants/ActionTypes";

const initialState = {
    fund_account : false,
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
    contact_type_list_items : [
        { value: 'customer', label: 'Customer' },
        { value: 'merchant', label: 'Merchant' },
        { value: 'vendor', label: 'Vendor' },
        { value: 'supplier', label: 'Supplier' }
    ],
    account_type : "bank_account",
    contact_name : "",
    phone : "",
    email : "",
    contact_type : "",
    fund_account_list : [],
    contactList : [],
    back_stage : false,
    remove_stage : false,
    showAddFundAccount:true,
    drop_down_open : false,
    itemSearchTerm : "",
    totalPage : 0,
    page : 1,
    limit : 10,
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
    modalIsOpen: false,
    mobile:{},
    beneficiaryList:[],
    upiList:[],
    addMultipleBtn:false,
    bank_info:{},
    create_contact:false,
};

export function add_contact(state = initialState, action) {
    switch (action.type) {
        case userConstants.CREATE_CONTACT:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
}