import {SUCCESS_ACTIVATE_SUBMERCHANT,ERROR_ACTIVATE_SUBMERCHANT } from '../actions/submerchantActive';

const initialState ={
    user:{},
    loading: false,
}

const submerchantActiveReducer =(state= initialState, action)=>{

    switch(action.type){
       
         case SUCCESS_ACTIVATE_SUBMERCHANT:
                return {
                    ...state,
                    loading: false,
                    user: action.data,
                }   
         case ERROR_ACTIVATE_SUBMERCHANT:
                return {
                    ...state,
                    loading: false,
                }

         
         default:
             return state;    
    }
}

export default submerchantActiveReducer;