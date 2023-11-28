import {SUCCESS_FETCH_INVOICEITEM_LIST,ERROR_FETCH_INVOICEITEM_LIST} from "../actions/invoiceItem";

const initialState = {
    user:{},
    loaded:false,
}

const invoiceItemReducer = (state = initialState, action) =>{
     switch(action.type){
         case SUCCESS_FETCH_INVOICEITEM_LIST:
             return {
                 ...state,
                 loading: false,
                 user:action.data,
             }
         case ERROR_FETCH_INVOICEITEM_LIST:
             return {
                 ...state,
                 loading: false,
             }  
         default:
             return state;
     }
}

export default invoiceItemReducer;