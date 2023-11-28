
import ApiCall from "../../helpers/apicall";
import { toastError, Toaster, toastSuccess} from "../../helpers/Utils";

export const FETCH_BUSINESS_LIST = "FETCH_BUSINESS_LIST";
export const SUCCESS_FETCH_BUSINESS = "SUCCESS_FETCH_BUSINESS";
export const ERROR_FETCH_BUSINESS = "ERROR_FETCH_BUSINESS";
export const FETCH_BUSSINESS_DETAILS = "FETCH_BUSSINESS_DETAILS";
export const ERROR_BUSSINESS_DETAILS = "ERROR_BUSSINESS_DETAILS";
export const BUSINESS_REGISTER_SUCCESS = "BUSINESS_REGISTER_SUCCESS";
export const BUSINESS_REGISTER_FAIL = "BUSINESS_REGISTER_FAIL";
export const REMOVE_BUSINESS_LIST= "REMOVE_BUSINESS_LIST";
export const PHONENUMBER_VERIFY_SUCCESS = "PHONENUMBER_VERIFY_SUCCESS";
export const PHONENUMBER_VERIFY_FAIL = "PHONENUMBER_VERIFY_FAIL";
export const ADHAAR_INITIATE_SUCCESS = "ADHAAR_INITIATE_SUCCESS";
export const ADHAAR_INITIATE_FAIL = "ADHAAR_INITIATE_FAIL";
export const GST_NUMBER_VERIFY_SUCCESS ="GST_NUMBER_VERIFY_SUCCESS";
export const GST_NUMBER_VERIFY_FAIL ="GST_NUMBER_VERIFY_FAIL";
export const PAN_CARD_VERIFY_SUCCESS ="PAN_CARD_VERIFY_SUCCESS";
export const PAN_CARD_VERIFY_FAIL = "PAN_CARD_VERIFY_FAIL";
export const ADHAAR_CAPTCHA_SUCCESS = "ADHAAR_CAPTCHA_SUCCESS";
export const ADHAAR_CAPTCHA_FAIL = "ADHAAR_CAPTCHA_FAIL";
export const ADHAAR_PHONENUMBER_SUCCESS = "ADHAAR_PHONENUMBER_SUCCESS";
export const ADHAAR_PHONENUMBER_FAIL = "ADHAAR_PHONENUMBER_FAIL";
export const ACTIVE_STATUS_SUCCESS = "ACTIVE_STATUS_SUCCESS";
export const ADHAAR_STATUS_FAIL = "ADHAAR_STATUS_FAIL";
export const SUSPEND_STATUS_SUCCESS = "SUSPEND_STATUS_SUCCESS";
export const SUSPEND_STATUS_FAIL = "ASUSPEND_STATUS_FAIL";
export const BUSINESS_UPDATE_SUCCESS = "BUSINESS_UPDATE_SUCCESS";
export const BUSINESS_UPDATE_FAIL = "BUSINESS_UPDATE_FAIL";
export const BUSINESS_ACTIVE_SUCCESS = "BUSINESS_ACTIVE_SUCCESS";
export const BUSINESS_ACTIVE_FAIL = "BUSINESS_ACTIVE_FAIL";

export const BUSINESS_DASHBOARD_SUCCESS = "BUSINESS_DASHBOARD_SUCCESS";
export const BUSINESS_DASHBOARD_FAIL = "BUSINESS_DASHBOARD_FAIL";

export const SUCCESS_FETCH_BUSINESSDASHBOARD = "SUCCESS_FETCH_BUSINESSDASHBOARD";
export const ERROR_FETCH_BUSINESSDASHBOARD = "ERROR_FETCH_BUSINESSDASHBOARD";
<div>
   <Toaster />
</div>

export const businessList = (query,cb) => {
    return (dispatch, getState) => {
        dispatch({ type: FETCH_BUSINESS_LIST });
        ApiCall.get(`business/list`+ query, (response) => {
            handleResponse(response, dispatch, cb, SUCCESS_FETCH_BUSINESS, ERROR_FETCH_BUSINESS);
        })
    }
}
export const businesDashboard = (cb) => {
    return (dispatch, getState) => {
        ApiCall.get(`business/business-dashboard`, (response) => {
            handleResponse(response, dispatch, cb, SUCCESS_FETCH_BUSINESSDASHBOARD, ERROR_FETCH_BUSINESSDASHBOARD);
        })
    }
}

export const businessDashboard = (cb) => {
    return (dispatch, getState) => {
        ApiCall.get(`business/business-dashboard`, (response) => {
            handleResponse(response, dispatch, cb, BUSINESS_DASHBOARD_SUCCESS, BUSINESS_DASHBOARD_FAIL);
        })
    }
}

export const businessActiveList = (cb) => {
    return (dispatch) => {
        
        ApiCall.get(`business/get-list`, (response) => {
            handleResponse(response, dispatch, cb, BUSINESS_ACTIVE_SUCCESS, BUSINESS_ACTIVE_FAIL);
        })
    }
}

export const bussinessDetails = (business_id, cb) => {
    return (dispatch, getState) => {
        ApiCall.get(`business/profile/${business_id}`, (response) => {
            handleResponse(response, dispatch, cb, FETCH_BUSSINESS_DETAILS, ERROR_BUSSINESS_DETAILS);
        })
    }
}

export const businessRegister = (data, cb) => {
    return (dispatch) => {
        ApiCall.post("business/signup", data, (response) => {
            handleResponses(response, dispatch, cb, BUSINESS_REGISTER_SUCCESS, BUSINESS_REGISTER_FAIL)
        })
    }
}

export const businessAdhaarInitiate= (cb) => {
    return (dispatch) => {
        ApiCall.get("business/aadhar-initiate", (response) => {
            handleResponse(response, dispatch, cb, ADHAAR_INITIATE_SUCCESS, ADHAAR_INITIATE_FAIL)
        })
    }
}

export const businessPhonenumber = (data, cb) => {
    return (dispatch) => {
        ApiCall.post("business/auth/verify", data, (response) => {
            handleResponsePhone(response, dispatch, cb, PHONENUMBER_VERIFY_SUCCESS, PHONENUMBER_VERIFY_FAIL)
        })
    }
}

export const businessGSTverify =(data,cb)=>{
    return (dispatch)=>{
        ApiCall.post("business/gst-verify",data,(response) =>{
            handleResponsePhone(response,dispatch,cb,GST_NUMBER_VERIFY_SUCCESS,GST_NUMBER_VERIFY_FAIL)
        })
    }
}
export const businessPanverify =(query,data,cb,)=>{
    return (dispatch)=>{
        ApiCall.post("business/pan-verify"+query,data,(response) =>{
            handleResponsePhone(response,dispatch,cb,PAN_CARD_VERIFY_SUCCESS,PAN_CARD_VERIFY_FAIL)
        })
    }
}

export const businessAdhaarCaptcha = (data,cb) =>{
    return (dispatch) =>{
        ApiCall.post("business/aadhar-captcha",data,(response) =>{
            handleResponses(response,dispatch,cb,ADHAAR_CAPTCHA_SUCCESS,ADHAAR_CAPTCHA_FAIL)
        })
    }
}

export const businessAdhaarPhoneNumber = (data,cb) =>{
    return (dispatch) =>{
        ApiCall.post("business/aadhar-verify",data,(response) =>{
            handleResponsePhone(response,dispatch,cb,ADHAAR_PHONENUMBER_SUCCESS,ADHAAR_PHONENUMBER_FAIL)
        })
    }
}

export const activeStatus =(id,data,cb)=>{
    return (dispatch) =>{
        ApiCall.patch(`business/update/status/${id}`,data,(response)=>{
            handleResponses(response,dispatch,cb,ACTIVE_STATUS_SUCCESS,ADHAAR_STATUS_FAIL)
        })
    }
}

export const businessUpdate =(id,data,cb)=>{
    return (dispatch) =>{
        ApiCall.patch(`business/update/${id}`,data,(response)=>{
            handleResponses(response,dispatch,cb,BUSINESS_UPDATE_SUCCESS,BUSINESS_UPDATE_FAIL)
        })
    }
}
export const suspendStatus =(id,data,cb)=>{
    return (dispatch) =>{
        ApiCall.patch(`business/update/status/suspend/${id}`,data,(response)=>{
            handleResponses(response,dispatch,cb,SUSPEND_STATUS_SUCCESS,SUSPEND_STATUS_FAIL)
        })
    }
}
export const removeBusinessList = () => {
    return (dispatch) => {
        dispatch({ type: REMOVE_BUSINESS_LIST })
    }
}

const handleResponses = (response, dispatch, cb, sType, fType) => {
    if (response.success) {
        
        if (response.data) {
            toastSuccess(response.message);
            dispatch({ type: sType, data: response.data })
            cb(response.data)
            
        } else {
           
            cb(response)
        }
    } else {
        dispatch({ type: fType });
        toastError(response.message);
        cb(null)
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