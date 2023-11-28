import React, { Component } from "react";
import cookie from "react-cookies";
import moment from "moment";
//import { message } from "antd";

import ApiGateway from "./DataServices";
import { userConstants } from ".././constants/ActionTypes";

export default function getAuthToken() {
  var token = cookie.load("AuthAdmin", { path: "/" });
  return token;
}

export function setCookie(key, value) {
  cookie.save(key, value, {
    path: "/",
    maxAge: 19900000,
    secure: false
  });
}

export function currencyFormatter(amount,code) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency:  code.code  }).format(amount) ;
}

export function saveUserShowHome(response, from_where) {
  if (response.success) {
    if (from_where === "from_signin") {
      var data = response.data;
      setCookie("AuthIppostack", data.auth_token);
      setCookie("ippo_merchant_id", data.merchant.merchant_id);
      window.location.reload();
    } else if (
      from_where === "from_otp" ||
      from_where === "from_secure-signin"
    ) {
      var data = response.data;
      setCookie("AuthIppostack", data.auth_token);
      setCookie("ippo_merchant_id", data.merchant.merchant_id);
      //self.props.history.push("/dashboard");
      window.location.reload();
    }
  } 
}

export function getAWSLink() {
  //return "https://65.2.20.236:8000/api/v1/s3/sign"; 
  return "https://api.ippopay.com/api/v1/s3/sign"; 
}         

export function randomString(len) {
  var charSet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var randomString = "";
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}

export function GET_AWS_LINK(result) {
  //return `https://ippostack.s3.amazonaws.com/${cookie.load("ippo_merchant_id")}/${result.filename}`;
  return "https://ippo-pay.s3.amazonaws.com/" + result.filename;
}

export function returnTimeZoneDate(date) {
  if (date === "" || date === undefined || date === null || date === "-") {
    return "";
  }
  var date = moment(date);
  return moment
    .utc(date)
    .local()
    .format("DD-MM-YYYY h:mm a");
}

export function returnZoneDate(date) {
  if (date === "" || date === undefined || date === null || date === "-") {
    return "";
  }
  var date = moment(date);
  return moment
    .utc(date)
    .local()
    .format("DD/MM/YYYY");
}

export function textCapitalize(data) {
  if (data !== undefined && data !== null && data !== "") {
    return data.charAt(0).toUpperCase() + data.slice(1);
  } else {
    return data;
  }
}

export function checkImageType(
  self,
  name,
  is_name,
  file,
  next,
  progress,
  isFrom
) {
  var imageType = "image/*";
  if (!file.type.match(imageType)) {
    //message.error("Please upload image only");
  } else {
    if (isFrom === "international") {
      self.onUploadPrimaryStart(file, next, name, is_name, progress);
    } else {
      self.onUploadPrimaryStart(file, next, name);
    }
  }
}

export function validate(e) {
  var theEvent = e || window.event;
  if (theEvent.type === 'paste') {
      key = e.clipboardData.getData('text/plain');
  } else {
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
  }
  var regex = /^[0-9]+$/;
  if (!regex.test(key)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) theEvent.preventDefault();
  }
}

export function manipulateString(str) {
  var i, frags = str.split('_');
  for (i=0; i<frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join('');
}



export function preprocess(file, next, key,updateState , dispatch , applyToast) {
  var imageType = "image/*";
  var reader = new FileReader();
  if (!file.type.match(imageType)) {
    applyToast('Please upload image only','error'); 
  } else if (!(file.size / 5120 / 5120 < 5)) {
    applyToast('Image size should be less than 5 mb','error');  
  } else {
      reader.onload = function (e) { };
      reader.readAsDataURL(file);
      next(file);
      dispatch(updateState(userConstants.HEADER,{ [key]: true })); 
  }
}

export function onError(key,updateState , dispatch , applyToast) {
  dispatch(updateState(userConstants.HEADER,{ [key]: false })).then(()=>{
    applyToast('Image Upload failure please try again','error');    
  })
}

export function onFinish (url, key1, key2,updateState , dispatch , applyToast) {
  var image = GET_AWS_LINK(url);
  dispatch(updateState(userConstants.HEADER,{ [key1]: image,[key2]: false })).then(()=>{
    applyToast('Image Uploaded Successfully','success'); 
  })
};

export function removeImage (key1, key2, updateState , dispatch ) {
  dispatch(updateState(userConstants.HEADER,{  [key1]: "",
  [key2]: false }))
}

export function returnFixed(value) {
  var priceRegex = /[\d]+\.[\d]+/;
  if (priceRegex.test(value)) {
    var price = parseFloat(value);
    return price;
  } else if (value === "" || isNaN(value)) {
    return 0;
  } else {
    var price = parseFloat(value);
    var newPrice =
      "" +
      Math.round(price * 100) / 100 +
      (value.indexOf(".") === value.length - 1 ? "." : "");
    return newPrice;
  }
}