import { ToastContainer, toast } from "react-toastify";
import ApiCall from "../../helpers/apicall";
import { toastSuccess, toastError, Toaster } from '../../helpers/Utils';

export const REGISTER_STARTS = "REGISTER_STARTS";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAIL = "REGISTER_FAIL";

<div>
   <Toaster />
</div>

export const registerInitiate = (data, cb) => {
    return (dispatch) => {
        dispatch({ type: REGISTER_STARTS });
        ApiCall.post("merchant/auth/signup", data, (response) => {
            handleResponse(response, dispatch, cb, REGISTER_SUCCESS, REGISTER_FAIL)
        })
    }
}

const handleResponse = (response, dispatch, cb, sType, fType) => {
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