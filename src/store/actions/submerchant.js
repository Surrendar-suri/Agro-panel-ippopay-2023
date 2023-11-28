
import ApiCall from "../../helpers/apicall";
import { toastSuccess, toastError, Toaster } from '../../helpers/Utils';

export const SUBMERCHANT_STARTS = "SUBMERCHANT_STARTS";
export const SUBMERCHANT_SUCCESS = "SUBMERCHANT_SUCCESS";
export const SUBMERCHANT_FAIL = "SUBMERCHANT_FAIL";
export const ADD_SUBMERCHANT = "ADD_SUBMERCHANT";

<div>
   <Toaster />
</div>

export const submerchantCreate = (data, cb) => {
    return (dispatch) => {
        dispatch({ type: SUBMERCHANT_STARTS });
        ApiCall.post("merchant/sub/create", data, (response) => {
            handleResponse(response, dispatch, cb, SUBMERCHANT_SUCCESS, SUBMERCHANT_FAIL)
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