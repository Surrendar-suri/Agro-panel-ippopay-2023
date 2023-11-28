import Apicall from "../../helpers/apicall";
import { toastError, Toaster, toastSuccess} from "../../helpers/Utils";

export const FETCH_TAXLIST_SUCCESS = "FETCH_TAXLIST_SUCCESS";
export const FETCH_TAXLIST_FAIL = "FETCH_TAXLIST_FAIL";
export const CREATE_TAXES_SUCCESS = "CREATE_TAXES_SUCCESS";
export const CREATE_TAXES_FAIL = "CREATE_TAXES_FAIL";

export const UPDATE_TAX_SUCCESS = "UPDATE_TAX_SUCCESS";
export const UPDATE_TAX_FAIL = "UPDATE_TAX_FAIL";

<div>
    <Toaster />
</div>

export const taxList =(query,cb)=>{
    return(dispatch, getState)=>{
        Apicall.get(`properties/tax/list`+query,(response)=>{
            handleResponse(response, dispatch, cb,FETCH_TAXLIST_SUCCESS,FETCH_TAXLIST_FAIL)
        })
    }
}

export const createTax =(data, cb)=>{
    return (dispatch)=>{
        Apicall.post(`properties/tax/create`,data,(response)=>{
            handleResponses(response, dispatch, cb,CREATE_TAXES_SUCCESS,CREATE_TAXES_FAIL)
        })
    }
}



export const updateTax =(data,tax_id, cb)=>{
    return (dispatch)=>{
        Apicall.patch(`properties/tax/update/${tax_id}`,data,(response)=>{
            handleResponses(response, dispatch, cb,UPDATE_TAX_SUCCESS,UPDATE_TAX_FAIL)
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
        dispatch({ type: sType, data: response.data});
        toastSuccess(response.message);
        if(response.data){
            cb(response.data);
        }else {
            cb(response.data);
        }
    }else {
        dispatch({ type: fType });
        toastError(response.message);
        cb(null);
    }
}