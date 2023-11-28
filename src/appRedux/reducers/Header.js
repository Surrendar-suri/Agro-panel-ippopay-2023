import { userConstants } from "../../constants/ActionTypes";


const initialState = {
    merchant_profile : {},
    showToggle : false,
    certificate_of_incorporation : false,
    incorporation_certificate : "",
    isCompanyPan : false,
    company_pan_card : "",
    isGSTCertificate : false,
    gst_certificate : "",
    isIndividualPan : false,
    individual_pan_card : "",
    documents:{}
};

let resetInitialState = JSON.stringify((({ merchant_profile, ...o }) => o)(initialState));

export function header(state = initialState, action) {
    switch (action.type) {  
        case userConstants.HEADER:
            return {
                ...state,
                ...action.payload
            };
        case userConstants.RESET_HEADER:
            return {
                merchant_profile : state.merchant_profile,
                ...JSON.parse( resetInitialState )
            };
        default:
            return state
    }
}