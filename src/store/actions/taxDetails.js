import Apicall from "../../helpers/apicall";



export const FETCH_TAXESDETAIL_SUCCESS = "FETCH_TAXESDETAIL_SUCCESS";
export const FETCH_TAXESDETAIL_FAIL = "FETCH_TAXESDETAIL_FAIL";




export const getDetailTax =(tax_id, cb)=>{
    return (dispatch)=>{
        Apicall.get(`properties/tax/detail/${tax_id}`,(response)=>{
            handleResponse(response, dispatch, cb,FETCH_TAXESDETAIL_SUCCESS,FETCH_TAXESDETAIL_FAIL)
        })
    }
}


const handleResponse =(response, dispatch, cb, sType, fType)=>{
    if(response.success){
        dispatch({ type: sType, data: response.data});       
        if(response.data){
            cb(response.data);
        }else {
            cb(response.data);
        }
    }else {
        dispatch({ type: fType });
        cb(null);
    }
}
