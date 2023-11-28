import React, { useState, useEffect, useRef } from "react";
import Logo from "../images/logo_ippopay.svg";
import {
  loginInitiate,
  forgotPassword,
  ResetPassword,
} from "../store/actions/login";
import { registerInitiate } from "../store/actions/register";
import {
  verification,
  emailOtp,
  phoneOtp,
} from "../store/actions/verification";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import "../styles/style.css";
import {
  cookies,
  isInvalidEmail,
  isInvalidName,
  payoutsatus,
  number,
  specialChars,
  uppercase,
  lowercase,
  toastError,
  toastSuccess,
  Toaster,
  passwordValidations,
} from "../helpers/Utils";
import { useHistory } from "react-router";
import cookie from "react-cookies";
import { myprofile } from "../store/actions/profile";

const Login = (props) => {
  let token = cookie.load("payout_status");
  const [payoutStatus, setPayoutStatus] = useState("");
  const [state, setState] = useState({
    password: "",
    showPassword: false,
    showPasswords: false,
    forgot: false,
    conPassword: "",
    show: false,
    log: true,
    forgot_email_otp:"",
    forgot_phone_otp:""
    
  });
  const [otp,setOtp] = useState({
    email_otp: "",
    phone_otp: "",
  })
  const [signup, setSignup] = useState({
    email: '',
    password: '',
    name: "",
    phone: "",
    conPassword: "",
    states: "",
    show: false,
    log: true,
    showPassword: false,
    showConPassword: false,
  });
  const [signin, setSignIn] = useState({
    signin_email: '',
    signin_password: '',
    loginShowIcon:""
  });
  // const [newPassword,setNewPassword] = useState("")
  // const [newConPassword,setConNewPassword] = useState("")
  const [resetOtp,setResetOtp] = useState({
    resetOtp:"",
    newPassword:"",
    newConPassword:""
  })
  const [forgotemail,setForgot] = useState({
    forgot_email:""
  })
  const [login_screen, setLoginHide] = useState(true);
  const [signup_screen, setlogSignUp] = useState(false);
  const [forgot_screen, setForgotHide] = useState(false);

  const hideShow = (a, b, c) => {
    setForgotHide(a)
    setlogSignUp(b)
    setLoginHide(c)
  }
  const handleLoginHere = () => {
    hideShow(false, false, true);
  }
  const handleRegisterHere = () => {
    hideShow(false, true, false);
  }
  const handleForgot = () => {
    hideShow(true, false, false);
  }

  const history = useHistory();
  const [toggleSign, setToggleSign] = useState(false);
  let dispatch = useDispatch();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setOtp((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };
  const handleChangeForgotOtp = (e) =>{
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  }
  // const handleOnInputChange = (event) => {
  //   setSignup({
  //     [event.target.name]: event.target.value,
  //   });
  // };
  const handleResetChange =(event)=>{
    const {name,value} = event.target;
    setResetOtp((prevState) => ({ ...prevState, [name]: value }));
  }
  const handleOnLoginChange = (event) => {
    const {name,value} = event.target;
    // setSignIn([name],value)
    setSignIn((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleOnSignUpChange = (event) => {
    const {name,value} = event.target;
    setSignup((prevState) => ({ ...prevState, [name]: value }));
   
  };
  const handleChangeNumber = (e) => {
    let REGEX = /^\d+$/;
    if (e.target.value === "" || REGEX.test(e.target.value)) {
      setState((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    }
  };

  // Timer

  const [counter, setCounter] = useState(59);
  const [time, setTime] = useState(59);

  useEffect(() => {
    if (state.show) {
      counters();
      timers();
    }
  });
  async function counters() {
    if (counter > 0) {
      setTimeout(() => setCounter(counter - 1), 1000);
    }
  }

  async function timers() {
    if (time > 0) {
      setTimeout(() => setTime(time - 1), 1000);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const form = e.target.form;

      const index = Array.prototype.indexOf.call(form, e.target);

      if (e.target.value === "") {
        form.elements[index].focus();
      } else {
        form.elements[index + 1].focus();
      }
      login();
    }
  };

  const login = (e) => {
    const {signin_email,signin_password} = signin
    e.preventDefault(e);
    if (isInvalidEmail(signin_email)) {
      toastError("Please enter a valid email id");
    } else if (signin_password === "" || signin_password === null) {
      toastError("Please enter a valid password");
    }
    else {
      let data = { email: signin_email, password: signin_password };
      dispatch(
        loginInitiate(data, (result) => {
          if (result) {
            cookies(result.auth_token);
            payoutsatus(result.payout);
            window.location.reload();
          }
        })
      );
    }
  };

  const register = (e) => {
    const { email, password, name, phone, conPassword, states } = signup;
    if (name === "" || name === null) {
      toastError("Please enter the name");
    } else if (name.length < 3) {
      toastError("Please enter the name minimum 3 characters");
    } else if (isInvalidName(name)) {
      toastError("Please enter alphabets only");
    } else if (isInvalidEmail(email)) {
      toastError("Please enter a valid email id");
    } else if (phone === "" || phone === null) {
      toastError("Please enter a valid phone");
    } else if (number(phone)) {
      toastError("Please enter numbers only");
    } else if (phone.length < 10 || phone.length > 10) {
      toastError("Please enter 10 digits ");
    } else if (states === "" || states === null) {
      toastError("Please enter the state name");
    } else if (states.length < 3) {
      toastError("Please enter the state name minimum 3 characters");
    } else if (password === "" || password === null) {
      toastError("Please enter a valid password");
    } else if (passwordValidations(password)) {
      toastError(
        "Password should contain At least one uppercase, one lower case, one special characters ,one numeric and eight characters or longer"
      );
    } else if (conPassword === "" || conPassword === null) {
      toastError("Please enter a confirm password");
    } else if (password !== conPassword) {
      toastError("Password must be same");
    } else {
      let data = {
        name: {
          full: name,
        },
        phone: {
          national_number: phone,
        },
        email: email,
        password: password,
        state: {
          name: states,
        },
      };

      dispatch(
        registerInitiate(data, (result) => {
          if (result) {
            // toastSuccess("signp success")
            // window.location.reload();
            // alert('you here');
            setState({ ...state, show: true, log: false });
            hideShow(false)
            // setSignup({
            //   ...signup,
            // })
          }
        })
      );
    }
  }

  const submitOtp = (e) => {
    e.preventDefault();
    const { phone_otp, email_otp} = otp;
    if (email_otp === "" || email_otp === null) {
      toastError("Please enter email otp");
    } else if (phone_otp === "" || phone_otp === null) {
      toastError("Please enter phone otp");
    } else {
      let data = {
        verification_code: email_otp,
        phone_otp:phone_otp,
        email: signup.email,
      };
      dispatch(
        verification(data, (result) => {
          if (result) {
            cookies(result.auth_token);

            window.location.reload();
          }
        })
      );
    }
  };
  
 const handleForgotChange = (event) =>{
  const {name,value} = event.target;
  setForgot((prevState) => ({ ...prevState, [name]: value }));
 }
  const toggleSignInUp = () => {
    setToggleSign(!toggleSign, () => setState(...state, state));
  };

  const resendemail_otp = () => {
    const { email } = signup;
    let data = { email: email };
    if (!counter) {
      dispatch(
        emailOtp(data, (result) => {
          if (result) {
            setCounter(59);
          }
        })
      );
    }
  };

  const resendphone_otp = () => {
    const { email } = signup;
    let data = { email: email };
    if (!time) {
      dispatch(
        phoneOtp(data, (result) => {
          if (result) {
            setTime(59);
          }
        })
      );
    }
  };

  const forgot = () => {
    const { forgot_email } = forgotemail;
    // if (isInvalidEmail(forgot_email)) {
    //   toastError("Please enter valid email id");
    // } else {
      let data = { email: forgot_email };
      dispatch(
        forgotPassword(data, (result) => {
          if (result) {
            setState({
              ...state,
              forgot_password: true,
              forgot: true,
              show: false,
              log: false,
             
            });
            hideShow(false)
          }
        })
      );
    // }
  };

  const forgot_toggle = () => {
    setState({ ...state, forgot_password: false });
  };

  const handleClickShowPassword = () => {
    setState({ ...state, showPassword: !state.showPassword });
  };
const handleClickShowPasswordSighup =() =>{
setSignup({...signup,showPassword:!signup.showPassword})
}
const handleClickShowPasswordSigin =() =>{
  setSignIn({...signin,loginShowIcon:!signin.loginShowIcon})
  }

const handleClickShowconPasswordSighup =()=>{
  setSignup({...signup,showConPassword:!signup.showConPassword})
}
  const handleClickShowPasswords = () => {
    setState({ ...state, showPasswords: !state.showPasswords });
  };

  const loginPage = () => {
    setState({ ...state, forgot_password: true });
  };

  const resetPassword = () => {
    // const {email_otp} = otp;
    // const {signin_email,signin_password} = signin;
    if (resetOtp.resetOtp === "" || resetOtp.resetOtp === null) {
      toastError("Please enter email otp..");
    } else if (resetOtp.newPassword === "" || resetOtp.newPassword === null) {
      toastError("Please enter new password");
    } else if (resetOtp.newPassword.length < 8) {
      toastError("Please enter the password minimum 8 characters");
    } else if (uppercase(resetOtp.newPassword)) {
      toastError("Please enter minimum one uppercase");
    } else if (lowercase(resetOtp.newPassword)) {
      toastError("Please enter minimum one lowercase");
    } else if (specialChars(resetOtp.newPassword)) {
      toastError("Please enter minimum one special character");
    } else if (resetOtp.newConPassword === "" || resetOtp.newConPassword === null) {
      toastError("Please enter your confirm password");
    } else if (resetOtp.newPassword !== resetOtp.newConPassword) {
      toastError("Password must be same");
    } else {
      let data = {
        verification_code:resetOtp.resetOtp,
        email: forgotemail.forgot_email,
        password: resetOtp.newPassword,
      };
      dispatch(
        ResetPassword(data, (result) => {
          if (result) {
            setState({
              ...state,
              forgot: false,
              show: false,
              
              log: true,
              forgot_password: true,
            });
            hideShow(false,false,true)
            setForgot(forgotemail===null)
            
          }
        })
      );
    }
  };
  
  return (
    <>
      <Toaster />
      <div className="login-img">
        <div className="page-login">
          <div className="text-center col-xs-12">
            <a className="logo-login">
              <img className="header-brand-img light-logo1" src={Logo} alt="" />
            </a>
          </div>
          <div className="container-login100">
            <div className="wrap-login100 p-8">
              <>
                {login_screen ?
                  <div
                    className="login100-form validate-form"
                  // onKeyPress={(event) => event.key === "Enter"}
                  >
                    <div><span className="login100-form-title pb-5"> Login</span> </div>
                    <div className="panel panel-primary">
                      <div className="panel-body tabs-menu-body pt-20">
                        <div
                          className="wrap-input100 validate-input input-group"
                          data-toggle="Valid email is required: ex@abc.xyz"
                        >
                          <a className="input-group-addon bg-white text-muted">
                            {" "}
                            <i
                              className="zmdi zmdi-email text-muted"
                              aria-hidden="true"
                            ></i>{" "}
                          </a>
                          <input
                            className="input100 form-control form-box"
                            placeholder="Email"
                            type="email"
                            name="signin_email"
                            value={signin.signin_email}
                            autocomplete="off"
                            onChange={handleOnLoginChange}
                            id="signin_email"
                          // onKeyPress={handleKeyPress}
                          />{" "}
                        </div>


                        <div
                          className="wrap-input100 validate-input input-group"
                          id="Password-toggle"
                        >
                          <a className="input-group-addon bg-white text-muted">
                            {" "}
                            <i
                              className="zmdi zmdi-eye text-muted"
                              aria-hidden="true"
                              onClick={handleClickShowPasswordSigin}
                            ></i>{" "}
                          </a>
                          <input
                            className="input100 form-control form-box"
                            placeholder="Password"
                            type={signin.loginShowIcon ? "text" : "password"}
                            name="signin_password"
                            value={signin.signin_password}
                            onChange={handleOnLoginChange}
                            id="signin_password"
                            onKeyPress={handleKeyPress}
                          />{" "}
                        </div>
                        <div className="text-right pt-4">
                          <p className="mb-0">
                            <a
                              className="text-primary ms-1"
                              style={{ cursor: "pointer" }} onClick={handleForgot}
                            >Forgot Password?</a>
                          </p>
                        </div>

                        <div>

                          <div className="container-login100-form-btn">
                            <button
                              className="login100-form-btn btn-primary btn_primary_focus"
                              style={{ cursor: "pointer" }}
                              onClick={login}
                            >
                              Login
                            </button>
                          </div>
                        </div>

                        <div
                          className="text-center pt-3"
                          style={{ marginTop: "10px" }}
                        >
                          <p className="text-dark mb-0">Not a member ? <a className="text-primary ms-1 cursor-point" onClick={handleRegisterHere}>SignUp</a></p>
                        </div>
                      </div>


                    </div>
                  </div>
                  :
                  signup_screen ?
                    <div
                      className="login100-form validate-form"
                      onKeyPress={(event) => event.key === "Enter"}
                    >
                      <div><span className="login100-form-title pb-5"> Signup</span> </div>
                      <div className="panel panel-primary">
                        <div className="panel-body tabs-menu-body pt-20">
                          <div
                            className="wrap-input100 validate-input input-group"
                            data-toggle="Valid email is required: ex@abc.xyz"
                          >
                            <a className="input-group-addon bg-white text-muted">
                              <i
                                className="zmdi zmdi-account-o text-muted"
                                aria-hidden="true"
                              ></i>
                            </a>
                            <input
                              className="input100 form-control form-box"
                              placeholder="Name"
                              type="name"
                              name="name"
                              value={signup.name}
                              onChange={handleOnSignUpChange}
                              id="name"

                            />{" "}
                          </div>
                          <div
                            className="wrap-input100 validate-input input-group"
                            data-toggle="Valid email is required: ex@abc.xyz"
                          >
                            <a className="input-group-addon bg-white text-muted">
                              {" "}
                              <i
                                className="zmdi zmdi-email text-muted"
                                aria-hidden="true"
                              ></i>{" "}
                            </a>
                            <input
                              className="input100 form-control form-box"
                              placeholder="Email"
                              type="email"
                              name="email"
                              value={signup.email}
                              onChange={handleOnSignUpChange}
                              id="email"
                              onKeyPress={handleKeyPress}
                            />{" "}
                          </div>

                          <div
                            className="wrap-input100 validate-input input-group"
                            data-toggle="Valid email is required: ex@abc.xyz"
                          >
                            <a className="input-group-addon bg-white text-muted">
                              {" "}
                              <i
                                className="zmdi zmdi-phone text-muted"
                                aria-hidden="true"
                              ></i>
                            </a>
                            <input
                              className="input100 form-control form-box"
                              placeholder="Phone Number"
                              type="text"
                              value={signup.phone}
                              name="phone"
                              onChange={handleOnSignUpChange}
                              id="phone"

                            />{" "}
                          </div>
                          <div
                            className="wrap-input100 validate-input input-group"
                            data-toggle="Valid email is required: ex@abc.xyz"
                          >
                            <a className="input-group-addon bg-white text-muted">
                              <i
                                className="zmdi zmdi-pin text-muted"
                                aria-hidden="true"
                              ></i>
                            </a>
                            <input
                              className="input100 form-control form-box"
                              placeholder="State name"
                              type="text"
                              value={signup.states}
                              onChange={handleOnSignUpChange}
                              id="states"
                              name="states"

                            />{" "}
                          </div>
                          <div
                            className="wrap-input100 validate-input input-group"
                            id="Password-toggle"
                          >
                            <a className="input-group-addon bg-white text-muted">
                              {" "}
                              <i
                                className="zmdi zmdi-eye text-muted"
                                aria-hidden="true"
                                 onClick={handleClickShowPasswordSighup}
                              ></i>{" "}
                            </a>
                            <input
                              className="input100 form-control form-box"
                              placeholder="Password"
                              type={signup.showPassword ? "text" : "password"}
                              name="password"
                              value={signup.password}
                              onChange={handleOnSignUpChange}
                              id="password"
                              onKeyPress={handleKeyPress}
                            />{" "}
                          </div>
                          <div
                            className="wrap-input100 validate-input input-group"
                            data-toggle="Valid email is required: ex@abc.xyz"
                          >
                            <a className="input-group-addon bg-white text-muted">
                              {" "}
                              <i
                                className="zmdi zmdi-eye text-muted"
                                aria-hidden="true"
                                onClick={handleClickShowconPasswordSighup}
                                
                              ></i>{" "}
                            </a>
                            <input
                              className="input100 form-control form-box"
                              placeholder="Confirm Password"
                              type={signup.showConPassword ? "text" : "password"}
                              name="conPassword"
                              value={signup.conPassword}
                              onChange={handleOnSignUpChange}
                              id="conPassword"
                            />{" "}
                          </div>
                          <div className="text-right pt-4">
                            <p className="mb-0">
                              <a
                                className="text-primary ms-1"
                                style={{ cursor: "pointer" }}
                              ></a>
                            </p>
                          </div>
                          <div>
                            <div className="container-login100-form-btn">
                              <a
                                className="login100-form-btn btn-primary"
                                style={{ cursor: "pointer" }}
                                onClick={register}
                              >
                                Signup
                              </a>
                            </div>
                            <p className="account">Already have an account ? <span style={{ color: 'blue', cursor: "pointer" }} onClick={handleLoginHere}>Login Here</span></p>


                          </div>
                          <div>
                          </div>

                          <div
                            className="text-center pt-3"
                            style={{ marginTop: "10px" }}
                          >
                            <p className="text-dark mb-0">
                              <a
                                className="text-primary ms-1 cursor-point"

                              ></a>
                            </p>
                          </div>
                        </div>


                      </div>
                    </div>
                    :
                    forgot_screen ? <div
                      className="login100-form validate-form"
                      onKeyPress={(event) => event.key === "Enter"}
                    >
                      <h4 className="forgot_password">Forgot Password?</h4>
                      <p className="forgot_text">
                        Enter your email and we'll send you a link to reset your
                        password.
                      </p>
                      <div className="panel panel-primary">
                        <div className="panel-body tabs-menu-body pt-20">
                          <div
                            className="wrap-input100 validate-input input-group"
                            data-toggle="Valid email is required: ex@abc.xyz"
                          >
                            <a className="input-group-addon bg-white text-muted">
                              {" "}
                              <i
                                className="zmdi zmdi-email text-muted"
                                aria-hidden="true"
                              ></i>{" "}
                            </a>
                            <input
                              className="input100 form-control form-box"
                              placeholder="Email"
                              type="email"
                              name="forgot_email"
                              value={forgotemail.forgot_email}
                              onChange={handleForgotChange}
                              id="email"
                              
                              onKeyPress={handleKeyPress}
                            />{" "}
                          </div>
                          <div className="text-right pt-4"><p className="mb-0"></p></div>
                          <div className="container-login100-form-btn">
                            <a
                              className="login100-form-btn btn-primary"
                              style={{ cursor: "pointer", marginTop: "-10px" }}
                              onClick={forgot}
                            >
                              Submit
                            </a>
                          </div>
                          <p className="account">Already have an account ? <span style={{ color: 'blue', cursor: "pointer" }} onClick={handleLoginHere}>Login Here</span></p>
                        </div>


                      </div>
                    </div>
                      :
                      null
                }
              </>
              {/* OTP screen */}
              {state.show && <div
                className="login100-form validate-form"
                onKeyPress={(event) => event.key === "Enter"}
              >
                <div className="panel panel-primary">
                  <div>
                    <div style={{ marginBottom: 20 }}>
                      <h4>Verify your Account</h4>
                    </div>
                    <div>
                      <p className="login100-form-titles">OTP has been sent to your registered email and phone number</p>
                    </div>
                    <div
                      className="wrap-input100 validate-input input-group"
                      data-toggle="Valid email is required: ex@abc.xyz"
                    >
                      <a className="input-group-addon bg-white text-muted">

                        <i
                          className="zmdi zmdi-email text-muted"
                          aria-hidden="true"
                        ></i>

                      </a>
                      <input
                        className="input100 form-control form-box"
                        placeholder="Email otp"
                        type="email"
                        value={otp.email_otp}
                        id="email_otp"
                        onChange={handleChange}
                      />{" "}
                    </div>
                    <p className="resend_otp" onClick={resendemail_otp}> {counter ? (<span className={counter ? 'span-disabled' : ''}>Resend OTP in {counter} Sec</span>) : <span className="resend">Resend</span>}</p>
                    <div
                      className="wrap-input100 validate-input input-group"
                      data-toggle="Valid email is required: ex@abc.xyz"
                    >
                      <a className="input-group-addon bg-white text-muted">

                        <i className="zmdi zmdi-phone text-muted" aria-hidden="true"></i>

                      </a>
                      <input
                        className="input100 form-control form-box"
                        placeholder="Phone otp"
                        type="text"
                        value={otp.phone_otp}
                        id="phone_otp"
                        onChange={handleChange}
                      />{" "}
                    </div>

                    <p className="resend_otp" onClick={resendphone_otp}> {time ? (<span className={time ? 'span-disabled' : ''}>Resend OTP in {time} Sec</span>) : <span className="resend">Resend</span>}</p>
                    <div
                      className=" container-login100-form-btn"
                    >
                      <a
                        className="login100-form-btn btn-primary"
                        style={{ cursor: "pointer" }}
                        onClick={submitOtp}
                      >
                        Submit
                      </a>
                    </div>

                  </div>
                </div>
              </div>}

              {/* Reset Screen */}
              {state.forgot &&  <div
                className="login100-form validate-form"
                onKeyPress={(event) => event.key === "Enter"}
              >
                <div className="panel panel-primary">

                  <div>
                    <div>
                      <h4 style={{ marginBottom: 20 }}>Reset Password</h4>
                    </div>
                    <div
                      className="wrap-input100 validate-input input-group"
                      data-toggle="Valid email is required: ex@abc.xyz"
                    >
                      <a className="input-group-addon bg-white text-muted">

                        <i
                          className="zmdi zmdi-email text-muted"
                          aria-hidden="true"
                        ></i>

                      </a>
                      <input
                        className="input100 form-control form-box"
                        placeholder="Email otp"
                        type="email"
                        value={resetOtp.resetOtp}
                        name="resetOtp"
                        id="email_otp"
                        onChange={handleResetChange}
                      />{" "}
                    </div>
                    <div
                      className="wrap-input100 validate-input input-group"
                      id="Password-toggle"
                    >
                      <a className="input-group-addon bg-white text-muted">
                        {" "}
                        <i
                          className="zmdi zmdi-eye text-muted"
                          aria-hidden="true"
                          onClick={handleClickShowPassword}
                        ></i>{" "}

                      </a>
                      <input
                        className="input100 form-control form-box"
                        placeholder="New Password"
                        type={state.showPassword ? "text" : "password"}
                        value={resetOtp.newPassword}
                        name="newPassword"
                        onChange={handleResetChange}
                      />{" "}
                    </div>
                    <div
                      className="wrap-input100 validate-input input-group"
                      data-toggle="Valid email is required: ex@abc.xyz"
                    >
                      <a className="input-group-addon bg-white text-muted">
                        {" "}
                        <i
                          className="zmdi zmdi-eye text-muted"
                          aria-hidden="true"
                          onClick={handleClickShowPasswords}
                        ></i>{" "}
                      </a>
                      <input
                        className="input100 form-control form-box"
                        placeholder="Confirm Password"
                        type={state.showPasswords ? "text" : "password"}
                        value={resetOtp.newConPassword}
                        name="newConPassword"
                        id="conPassword"
                        onChange={handleResetChange}
                      />{" "}
                    </div>


                    <div
                      className="container-login100-form-btn"
                    >
                      <a
                        className="login100-form-btn btn-primary"
                        style={{ cursor: "pointer" }}
                        onClick={resetPassword}
                      >
                        Submit
                      </a>
                    </div>
                  </div>
                </div>
              </div>}
             
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
