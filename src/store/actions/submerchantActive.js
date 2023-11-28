import Apicall from "../../helpers/apicall";
import { Toaster, toastError, toastSuccess } from '../../helpers/Utils';

export const SUCCESS_ACTIVATE_SUBMERCHANT = "SUCCESS_ACTIVATE_SUBMERCHANT";
export const ERROR_ACTIVATE_SUBMERCHANT = "ERROR_ACTIVATE_SUBMERCHANT";

<div>
    <Toaster />
</div>


export const submerchantActive = (submerchant_id, data, cb) => {
    return (dispatch, getState) => {
        Apicall.patch(`merchant/sub/update/status/activate/${submerchant_id}/`, data, (response) => {

            handleResponse(response, dispatch, cb, SUCCESS_ACTIVATE_SUBMERCHANT, ERROR_ACTIVATE_SUBMERCHANT);
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