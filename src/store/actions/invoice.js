import Apicall from "../../helpers/apicall";
import { toastError, Toaster, toastSuccess} from "../../helpers/Utils";
export const SUCCESS_INVOICE_LIST = "SUCCESS_INVOICE_LIST";
export const SUCCESS_INVOICEDUE_LIST = "SUCCESS_INVOICEDUE_LIST";
export const ERROR_INVOICE_LIST = "ERROR_INVOICE_LIST";
export const ERROR_INVOICEDUE_LIST = "ERROR_INVOICEDUE_LIST";
export const FETCH_INVOICE_DETAILS ="FETCH_INVOICE_DETAILS";
export const FETCH_INVOICEOPEN_DETAILS ="FETCH_INVOICE_DETAILS";
export const FETCH_INVOICE_DETAILS_FAIL ="FETCH_INVOICE_DETAILS_FAIL";
export const FETCH_INVOICEOPEN_DETAILS_FAIL ="FETCH_INVOICE_DETAILS_FAIL";

export const CREATE_INVOICE_SUCCESS = "CREATE_INVOICE";
export const CREATE_INVOICE_FAIL = "CREATE_INVOICE_FAIL";
export const UPDATE_INVOICE_SUCCESS = "UPDATE_INVOICE_SUCCESS";
export const UPDATE_INVOICE_FAIL = "UPDATE_INVOICE_FAIL";
export const REMOVE_INVOICE_LIST = "REMOVE_INVOICE_LIST";
export const SUCCESS_INVOICE_DASHBOARD = "SUCCESS_INVOICE_DASHBOARD";
export const SUCCESS_INVOICEDUE_DASHBOARD = "SUCCESS_INVOICEDUE_DASHBOARD";
export const DOWNLOAD_SUCCESS = "DOWNLOAD_SUCCESS";
export const DOWNLOAD_FAIL= "DOWNLOAD_FAIL";
export const SENDINVOICE_SUCCESS = "SENDINVOICE_SUCCESS";
export const SENDINVOICE_FAIL= "SENDINVOICE_FAIL";

<div>
   <Toaster />
</div>

export const invoiceList = (query,cb) =>{
    return (dispatch, getState)=> {
        Apicall.get(`invoice/list`+query,(response)=>{
            handleResponse(response, dispatch, cb,SUCCESS_INVOICE_LIST,ERROR_INVOICE_LIST);
        })
    }
}
export const invoicedueList = (query,cb) =>{
    return (dispatch, getState)=> {
        Apicall.get(`invoice/due-invoice`+query,(response)=>{
            handleResponse(response, dispatch, cb,SUCCESS_INVOICEDUE_LIST,ERROR_INVOICEDUE_LIST);
        })
    }
}

export const invoiceDetails = (id,cb) =>{
    return(dispatch)=>{
         Apicall.get(`invoice/detail/${id}`,(response) =>{
             handleResponse(response,dispatch,cb,FETCH_INVOICE_DETAILS,FETCH_INVOICE_DETAILS_FAIL)
         })
    }
}

export const invoiceDowload = (id,cb) =>{
    return(dispatch)=>{
         Apicall.get(`invoice/open/view/pdf/${id}`,(response) =>{
             handleResponses(response,dispatch,cb,DOWNLOAD_SUCCESS,DOWNLOAD_FAIL)
         })
    }
}

export const updateSendInvoice = (id,data,cb) =>{
    return (dispatch) => {
        Apicall.patch(`invoice/send/${id}`,data,(response)=>{
            handleResponses(response, dispatch, cb,SENDINVOICE_SUCCESS,SENDINVOICE_SUCCESS)
        })
    }
}

// invoice/send/inv_baDzXkQ6I
export const invoiceOpenDetails = (id,cb) =>{
    return(dispatch)=>{
         Apicall.get(`invoice/open/detail/${id}`,(response) =>{
             handleResponse(response,dispatch,cb,FETCH_INVOICEOPEN_DETAILS,FETCH_INVOICEOPEN_DETAILS_FAIL)
         })
    }
}

export const createInvoice = (data,cb) => {
    return (dispatch) => {
        Apicall.post(`invoice/create`,data,(response)=>{
            handleResponses(response,dispatch,cb,CREATE_INVOICE_SUCCESS,CREATE_INVOICE_FAIL)
        })
    }
}

export const invoiceDashboard = (query,cb) => {
     return (dispatch) => {
        Apicall.get(`invoice/dashboard`+ query,(response) =>{
            handleResponse(response,dispatch,cb,SUCCESS_INVOICE_DASHBOARD)
        })
     }
}
export const invoicedueDashboard = (query,cb) => {
    return (dispatch) => {
       Apicall.get(`invoice/due-dashboard`+ query,(response) =>{
           handleResponse(response,dispatch,cb,SUCCESS_INVOICEDUE_DASHBOARD)
       })
    }
}

export const updateInvoice = (data,id,cb) =>{
    return (dispatch) => {
        Apicall.patch(`invoice/update/${id}`,data,(response)=>{
            handleResponses(response, dispatch, cb,UPDATE_INVOICE_SUCCESS,UPDATE_INVOICE_FAIL)
        })
    }
}

export const removeInvoiceList=()=>{
    return (dispatch)=>{
        dispatch({ type:REMOVE_INVOICE_LIST})
    }
}
const handleResponses = (response, dispatch, cb, sType, fType) => {
    if(response.success){
        toastSuccess(response.message);
        dispatch({type:sType,data:response.data})
        if(response.data){
            cb(response.data);
        }else{
            cb(response);
        }
    }else{
        toastError(response.message);
        dispatch({ type: fType });
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