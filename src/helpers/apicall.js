import axios from 'axios';
import GBLVAR from "./globalVariables";
import cookie from 'react-cookies'
class ApiCall {

    get(url, callback) {
        this.createInstance(url, null, 0).then((result) => {
            callback(result.data)
        }).catch((error) => {
        });
    }
    
    post(url, data, callback) {
        this.createInstance(url, data, 1).then((result) => {
            callback(result.data)
        }).catch((error) => {
        });
    }


    patch(url, data, callback) {
        this.createInstance(url, data, 2).then((result) => {
            callback(result.data)
        }).catch((error) => {
        });
    }


     delete(url, data, callback) {
        this.createInstance(url, data, 3).then((result) => {
            callback(result.data)
        }).catch((error) => {
        });
    }

    createInstance(append, data, type) {
        var instance = axios.create();
        instance.defaults.headers.post['Content-Type'] = 'multipart/form-data';
        instance.defaults.headers.common['Authorization'] = 'Bearer ' + cookie.load("token");
        // var url = "http://43.204.131.206:8000/api/v1/" + append;
        var url = GBLVAR.BASE_URL + append;
       
        switch (type) {
            case 0:
                return instance.get(url);
            case 1:
                return instance.post(url, data);
            case 2:
                return instance.patch(url, data);
            default:
                return instance.delete(url, data);
        }
    }
}

export default new ApiCall();