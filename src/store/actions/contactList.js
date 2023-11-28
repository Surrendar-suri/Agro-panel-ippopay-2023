
import ApiCall from "../../helpers/apicall";
import { toastSuccess, toastError, Toaster } from '../../helpers/Utils';

export const SUCCESS_FETCH_CONTACT = "SUCCESS_FETCH_CONTACT";
export const FAIL_CONTACT_LIST = "FAIL_CONTACT_LIST";
export const SUCCESS_ADD_CONTACT = "SUCCESS_ADD_CONTACT";
export const FAIL_ADD_LIST = "FAIL_ADD_LIST";
export const FETCH_CONTACT_DETAILS = "FETCH_CONTACT_DETAILS";
export const ERROR_CONTACT_DETAILS = "ERROR_CONTACT_DETAILS";
export const ACTIVE_STATUS_SUCCESS = "ACTIVE_STATUS_SUCCESS";
export const ACTIVE_STATUS_FAIL = "ACTIVE_STATUS_FAIL";



<div>
  <Toaster />
</div>




export const contactsList = (query,cb) => {
    return (dispatch, getState) => {
      
        ApiCall.get(`merchant/list-contact`+ query, (response) => {
            handleResponse(response, dispatch, cb, SUCCESS_FETCH_CONTACT, FAIL_CONTACT_LIST);
        })
    }
}
export const statusChange =(id,data,cb)=>{
    return (dispatch) =>{
        ApiCall.patch(`payout/update/status/${id}`,data,(response)=>{
            handleResponses(response,dispatch,cb,ACTIVE_STATUS_SUCCESS,ACTIVE_STATUS_FAIL)
        })
    }
}


export const contactDetail = (contact_id, cb) => {
    return (dispatch, getState) => {
        ApiCall.get(`merchant/contact/details/${contact_id}`, (response) => {

            handleResponse(response, dispatch, cb, FETCH_CONTACT_DETAILS, ERROR_CONTACT_DETAILS);
        })
    }
}

export const addContact = (data, cb) => {
    return (dispatch) => {
       
        ApiCall.post("merchant/add-contact", data, (response) => {
            handleResponses(response, dispatch, cb, SUCCESS_ADD_CONTACT, FAIL_ADD_LIST)
        })
    }
}


const handleResponsePhone = (response, dispatch, cb, sType, fType) => {
    if (response.success) {
        toastSuccess(response.message);
        dispatch({ type: sType, data: response})
        cb(response)
    } else {
        dispatch({ type: fType });
        toastError(response.message);
        cb(null)
    }
}

const handleResponses = (response, dispatch, cb, sType, fType) => {
    if (response.success) {
        if (response.data) {
            toastSuccess(response.message);
            dispatch({ type: sType, data: response.data })
            cb(response.data);
        } else {
            cb(response)
        }
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