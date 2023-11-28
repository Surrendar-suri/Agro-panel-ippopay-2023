import {combineReducers} from "redux";
import {authentication} from "./Auth";
import {add_contact} from "./Add_Contact";
import {accounts} from "./Accounts";
import {users_list} from "./Users";
import {quick_transfer} from "./Quick_Transfer";  
import {account_statement} from "./AccountStatement"; 
import {dashboard} from "./Dashboard"; 
import {header} from "./Header"; 
import {api_details} from "./ApiKeys"; 

const rootReducer = combineReducers({
  auth : authentication,
  add_contact : add_contact,
  accounts : accounts,
  users_list:users_list,
  quick_transfer,
  account_statement,
  api_details,
  dashboard,
  header
});

export default rootReducer;
