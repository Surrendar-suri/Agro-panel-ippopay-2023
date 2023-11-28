import Apicall from "../../helpers/apicall";
import { toastError, Toaster, toastSuccess} from "../../helpers/Utils";

export const SUCCESS_FETCH_TRANSACTION_LIST = "FETCH_TRANSACTION_LIST" ;
export const FAIL_FETCH_TRANSACTION_LIST = "FAIL_FETCH_TRANSACTION_LIST" ;
export const SUCCESS_PAYMENT_RECORD = "SUCCESS_PAYMENT_RECORD";
export const ERROR_PAYMENT_RECORD = "ERROR_PAYMENT_RECORD";
export const SUCCESS_FETCH_TRANSACTION_DETAILS = "SUCCESS_FETCH_TRANSACTION_DETAILS" ;
export const FAIL_FETCH_TRANSACTION_DETAILS = "FAIL_FETCH_TRANSACTION_DETAILS" ;
export const SUCCESS_FETCH_TRANSACTION = "SUCCESS_FETCH_TRANSACTION";
export const FAIL_FETCH_TRANSACTION = "FAIL_FETCH_TRANSACTION";

<div>
    <Toaster />
</div>


export const transactionList =(query,cb)=>{
    return(dispatch, getState)=>{
        Apicall.get(`transaction/list`+ query,(response)=>{
            handleResponse(response, dispatch, cb,SUCCESS_FETCH_TRANSACTION_LIST,FAIL_FETCH_TRANSACTION_LIST)
            
        })
    }
}

export const createTransaction=(data,id,cb) => {
    return(dispatch, getState)=>{
        Apicall.patch(`transaction/invoice/record/${id}`,data ,(response)=>{
            handleResponses(response, dispatch, cb,SUCCESS_PAYMENT_RECORD,ERROR_PAYMENT_RECORD)
        })
    }
}

export const transactionDetails =(id,cb)=>{
    return(dispatch)=>{
        Apicall.get(`transaction/list/${id}`,(response)=>{
            handleResponse(response, dispatch, cb,SUCCESS_FETCH_TRANSACTION_DETAILS,FAIL_FETCH_TRANSACTION_DETAILS)
        })
    }
}

export const transactionPopUp =(id,cb)=>{
    return (dispatch)=>{
        Apicall.get(`transaction/detail/${id}`,(response)=>{
            handleResponse(response,dispatch,cb,SUCCESS_FETCH_TRANSACTION,FAIL_FETCH_TRANSACTION)
        })
    }
}
const handleResponse =(response, dispatch, cb, sType, fType)=>{
    if(response.success){
        dispatch({ type: sType, data: response.data});       
        if(response.data){
            cb(response.data);
        }else {
            cb(response.data);
        }
    }else {
        dispatch({ type: fType });
        cb(null);
    }
}

const handleResponses =(response, dispatch, cb, sType, fType)=>{
    if(response.success){
        toastSuccess(response.message);
        dispatch({ type: sType, data: response.data});       
        if(response.data){
            cb(response.data);
        }else {
            cb(response.data);
        }
    }else {
        toastError(response.message);
        dispatch({ type: fType });
        cb(null);
    }
}