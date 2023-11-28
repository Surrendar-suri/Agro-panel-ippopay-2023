// import { ToastContainer, toast } from "react-toastify";
import ApiCall from "../../helpers/apicall";

import { toastSuccess, toastError, Toaster } from '../../helpers/Utils';

export const SUCCESS_CHANGE_PASSWORD = "SUCCESS_CHANGE_PASSWORD";
export const ERROR_CHANGE_PASSWORD = "ERROR_CHANGE_PASSWORD";


<div>
   <Toaster />
</div>

export const changePassword = (data, cb) => {
    return (dispatch, getState) => {
        ApiCall.patch("merchant/change-password", data, (response) => {
            handleResponse(response, dispatch, cb, SUCCESS_CHANGE_PASSWORD, ERROR_CHANGE_PASSWORD);
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