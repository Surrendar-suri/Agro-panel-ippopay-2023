import { message } from "antd";
import { PhoneNumberUtil } from "google-libphonenumber";
import moment from "moment";
import cookie from "react-cookies";
import { ToastContainer, toast,Slide } from "react-toastify";
// import { css } from "glamor";
import 'react-toastify/dist/ReactToastify.css';
import { Form, Input } from 'antd';
var saveAs = require("file-saver");

export const showSuccess = (responseMsg) => {
  message.success(responseMsg);
};

// toast.configure({
//   position: toast.POSITION.BOTTOM_RIGHT,
//   autoClose: 3000,
//   transition: Slide,
//   className: 'Toastify',
//   pauseOnFocusLoss: false,
//       className: css({
//       backgroundColor: 'red',
//   }),
//   bodyClassName: css({
//       backgroundColor: 'blue',
//       height: '100%',
//       width: '100%',
//   })
// });
export function roundAmount(value) {
  return Math.round(parseFloat(value) * 100) / 100;
}
export const calculatePercent = (value, percent) => {
  return value === 0 || value === "" ? 0 : roundAmount((value * percent) / 100);
}
export const percentage = (value, percent) => {
  return (value * percent) / 100
}
export const multiply = (value1, value2) => {
  return roundAmount(value1 * value2);
}
export const getCookies = (name) => {
  cookie.load(name);
}
export const cookies = (token) => {
  cookie.save('token', token, {path: '/' });
}
export const payoutsatus =(token) => {
  cookie.save('payout_status',token,{path: '/' });
}

export const removeCookies = (token) => {
  cookie.remove(token,{ path: '/' });
}

export const toastSuccess = (message) => {
  toast.success(message);
}
export const toastError = (message) => {
  toast.error(message);

}
export function masking(value){
  var input = value;
  input = input.toString().replace(/^(\d{0,4})(\d{0,3})/, '$1 $2')
  var prefix = input.substr(0, input.length - 4);
  var suffix = input.substr(-4);
  var masked = prefix.replace(/\d/g, 'X');
  var a = masked + suffix;
  return a;
}
export const Toaster = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
       
      />

    </>
  )
}

export function downloadPDF(id, key) {
  fetch("https://api.ippopay.com/api/v1/" + key + "/open/view/pdf/" + id, {
    headers: {
      "Content-Type": "application/pdf"
    },
    responseType: "blob"
  })
    .then(response => response.blob())
    .then(blob => {
      saveAs(blob, id + ".pdf");
      window.location.reload();
    });
}
export const showError = (responseMsg, seconds) => {
  message.error(responseMsg, seconds);
};

export const showDate = (date) => {
  return moment(date).format("DD-MM-YYYY");
};
export const showYearMonth = (date) => {
  return moment(date).format("DD-MM-YYYY");
};
export const showDates = (date) => {
  return moment(date).format("YYYY-MM-DD");
};

export const showTime = (date) => {
  return moment(date).format("h:mm a");
};
export const getDateFormat = (dateString) => {
  return moment(dateString).format("MMMM Do YYYY");
};
export const getShortDateFormat = (dateString) => {
  return moment(dateString).format("MMM DD YYYY");
};
export const getDateMonth = (dateString) => {
  const current = new Date();

  const getMonth = new Date(dateString)
  current.setMonth(getMonth.getMonth() - 1);
  const previousMonth = current.toLocaleString('default', { month: 'short' });

  return previousMonth;
};
export const showDateTime = (date) => {
  return moment(date).format("DD-MM-YYYY h:mm a");
};

export const timeToString = (time) => {
  return moment(time, "HH:mm").format("HHmm");
};

export const stringToTime = (time) => {
  return moment(time, "HHmm").format("HH:mm");
};

export const convertTimeFormat = (time) => {
  return moment(time, "HH:mm").format("HHmm");
};

export const showMomentFormat = (date) => {
  return moment(date).format("DD-MM-YYYY");
};

export const convertIsoSting = (date) => {
  return moment(date).toISOString();
};



export function getIsoString(date) {
  return date !== "" && date !== isNaN ? moment(date).format("YYYY-MM-DD") : "";
}

export const isDisabledDate = (current) => {
  return current < moment().subtract(1, "days").endOf("day");
};



export const getFixed = (value) => {
  return Math.round(parseFloat(value) * 100) / 100;
};

export const isInvalidName = (value) => {
  let nameRegex = /^[a-zA-Z ]+$/;
  return (!nameRegex.test(value));
};

export const number = (value) => {
  return !/^\d+$/.test(value)
}

export const isInvalidAlphaNumeric = (value) => {
  return (!/^[a-zA-Z0-9 ]+$/.test(value))
};

export const isInvalidNumber = (phoneNumber, country) => {
  try {
    const phoneUtil = PhoneNumberUtil.getInstance();
    return !phoneUtil.isValidNumber(phoneUtil.parse(phoneNumber, country));
  } catch (e) {
    return true;
  }
};

// export const returnAmt = (amount) => {
//   return  amount;
// }

export const isInvalidImage = (file) => {
  return (!file.type.match("image/*"))
};

export const isLargeFile = (file) => {
  return file.size / 1024 / 1024 > 5;
};

export const isInvalidEmail = (email) => {
  let eRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return (!eRegex.test(email));
};

export const specialChars = (password) => {
  let REGEX = /[ `!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/;
  return (!REGEX.test(password));
}

export const uppercase = (password) => {
  return (!password.match(/[A-Z]/g));
}

export const lowercase = (password) => {
  return (!password.match(/[a-z]/g));
}



export const passwordValidations = (value) => {
  var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  // if (!strongRegex.test(value)) {
  //   return true;
  // } else return false;
  return (!strongRegex.test(value));
}



export function returnThirdDegreeObjValue(masterobj, obj, key, postion) {
  if (
    masterobj &&
    masterobj[obj] &&
    masterobj[obj][key] &&
    masterobj[obj][key][postion]
  )
    return masterobj[obj][key][postion];
  else return "Not Provided";
}
export function returnSecondDegreeObjValue(obj, key, postion) {
  if (obj && obj[key] && obj[key][postion]) return obj[key][postion];
  else return "Not Provided";
}
export function returnFirstDegreeObjValue(obj, key) {
  if (obj && obj[key]) return obj[key];
  else return "Not Provided";
}

export function returnAmount(value) {
  return value ?? 0;
}

export function toFixed(value) {
  return Number(value).toFixed(2);
}
export function textCapitalize(data) {
  if (data !== undefined && data !== null && data !== "") {
    return data.charAt(0).toUpperCase() + data.slice(1);
  } else {
    return data;
  }
}

export function downloadAllData(response, filename) {
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(new Blob([response]));
  link.setAttribute(
    "download",
    filename);
  document.body.appendChild(link);
  link.click();

}

export function numberWithCommas(x) {
  if (!x) return "0";
  return x.toString().split(".")[0].length > 3
    ? x
      .toString()
      .substring(0, x.toString().split(".")[0].length - 3)
      .replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
    "," +
    x.toString().substring(x.toString().split(".")[0].length - 3)
    : x.toString();
}

export function manipulateString(str) {
  var i, frags = str.split('_');
  for (i=0; i<frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join('');
}
export function returnFixed(value) {
  var priceRegex = /[\d]+\.[\d]+/;
  if (priceRegex.test(value)) {
    var price = parseFloat(value);
    return price;
  } 
  else if (value === "" || isNaN(value)) {
    return 0;
  } 
  else {
    var price = parseFloat(value);
    var newPrice =
      "" +
      Math.round(price * 100) / 100 +
      (value.indexOf(".") === value.length - 1 ? "." : "");
    return newPrice;
  }
}