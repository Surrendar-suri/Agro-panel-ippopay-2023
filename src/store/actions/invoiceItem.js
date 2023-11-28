import Apicall from "../../helpers/apicall";
import { toastError, Toaster, toastSuccess} from "../../helpers/Utils";
export const SUCCESS_FETCH_INVOICEITEM_LIST = "FETCH_INVOICEITEM_LIST";
export const ERROR_FETCH_INVOICEITEM_LIST = "ERROR_FETCH_INVOICEITEM_LIST";

export const FETCH_INVOICEITEM_DETAILS = "FETCH_INVOICEITEM_DETAILS";
export const ERROR_INVOICEITEM_DETAILS = "ERROR_INVOICEITEM_DETAILS";
export const SUCCESS_UPDATE_ITEM = "SUCCESS_UPDATE_ITEM";
export const ERROR_UPDATE_ITEM = "ERROR_UPDATE_ITEM";
export const CREATE_INVOICE_ITEM_SUCCESS = "CREATE_INVOICE_ITEM_SUCCESS";
export const CREATE_INVOICE_ITEM_ERROR = "CREATE_INVOICE_ITEM_ERROR";
<div>
    <Toaster />
</div>

export const invoiceItemList =(query,cb)=>{
    return (dispatch, getState) => {
        Apicall.get("invoice/item/list"+query,(response)=>{
            
            handleResponse(response, dispatch,cb,SUCCESS_FETCH_INVOICEITEM_LIST,ERROR_FETCH_INVOICEITEM_LIST)
        })
    }
}

export const invoiceItemDetails =(item_id,cb)=>{
    return (dispatch, getState) =>{
        Apicall.get(`invoice/item/detail/${item_id}`,(response)=>{
            handleResponse(response,dispatch,cb,FETCH_INVOICEITEM_DETAILS,ERROR_INVOICEITEM_DETAILS)
        })
    }
}

export const updateItem = (data,item_id,cb)=>{
    return (dispatch, getState) =>{
        Apicall.patch(`invoice/item/update/${item_id}`,data,(response)=>{
           
            handleResponses(response, dispatch, cb,SUCCESS_UPDATE_ITEM,ERROR_UPDATE_ITEM)
        })
    }
}


export const createInvoiceItem =(data, cb)=>{
    return(dispatch, getState)=>{
        Apicall.post("invoice/item/create",data,(response)=>{
            handleResponses(response,dispatch,cb,CREATE_INVOICE_ITEM_SUCCESS,CREATE_INVOICE_ITEM_ERROR);
        })
    }
}

const handleResponses = (response,dispatch,cb,sType, fType) =>{
    if(response.success){
        toastSuccess(response.message);
        dispatch({type:sType,data:response.data});
        if(response.data){
            cb(response.data);
        }else{
            cb(response.data);
        }
    } else{
        toastError(response.message);
        dispatch({type:fType})
        cb(null);
    }
}
const handleResponse = (response, dispatch, cb, sType, fType) => {
    if(response.success){
        dispatch({type:sType,data:response.data})
        if(response.data){
            cb(response.data);
        }else{
            cb(response);
        }
    }else{
        dispatch({ type: fType });
        cb(null);
    }
}