
import ApiCall from "../../helpers/apicall";
import { toastSuccess, toastError, Toaster } from '../../helpers/Utils';

export const FETCH_PROFILE = "FETCH_PROFILE";
export const SUCCESS_FETCH_PROFILE = "SUCCESS_FETCH_PROFILE";
export const ERROR_FETCH_PROFILE = "ERROR_FETCH_PROFILE";
export const REMOVE_PROFILE = "REMOVE_PROFILE";
export const UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS";
export const UPDATE_PROFILE_FAILED = "UPDATE_PROFILE_FAILED";
export const UPLOAD_PROFILE_SUCCESS = "UPLOAD_PROFILE_SUCCESS";
export const UPLOAD_PROFILE_FAILED = "UPLOAD_PROFILE_FAILED";


<div>
   <Toaster />
</div>
export const myprofile = (cb) => {
    return (dispatch, getState) => {
        
        ApiCall.get(`merchant/profile`, (response) => {
            handleResponse(response, dispatch, cb, SUCCESS_FETCH_PROFILE, ERROR_FETCH_PROFILE);
        })
    }
}

export const addProfile =(data,cb)=>{
    return (dispatch, getState) => {
        
        ApiCall.patch(`merchant/update-merchant`,data, (response) => {
            handleProfileResponse(response, dispatch, cb, UPDATE_PROFILE_SUCCESS, UPDATE_PROFILE_FAILED);
        })
    }
}

export const UploadProfile=(id,upload_for,data,cb)=>{
    return (dispatch)=>{
        ApiCall.post(`merchant/upload/logo?id=${id}&upload_from=open/agri&upload_for=${upload_for}`,data,(response)=>{
            handleProfileResponses(response, dispatch, cb, UPLOAD_PROFILE_SUCCESS, UPLOAD_PROFILE_FAILED);

        })
    }
}
export const removeProfileList =()=>{
    return (dispatch) =>{
        dispatch({type:REMOVE_PROFILE})
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

const handleProfileResponses = (response, dispatch, cb, sType, fType) => {
    if (response.success) {
        setTimeout(() => {
            toastSuccess(response.message);
        }, 4000);
        
        dispatch({ type: sType, data: response })
        cb(response)
    } else {
        dispatch({ type: fType });
        toastError(response.message);
        cb(null)
    }
}
const handleProfileResponse = (response, dispatch, cb, sType, fType) => {
    if (response.success) {
        
        toastSuccess(response.message);
        dispatch({ type: sType, data: response })
        cb(response)
    } else {
        dispatch({ type: fType });
        toastError(response.message);
        cb(null)
    }
}