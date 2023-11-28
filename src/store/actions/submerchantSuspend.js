import Apicall from "../../helpers/apicall";
import { Toaster, toastError, toastSuccess } from '../../helpers/Utils';

export const SUCCESS_SUSPEND_SUBMERCHANT = "SUCCESS_SUSPEND_SUBMERCHANT";
export const ERROR_SUSPEND_SUBMERCHANT = "ERROR_SUSPEND_SUBMERCHANT";

<div>
   <Toaster />
</div>


export const submerchantSuspend = (submerchant_id, data, cb) => {
    return (dispatch, getState) => {
        Apicall.patch(`merchant/sub/update/status/suspend/${submerchant_id}/`, data, (response) => {
            handleResponse(response, dispatch, cb, SUCCESS_SUSPEND_SUBMERCHANT, ERROR_SUSPEND_SUBMERCHANT);
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
        toastError(response.message);
        dispatch({ type: fType });
        cb(null)
    }
}