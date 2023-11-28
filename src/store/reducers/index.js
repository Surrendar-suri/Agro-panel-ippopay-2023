import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from './login';
import profileReducer from "./profile";
import businessListReducer from "./businessList";
import farmerListReducer from "./farmerList";
import subMerchantList from './submerchantList';
import subMerchantDetail from './submerchantDetail';
import invoiceItemReducer from './invoiceItem';
import invoice from "./invoice";
import invoicedue from "./invoicedue";
import taxList from './tax';
import taxDetail from './taxDetails'
import Transaction from './transaction';
import {add_contact} from "./Add_Contact";
import {header} from "./Header";
import {dashboard } from "./Dashboard";
import {quick_transfer} from "./Quick_Transfer";
import {account_statement} from "./AccountStatement";
const persistConfig = {
    // key:'root',
    key: 'persist-key',
    storage,
    // whitelist:['auth']
}
const store = combineReducers({
    login: authReducer,
    myprofile: profileReducer,
    business_list: businessListReducer,
 
    farmer_list: farmerListReducer,
    sub_merchant_list: subMerchantList,
    submerchant_detail: subMerchantDetail,
    invoice_item:invoiceItemReducer,
   
    invoice_list :invoice,
    invoicedue_list :invoicedue,
    tax_list :taxList,
    tax_detail:taxDetail,
    transaction_list:Transaction,
    add_contact : add_contact,
    quick_transfer:quick_transfer,
    header:header,
    dashboard:dashboard,
    account_statement:account_statement,
})

export default persistReducer(persistConfig, store);