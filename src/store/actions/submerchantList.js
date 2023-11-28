
import ApiCall from "../../helpers/apicall";
import { toastSuccess, toastError, Toaster } from '../../helpers/Utils';
export const START_MERCHANT_LIST = "START_MERCHANT_LIST";
export const SUCCESS_MERCHANT_LIST = "SUCCESS_MERCHANT_LIST";
export const ERROR_MERCHANT_LIST = "ERROR_MERCHANT_LIST";

export const SUBMERCHANT_SUCCESS = "SUBMERCHANT_SUCCESS";
export const SUBMERCHANT_FAIL = "SUBMERCHANT_FAIL";

export const SUCCESS_SUBMERCHANT_DETAILS = "SUCCESS_SUBMERCHANT_DETAILS";
export const ERROR_SUBMERCHANT_DETAILS = "ERROR_SUBMERCHANT_DETAILS";

export const SUCCESS_SUBMERCHANT_UPDATE = "SUCCESS_SUBMERCHANT_UPDATE";
export const FAIL_SUBMERCHANT_UPDATE = "FAIL_SUBMERCHANT_UPDATE";
<div>
   <Toaster />
</div>


export const merchantList = (query,cb) => {
    return (dispatch, getState) => {
     
        ApiCall.get(`merchant/sub/list`+query, (response) => {
            handleResponse(response, dispatch, cb, SUCCESS_MERCHANT_LIST, ERROR_MERCHANT_LIST);
        })
    }
}



export const submerchantCreate = (data, cb) => {
    return (dispatch) => {
      
        ApiCall.post("merchant/sub/create", data, (response) => {
            handleResponses(response, dispatch, cb, SUBMERCHANT_SUCCESS, SUBMERCHANT_FAIL)
        })
    }
}

export const submerchantDetail = (submerchant_id, cb) => {
    return (dispatch, getState) => {
        ApiCall.get(`merchant/sub/profile/${submerchant_id}`, (response) => {

            handleResponse(response,dispatch, cb, SUCCESS_SUBMERCHANT_DETAILS, ERROR_SUBMERCHANT_DETAILS);
        })
    }
}

export const submerchantUpdate =(submerchant_id,data, cb)=>{
      return (dispatch, getState) => {
        ApiCall.patch(`merchant/sub/update/${submerchant_id}`,data,(response)=>{
            handleResponses(response,dispatch, cb,SUCCESS_SUBMERCHANT_UPDATE,FAIL_SUBMERCHANT_UPDATE)
        })
      }
}

const handleResponses = (response, dispatch, cb, sType, fType) => {
    if (response.success) {
        toastSuccess(response.message);
        dispatch({ type: sType, data: response.data })
        cb(response.data)
    } else {
        dispatch({ type: fType });
        toastError(response.message);
        cb(null)
    }
}
const handleResponse = (response, dispatch, cb, sType, fType) => {
    if (response.success) {
        dispatch({ type: sType, data: response.data })
        if (response.data) {
            cb(response.data);
        } else {
            cb(response)
        }

    } else {
        dispatch({ type: fType });
        cb(null)
    }
}