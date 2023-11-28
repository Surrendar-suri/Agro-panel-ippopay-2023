import {START_MERCHANT_LIST ,SUCCESS_MERCHANT_LIST,ERROR_MERCHANT_LIST} from '../actions/submerchantList';
import {ADD_SUBMERCHANT} from '../actions/submerchant';

const initialState ={
    user:{},
    loading: false,
}

const submerchantlistReducer =(state= initialState, action)=>{

    switch(action.type){
         case START_MERCHANT_LIST :
             return {
                 ...state,
                 loading: true
             }
         case SUCCESS_MERCHANT_LIST:
             return {
                 ...state,
                 loading: false,
                 user: action.data,
             }   
        //  case ADD_SUBMERCHANT:
        //         return {
        //             ...state,
        //             user:userList.concat(action.data)
        //         }  
        case ADD_SUBMERCHANT:
            return {
                ...state,
                user:[...state.user.concat(action.data)]
            }   
         case ERROR_MERCHANT_LIST:
             return {
                 ...state,
                 loading: false,
             } 
           
         default:
             return state;    
    }
}

export default submerchantlistReducer;