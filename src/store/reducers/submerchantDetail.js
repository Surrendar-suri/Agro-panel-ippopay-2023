import {SUCCESS_SUBMERCHANT_DETAILS,ERROR_SUBMERCHANT_DETAILS} from '../actions/submerchantDetail';

const initialState ={
    user:{},
    loading: false,
}

const submerchantDetailReducer =(state= initialState, action)=>{

    switch(action.type){
       
         case SUCCESS_SUBMERCHANT_DETAILS:
             return {
                 ...state,
                 loading: false,
                 user: action.data,
             }   
         case ERROR_SUBMERCHANT_DETAILS:
             return {
                 ...state,
                 loading: false,
             } 
        
         default:
             return state;    
    }
}

export default submerchantDetailReducer;