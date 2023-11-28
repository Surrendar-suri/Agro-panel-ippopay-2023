
import { ToastContainer, toast } from "react-toastify";
import ApiCall from "../../helpers/apicall";
import { toastSuccess, toastError, Toaster } from '../../helpers/Utils';

export const LOGIN_STARTS = "LOGIN_STARTS";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGOUT_USER = "LOGOUT_USER";
export const FORGOT_PASSWORD = "FORGOT_PASSWORD";
export const ERROR_FORGOT_PASSWORD = "ERROR_FORGOT_PASSWORD";
export const RESET_PASSWORD = "RESET_PASSWORD";
export const ERROR_RESET_PASSWORD = "ERROR_RESET_PASSWORD";

<div>
    <Toaster />
</div>

export const loginInitiate = (data, cb) => {
    return (dispatch, getState) => {
       
        ApiCall.post('merchant/auth/signin', data, (response) => {
            handleResponse(response, dispatch, cb, LOGIN_SUCCESS, LOGIN_FAIL);
        });
    };
};

export const forgotPassword = (data, cb) => {
    return (dispatch, getState) => {
        ApiCall.post("merchant/auth/forgot-password/request", data, (response) => {
            handleResponse(response, dispatch, cb, FORGOT_PASSWORD, ERROR_FORGOT_PASSWORD);
        })
    }
}

export const ResetPassword = (data, cb) => {
    return (dispatch, getState) => {
        ApiCall.post('merchant/auth/forgot-password/reset', data, (response) => {
            handleResponse(response, dispatch, cb, RESET_PASSWORD, ERROR_RESET_PASSWORD);
        })
    }
}

const handleResponse = (response, dispatch, cb, sType, fType) => {
    if (response.success) {
        toastSuccess(response.message);
        dispatch({ type: sType, data: response.data })
        if (response.data) {
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