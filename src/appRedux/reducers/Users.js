import { userConstants } from "../../constants/ActionTypes";


const initialState = {
    toggleTab : "role_list",
    virtualList : [],
    UPICollection : [],
    roleList : [],
    userList : [],
    UPIList : [],
    addUPI : "",
    showCalendar : false,
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
    RoleDetail: {},
    checked: [],
    expanded: ['balance','account','fund_transfers','virtual_accounts','upi','upi_collections','bank_upi_verify'],
    nodes: [
        {
          value: 'balance',
          label: 'Balance'
        },
        {
          value: 'account',
          label: 'Account',
          children: [
              { value: 'account_details', label: 'Account Details' },
              { value: 'fund_added', label: 'Funds Added Transactions' }
          ],
        },
        {
          value: 'fund_transfers',
          label: 'Fund Transfers ',
          children: [
              { value: 'bank_transfers', label: 'Bank Transfer Transactions' },
              { value: 'initiate_bank_transfers', label: 'Initiate Bank Transfers' },
              { value: 'initiate_bulk_bank_transfers', label: 'Initiate Bulk Bank Transfers' }
          ],
        },
        {
          value: 'virtual_accounts',
          label: 'Virtual Accounts',
          children: [
              { value: 'virtual_account_details', label: 'Virtual Account Details' },
              { value: 'manage_virtual_account', label: 'Manage Virtual Account' },
              { value: 'received_va_transactions', label: 'Received - VA Transactions' },
              { value: 'manage_received_va_transactions', label: 'Manage Received - VA Transactions' }
          ],
        },
        {
          value: 'upi',
          label: 'UPI',
          children: [
              { value: 'upi_details', label: 'UPI Details' },
              { value: 'manage_upi', label: 'Manage UPI' },
              { value: 'upi_transactions', label: 'Received - UPI Transactions' }
          ],
        },
        {
            value: 'upi_collections',
            label: 'UPI Collections',
            children: [
                { value: 'upi_collection_details', label: 'UPI Collection Details' },
                { value: 'manage_upi_collection', label: 'Manage UPI Collections' },
                { value: 'upi_collection_transactions', label: 'UPI Collection Transactions' },
                { value: 'manage_upi_collection_transactions', label: 'Manage UPI Collection Transactions' }
            ],
        },
        {
            value: 'bank_upi_verify',
            label: 'Bank & UPI Verification',
            children: [
                { value: 'verify_bank_account', label: 'Verify Bank Account Transactions' },
                { value: 'initiate_bank_verify', label: 'Initiate Bank Verifications' },
                { value: 'verify_upi_transactions', label: 'Verify UPI Transactions' },
                { value: 'initiate_upi_verify', label: 'Initiate UPI Verifications' }
            ],
        },
      ]
};

export function users_list(state = initialState, action) {
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
        case userConstants.ROLE_DETAILS:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
}