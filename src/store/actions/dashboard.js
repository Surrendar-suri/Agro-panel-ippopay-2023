
import ApiCall from "../../helpers/apicall";
import { toastSuccess, toastError, Toaster } from '../../helpers/Utils';

export const SUCCESS_FETCH_DASHBOARB_LIST = "SUCCESS_FETCH_DASHBOARB_LIST";
export const FAIL_FETCH_DASHBOARB_LIST = "FAIL_FETCH_DASHBOARB_LIST";
export const SUCCESS_FETCH_DASHBOARB_TRANSACTION = "SUCCESS_FETCH_DASHBOARB_TRANSACTION";
export const FAIL_FETCH_DASHBOARB_TRANSACTION = "FAIL_FETCH_DASHBOARB_TRANSACTION";
export const SUCCESS_FETCH_DASHBOARB_PAYOUT = "SUCCESS_FETCH_DASHBOARB_PAYOUT";
export const FAIL_FETCH_DASHBOARB_PAYOUT = "FAIL_FETCH_DASHBOARB_PAYOUT";
export const SUCCESS_FETCH_DASHBOARB_INVOICE = "SUCCESS_FETCH_DASHBOARB_INVOICE";
export const FAIL_FETCH_DASHBOARB_INVOICE = "FAIL_FETCH_DASHBOARB_INVOICE";
export const SUCCESS_FETCH_ACCOUNT_BALANCE = "SUCCESS_FETCH_ACCOUNT_BALANCE";
export const FAIL_FETCH_ACCOUNT_BALANCE = "FAIL_FETCH_ACCOUNT_BALANCE";
export const SUCCESS_FETCH_DASHBOARB_ITEMS = "SUCCESS_FETCH_DASHBOARB_ITEMS";
export const FAIL_FETCH_DASHBOARB_ITEMS = "FAIL_FETCH_DASHBOARB_ITEMS";






<div>
  <Toaster />
</div>
export const dashboardList = (cb) => {
    return (dispatch, getState) => {
        ApiCall.get(`merchant/dashboard-summary`, (response) => {
            handleResponse(response, dispatch, cb, SUCCESS_FETCH_DASHBOARB_LIST, FAIL_FETCH_DASHBOARB_LIST);
        })
    }
}
export const dashboardAccountBal = (cb) => {
    return (dispatch, getState) => {
        ApiCall.get(`merchant/account/balance`, (response) => {
            handleResponse(response, dispatch, cb, SUCCESS_FETCH_ACCOUNT_BALANCE, FAIL_FETCH_ACCOUNT_BALANCE);
        })
    }
}
export const dashboardTransaction = (cb) => {
    return (dispatch, getState) => {
        ApiCall.get(`transaction/my-transactionsummary`, (response) => {
            handleResponse(response, dispatch, cb, SUCCESS_FETCH_DASHBOARB_TRANSACTION, FAIL_FETCH_DASHBOARB_TRANSACTION);
        })
    }
}
export const dashboardPayout = (cb) => {
    return (dispatch, getState) => {
        ApiCall.get(`merchant/dashboard-summary`, (response) => {
            handleResponse(response, dispatch, cb, SUCCESS_FETCH_DASHBOARB_PAYOUT, FAIL_FETCH_DASHBOARB_PAYOUT);
        })
    }
}
export const dashboardInvoice = (cb) => {
    return (dispatch, getState) => {
        ApiCall.get(`invoice/summary`, (response) => {
            handleResponse(response, dispatch, cb, SUCCESS_FETCH_DASHBOARB_INVOICE, FAIL_FETCH_DASHBOARB_INVOICE);
        })
    }
}
export const dashboardItems = (cb) => {
    return (dispatch, getState) => {
        ApiCall.get(`invoice/dashboard-summary`, (response) => {
            handleResponse(response, dispatch, cb, SUCCESS_FETCH_DASHBOARB_ITEMS, FAIL_FETCH_DASHBOARB_ITEMS);
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