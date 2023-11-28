
import ApiCall from "../../helpers/apicall";
import { toastSuccess, toastError, Toaster } from '../../helpers/Utils';

export const SUCCESS_FETCH_TRANSACTION_LIST = "SUCCESS_FETCH_TRANSACTION_LIST";
export const FAIL_FETCH_TRANSACTION_LIST = "FAIL_FETCH_TRANSACTION_LIST";
export const SUCCESS_FETCH_TRANSACTION_DETAIL = "SUCCESS_FETCH_TRANSACTION_DETAIL";
export const FAIL_FETCH_TRANSACTION_DETAIL = "FAIL_FETCH_TRANSACTION_DETAIL";


<div>
  <Toaster />
</div>
export const payoutsList = (query,cb) => {
    return (dispatch, getState) => {
        ApiCall.get(`merchant/list-transaction`+ query, (response) => {
            handleResponse(response, dispatch, cb, SUCCESS_FETCH_TRANSACTION_LIST, FAIL_FETCH_TRANSACTION_LIST);
        })
    }
}
export const statementsDetails = (trans_id,cb,) => {
    return (dispatch) => {
        ApiCall.get(`merchant/transaction/detail/${trans_id}`, (response) => {
            handleResponse(response, dispatch, cb, SUCCESS_FETCH_TRANSACTION_DETAIL, FAIL_FETCH_TRANSACTION_DETAIL);
        })
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

const handleResponses = (response, dispatch, cb, sType, fType) => {
    if (response.success) {
        if (response.data) {
            toastSuccess(response.message);
            dispatch({ type: sType, data: response.data })
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