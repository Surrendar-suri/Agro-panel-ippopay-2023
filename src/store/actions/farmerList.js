
import ApiCall from "../../helpers/apicall";
import { toastSuccess, toastError, Toaster } from '../../helpers/Utils';

export const FETCH_FARMER_LIST = "FETCH_FARMER_LIST";
export const SUCCESS_FETCH_FARMER = "SUCCESS_FETCH_FARMER";
export const ERROR_FETCH_FARMER = "ERROR_FETCH_FARMER";
export const FETCH_FARMER_DETAILS = "FETCH_FARMER_DETAILS";
export const ERROR_FARMER_DETAILS = "ERROR_FARMER_DETAILS";
export const REMOVE_FARMER_LIST = "REMOVE_FARMER_LIST";
export const ADHAAR_INITIATE_SUCCESS = "ADHAAR_INITIATE_SUCCESS";
export const ADHAAR_INITIATE_FAIL = "ADHAAR_INITIATE_FAIL";
export const ADHAAR_CAPTCHA_SUCCESS = "ADHAAR_CAPTCHA_SUCCESS";
export const ADHAAR_CAPTCHA_FAIL = "ADHAAR_CAPTCHA_FAIL";
export const ADHAAR_PHONENUMBER_SUCCESS = "ADHAAR_PHONENUMBER_SUCCESS";
export const ADHAAR_PHONENUMBER_FAIL = "ADHAAR_PHONENUMBER_FAIL";
export const PAN_CARD_VERIFY_SUCCESS ="PAN_CARD_VERIFY_SUCCESS";
export const PAN_CARD_VERIFY_FAIL = "PAN_CARD_VERIFY_FAIL";
export const BANK_VERIFY_SUCCESS ="BANK_VERIFY_SUCCESS";
export const BANK_VERIFY_FAIL = "BANK_VERIFY_FAIL";


export const FARMER_REGISTER_SUCCESS = "FARMER_REGISTER_SUCCESS";
export const FARMER_REGISTER_FAIL = "FARMER_REGISTER_FAIL";

export const SUCCESS_FARMER_UPDATE = "SUCCESS_FARMER_UPDATE";
export const FAIL_FARMER_UPDATE = "FAIL_FARMER_UPDATE";
export const ACTIVE_STATUS_SUCCESS = "ACTIVE_STATUS_SUCCESS";
export const ADHAAR_STATUS_FAIL = "ADHAAR_STATUS_FAIL";
export const SUSPEND_STATUS_SUCCESS = "SUSPEND_STATUS_SUCCESS";
export const SUSPEND_STATUS_FAIL = "ASUSPEND_STATUS_FAIL";
export const FARMER_UPDATE_SUCCESS = "FARMER_UPDATE_SUCCESS";
export const FARMER_UPDATE_FAIL = "FARMER_UPDATE_FAIL";
export const FARMER_ACTIVE_SUCCESS = "FARMER_ACTIVE_SUCCESS";
export const FARMER_ACTIVE_FAIL = "FARMER_ACTIVE_FAIL";
export const SUCCESS_FETCH_FARMERDASHBOARD = "SUCCESS_FETCH_FARMERDASHBOARD";
export const ERROR_FETCH_FARMERDASHBOARD = "ERROR_FETCH_FARMERDASHBOARD";


<div>
  <Toaster />
</div>



export const farmerList = (query,cb) => {
    return (dispatch, getState) => {
        dispatch({ type: FETCH_FARMER_LIST });
        ApiCall.get(`farmer/list/`+ query, (response) => {
            handleResponse(response, dispatch, cb, SUCCESS_FETCH_FARMER, ERROR_FETCH_FARMER);
        })
    }
}
export const farmerDashboard = (cb) => {
    return (dispatch, getState) => {
        ApiCall.get(`farmer/farmer-dashboard`, (response) => {
            handleResponse(response, dispatch, cb, SUCCESS_FETCH_FARMERDASHBOARD, ERROR_FETCH_FARMERDASHBOARD);
        })
    }
}

export const farmerActiveList = (cb) => {
    return (dispatch) => {
        ApiCall.get(`farmer/get-list`, (response) => {
            handleResponse(response, dispatch, cb, FARMER_ACTIVE_SUCCESS, FARMER_ACTIVE_FAIL);
        })
    }
}

export const farmersAdhaarInitiate= (cb) => {
    return (dispatch) => {
        ApiCall.get("farmer/aadhar-initiate", (response) => {
            handleResponse(response, dispatch, cb, ADHAAR_INITIATE_SUCCESS, ADHAAR_INITIATE_FAIL)
        })
    }
}

export const farmerDetail = (farmer_id, cb) => {
    return (dispatch, getState) => {
        ApiCall.get(`farmer/profile/${farmer_id}`, (response) => {

            handleResponse(response, dispatch, cb, FETCH_FARMER_DETAILS, ERROR_FARMER_DETAILS);
        })
    }
}

export const farmerRegister = (data, cb) => {
    return (dispatch) => {
       
        ApiCall.post("farmer/signup", data, (response) => {
            handleResponses(response, dispatch, cb, FARMER_REGISTER_SUCCESS, FARMER_REGISTER_FAIL)
        })
    }
}

export const farmersAdhaarPhoneNumber = (data,cb) =>{
    return (dispatch) =>{
        ApiCall.post("farmer/aadhar-verify",data,(response) =>{
            handleResponsePhone(response,dispatch,cb,ADHAAR_PHONENUMBER_SUCCESS,ADHAAR_PHONENUMBER_FAIL)
        })
    }
}
export const farmersAdhaarCaptcha = (data,cb) =>{
    return (dispatch) =>{
        ApiCall.post("farmer/aadhar-captcha",data,(response) =>{
            handleResponses(response,dispatch,cb,ADHAAR_CAPTCHA_SUCCESS,ADHAAR_CAPTCHA_FAIL)
        })
    }
}


// phone verify
export const farmerPhoneVerify = (data, cb) => {
    return (dispatch) => {
       
        ApiCall.post("farmer/auth/verify", data, (response) => {
            handleResponsePhone(response, dispatch, cb, FARMER_REGISTER_SUCCESS, FARMER_REGISTER_FAIL)
        })
    }
}

export const farmerPanverify =(query,data,cb,)=>{
    return (dispatch)=>{
        ApiCall.post("farmer/pan-verify"+query,data,(response) =>{
            handleResponsePhone(response,dispatch,cb,PAN_CARD_VERIFY_SUCCESS,PAN_CARD_VERIFY_FAIL)
        })
    }
}
export const farmerBankverify =(id,data,cb)=>{
    return (dispatch) =>{
        ApiCall.post(`farmer/bank-verify/${id}`,data,(response)=>{
            handleResponses(response,dispatch,cb,BANK_VERIFY_SUCCESS,BANK_VERIFY_FAIL)
        })
    }
}

export const activeStatus =(id,data,cb)=>{
    return (dispatch) =>{
        ApiCall.patch(`farmer/update/status/${id}`,data,(response)=>{
            handleResponses(response,dispatch,cb,ACTIVE_STATUS_SUCCESS,ADHAAR_STATUS_FAIL)
        })
    }
}
export const suspendStatus =(id,data,cb)=>{
    return (dispatch) =>{
        ApiCall.patch(`farmer/update/status/suspend/${id}`,data,(response)=>{
            handleResponses(response,dispatch,cb,SUSPEND_STATUS_SUCCESS,SUSPEND_STATUS_FAIL)
        })
    }
}

export const farmerUpdate =(id,data,cb)=>{
    return (dispatch) =>{
        ApiCall.patch(`farmer/update/${id}`,data,(response)=>{
            handleResponses(response,dispatch,cb,FARMER_UPDATE_SUCCESS,FARMER_UPDATE_FAIL)
        })
    }
}
export const removeFarmerList = () => {
    return (dispatch) => {
        dispatch({ type: REMOVE_FARMER_LIST })
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