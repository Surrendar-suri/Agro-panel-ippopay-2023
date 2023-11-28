import Apicall from "../../helpers/apicall";


export const SUCCESS_SUBMERCHANT_DETAILS = "SUCCESS_SUBMERCHANT_DETAILS";
export const ERROR_SUBMERCHANT_DETAILS = "ERROR_SUBMERCHANT_DETAILS";




export const submerchantDetail = (submerchant_id, cb) => {
    return (dispatch, getState) => {
        Apicall.get(`merchant/sub/profile/${submerchant_id}`, (response) => {

            handleResponse(response, dispatch, cb, SUCCESS_SUBMERCHANT_DETAILS, ERROR_SUBMERCHANT_DETAILS);
        })
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