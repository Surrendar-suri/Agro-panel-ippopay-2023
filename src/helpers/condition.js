import cookie from "react-cookies";

let token = cookie.load("token");
const isLoggedIn = () => {
  if (token && token !== undefined && token !== null) return true;
  else return false;
};

export default isLoggedIn;