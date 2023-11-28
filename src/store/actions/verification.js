
import ApiCall from "../../helpers/apicall";
import { toastSuccess, toastError, Toaster } from '../../helpers/Utils';

export const VERIFICATION_ = "VERIFICATION_";
export const VERIFICATION_SUCCESS = "VERIFICATION_SUCCESS";
export const VERIFICATION_FAIL = "VERIFICATION_FAIL";
export const RESENDEMAIL_OTP = "RESENDEMAIL_OTP";
export const RESENDEMAIL_OTP_FAIL = "RESENDEMAIL_OTP_FAIL";
export const RESENDPHONE_OTP = "RESENDPHONE_OTP";
export const RESENDPHONE_OTP_FAIL = "RESENDPHONE_OTP_FAIL";

<div>
    <Toaster />
</div>
export const verification = (data, cb) => {
    return (dispatch, getState) => {

        dispatch({ type: VERIFICATION_ })
        ApiCall.post('merchant/auth/verify', data, (response) => {
            handleResponse(response, dispatch, cb, VERIFICATION_SUCCESS, VERIFICATION_FAIL);

        });

    };
};

export const emailOtp = (data, cb) => {
    return (dispatch, getState) => {

        ApiCall.post("merchant/auth/resend/email", data, (response) => {
            handleResponse(response, dispatch, cb, RESENDEMAIL_OTP, RESENDEMAIL_OTP_FAIL);
        })
    }
}

export const phoneOtp = (data, cb) => {
    return (dispatch, getState) => {

        ApiCall.post("merchant/auth/resend/sms", data, (response) => {
            handleResponse(response, dispatch, cb, RESENDPHONE_OTP, RESENDPHONE_OTP_FAIL);
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
            cb(response);
        }

    } else {
        dispatch({ type: fType });
        toastError(response.message);
        cb(null)
    }
}