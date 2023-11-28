"use strict";
import axios from "axios";
import GBLVAR from "./../helpers/globalVariables";
import cookie from "react-cookies";

class ApiCall {
  constructor() {}

  get(url, callback) {
    this.callApiRequest(url, null, 0,callback);
  }

  post(url, data, callback) {
    this.callApiRequest(url, data, 1,callback);
  }

  patch(url, data, callback) {
    this.callApiRequest(url, data, 2,callback);
  }

  delete(url, data, callback) {
    this.callApiRequest(url, data, 3,callback);
  }

  callApiRequest(append, data, type, callback) {
    cookie.save("ippo_merchant_id","qIgDvLC0j");
    var instance = axios.create();
    instance.defaults.headers.post["Content-Type"] = "application/json";
    instance.defaults.headers.common["Authorization"] = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ0aTlCZWNpY3pTNzZ6NTFkd2lQcGlDMjFHWTVzdkxlNyIsImlhdCI6MTY2MTIzNDc3MX0.KMOadm_rFcPy2thiYf5LlHZIoOzh77sNrMtdVJUXNBA";    var url;
    // if(cookie.load('ApiMode') == "Test"){
      url = GBLVAR.STACK_URL + append;
    // }
    // else{
    //   url = GBLVAR.BASE_URL + append;
    // }
    var task;
    switch (type) {
      case 0:
        task = instance.get(url);
        break;
      case 1:
        task = instance.post(url, data);
        break;
      case 2:
        task = instance.patch(url, data);
        break;
      default:
        task = instance.delete(url, data);
        break;
    }

    task
      .then(result => {
        callback(result.data);
      })
      .catch(error => {
        if (error && error.response && error.response.status === 401) {
          //window.location.href = "https://app.ippopay.com/signin";
        }
      });
  }
}

export default new ApiCall();