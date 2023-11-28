import React, { useState, useEffect } from "react";
import {
    Button,
    Modal,
    Form,
    Input,
    Card,
    Space,
    Spin,
    Table,
    Select,
} from "antd";
// import Phone_icon  from "../../images/phone_icon.svg"
import Phone_icon from "../../images/phone_icon.svg"
import Aadhar_icon from "../../images/aadhar_icon.svg"
import Pan_icon from "../../images/bank_icon.svg"
import { Route, Link, Routes, useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FcApproval } from "react-icons/fc";
import { TbRefresh } from "react-icons/tb";
import ApiCall from "../../helpers/apicall";
import {textCapitalize} from "../../DataServices/Utils"
import SelectField from "../../components/ui/selectField";
import {
    cookies,
    isInvalidEmail,
    isInvalidName,
    number,
    specialChars,
    uppercase,
    lowercase,
    toastError,
    toastSuccess,
    Toaster,
    passwordValidations,
    showDate,
    getIsoString,
    showError,
    showSuccess,
} from "../../helpers/Utils";
import { LoadingOutlined } from "@ant-design/icons";
import {
    farmerDetail,
    farmerList,
    farmerPanverify,
    farmerPhoneVerify,
    farmerRegister,
    farmersAdhaarCaptcha,
    farmersAdhaarInitiate,
    farmersAdhaarPhoneNumber,
    farmerUpdate,
    farmerBankverify,
} from "../../store/actions/farmerList";

function AddEditFarmer() {
    const { TextArea } = Input;
    const history = useHistory();
    const dispatch = useDispatch();
    const params = useParams();
    const { Option } = Select;

    const [verifyPhoneNumber, setVerifyPhoneNumber] = useState(false);
    const [verifyModal, setVerifyModal] = useState(false);
    const [stateName, setStateName] = useState([]);
    const [cityName, setCityName] = useState([]);
    const [state, setState] = useState({
        name: "",
        email: "",
        phone: "",
        add_line_1: "",
        add_line_2: "",
        zipcode: "",
        city: "",
        farm_state: "",
        country: "",
        phone: "",
        aadhar: "",
        // phone_Otp: "",
        aadhar_Otp: "",
        // transaction_id: "",
        // getCaptchaimage: "",
        // adhaar_number: "",
        // send_captcha: "",
        farmer_id: "",
        adhaar: true,
        adhaar_success: false,
        // adhaar_phone_number: "",
        aadhaar_status: "",
        adhar_status: false,
        phone_number: "",
        // pan_number: "",
        // pan_image: "",
        phoneNumber_verify: "",
        verified_phone_number: "",
        verified_adhaar_number: "No Data",
        verified_pan_number: "",
        verified_bank_number: "No Data",
        pan: false,
        checkbox: true,
        checkbox_Pan: false,
        bank_approval_status: "",
        bankVerify: false,
        // bankacc_num: "",
        // bankacc_ifsc: "",
        // bankacc_name: "",
        bankacc_type: "",
    });

    const [phoneVerify, setphoneVerify] = useState({
        phone_Otp: "",
    });
    const [AadhaarInitiate, setAadhaarInitiate] = useState({
        transaction_id: "",
        getCaptchaimage: "",
        phone_number: "",
    });
    const [adhaarNumber, setadhaarNumber] = useState({
        adhaar_number: "",
    });
     const [aadharCaptcha,setaadharCaptcha] = useState({
        send_captcha:''
      })
    const [aadharphoneverify, setaadharphoneverify] = useState({
        adhaar_phone_number: "",
    });
    const [panDetailsVerify, setpanDetailsVerify] = useState({
        pan_number: "",
        pan_image:"",
    });
    const [bankDetails, setbankDetails] = useState({
        bankacc_num: "",
        bankacc_ifsc: "",
        bankacc_name: "",
    });
    
    const back = () => {
        history.push("/farmers");
    };
    const checkOnPanchange = (event) => {
        setState({ ...state, checkbox_Pan: event.target.checked });
    };
    const checkOnchange = (event) => {
        setState({ ...state, checkbox: event.target.checked });
    };
    useEffect(() => {
        if (params.id) {
            handleTable();
        }
        cityList();
        stateList();
    }, []);
    const handleTable = () => {
        dispatch(
            farmerDetail(params.id, (result) => {

                if (result) {
                    let data = result?.farmer;
                    // setLoading(true);
                    // let address = data?.address;
                    let billing = data?.address?.billing;

                    let phone = data?.phone?.national_number;
                    let documents = data?.documents;

                    setState({
                        ...state,
                        name: data?.name?.full || "",
                        email: data?.email || "",
                        phone: phone ?? "Not verified",
                        phone_number: data?.phone?.is_verified || "",
                        aadhaar_status: documents?.aadhar?.status || "",
                        verified_adhaar_number: documents?.aadhar?.number ?? "Not Verified",
                        pan_status: documents?.pan?.status || "",
                        bank_approval_status: data?.bank_approval_status || "",
                        verified_pan_number: documents?.pan?.number ?? "Not Verified",
                        verified_bank_number: data?.bank_info?.acc_no ?? "Not Verified",
                        add_line_1: billing?.line_1?? "",
                        // add_line_2: billing?.line_2 || "",
                        zipcode: billing?.zipcode ?? "",
                        city: billing?.city?.name ?? "",
                        farm_state: billing?.state?.name ?? "",
                        country: billing?.country?.name ?? "",
                        merchant_id: data.merchant_id ??"",
                        farmer_id: data.farmer_id ??"",
                    });
                }
            })
        );
    };

    // Phone Verify
    const validatePhoneOtp = () => {
        let { phone } = state;
        let { phone_Otp } = phoneVerify;
        if (phone === "" || phone === null) {
            toastError("Please enter the OTP");
        } else {
            let phoneOtp_Data = {
                phone: {
                    national_number: phone,
                },
                phone_otp: phone_Otp,
            };
            dispatch(
                farmerPhoneVerify(phoneOtp_Data, (result) => {
                   
                    if (result) {
                        setphoneVerify(
                            {
                                ...phoneVerify,
                                phone_Otp: ""
                            }
                        )
                        handleTable();
                        setVerifyPhoneNumber(false);
                        setVerifyModal(true);
                        AhdaarInitial();
                    } else {
                        setVerifyPhoneNumber(true);
                        setVerifyModal(false);
                    }
                })
            );
        }
    };

    //Get Aadhar Initiate
    const AhdaarInitial = () => {
        const { aadhaar_status } = state;
     
        dispatch(
            farmersAdhaarInitiate((result) => {
                if (result) {
                    
                    setAadhaarInitiate({
                        ...AadhaarInitiate,
                        transaction_id: result.initiation_transaction_id,
                        getCaptchaimage: "data:image/png;base64, " + result.captchaImage,
                        phone_number: true
                    });
                }
            })
        );
    };

    //Post Aadhar Captcha
    const adhaarNumberSubmit = () => {
        const {farmer_id } = state;
        const{adhaar_number,send_captcha} = adhaarNumber;
        const{transaction_id} =AadhaarInitiate;
        if (adhaar_number === "" || adhaar_number === null) {
            toastError("Please enter the adhaar number");
        } else if (send_captcha === "" || send_captcha === null) {
            toastError("Please enter the image captcha");
        } else {
            let data = {
                aadhaar_number: adhaar_number,
                captcha: send_captcha,
                farmer_id: farmer_id,
                initiation_transaction_id: transaction_id,
            };

            dispatch(
                farmersAdhaarCaptcha(data, (result) => {
                   
                    if (result) {
                        // Manual verify
                        // setState({ ...state, adhaar: false });
                        setState({ ...state, adhaar_success: true })
                        handleTable();
                    } else {
                        // Manual verify
                        setState({ ...state, adhaar_success: false, adhar_status: false })
                    }
                })
            );
        }
    };
    //Aadhar OTP verify
    const adhaarPhoneNumberSubmit = () => {
        const {farmer_id, adhaar_success } =
            state;
            const{adhaar_phone_number}=aadharphoneverify;
            const{adhaar_number} = adhaarNumber;
            const{transaction_id} =AadhaarInitiate;

        if (adhaar_phone_number === "" || adhaar_phone_number === null) {
            toastError("Please Enter phone number OTP");
        } else {
            let data = {
                aadhaar_number: adhaar_number,
                otp: adhaar_phone_number,
                farmer_id: farmer_id,
                initiation_transaction_id: transaction_id,
            };
            
            dispatch(
                farmersAdhaarPhoneNumber(data, (result) => {
                    
                    if (result) {
                        setState({ ...state, adhaar_success: true });
                        handleTable();
                    } else {
                        toastError(result.message);
                    }
                })
            );
        }
    };

    //Reload Captcha
    const reloadCaptcha = () => {
        AhdaarInitial();
    };

    // Pan Verify

    const panCardsubmit = () => {
        const {farmer_id, merchant_id } = state;
        const{pan_number,pan_image} =panDetailsVerify;
        var queryParams =
            "/" +
            farmer_id +
            "?id=" +
            merchant_id +
            "&upload_from=agri&upload_for=pan";

        if (pan_number === "" || pan_number === null) {
            toastError("Please enter the pan card number");
        } else if (
            pan_image === "" ||
            pan_image === null ||
            pan_image === undefined
        ) {
            toastError("Please upload the pancard image");
        } else {
            let formData = new FormData();
            formData.append("uploadFile", pan_image);
            formData.append("pan_number", pan_number);
            formData.append("need_ippopay_card", state.checkbox_Pan);
           

            dispatch(
                farmerPanverify(queryParams, formData, (result) => {
                    if (result) {
                       
                        setState({ ...state, pan: true });
                        handleTable();
                    } else {
                        setState({ ...state, pan: false });
                    }
                })
            );
        }
    };

    //Bank API Validation
    const bankSubmit = () => {
        const { bankacc_num, bankacc_ifsc, bankacc_name, } = bankDetails;
        var queryParams =
            "/" +
            farmer_id;
        if (bankacc_num === "" || bankacc_num === null) {
            toastError("Please enter the Bank Number");
        }
        else if (bankacc_name === "" || bankacc_name === null) {
            toastError("Please enter the Bank HolderName");
        }
        else if (bankacc_ifsc === "" || bankacc_ifsc === null) {
            toastError("Please enter the Bank Number");
        }
        else {
            let data = {
                bank_info: {
                    acc_holder_name: bankacc_name,
                    acc_no: bankacc_num,
                    ifsc: bankacc_ifsc,
                }
            };

            dispatch(
                farmerBankverify(queryParams, data, (result) => {
                   
                    if (result) {
                        // Manual verify
                        // setState({ ...state, adhaar: false });
                        setState({ ...state, bankVerify: true });
                        handleTable();
                    } else {
                        // Manual verify
                        setState({ ...state, bankVerify: false })

                    }
                })
            );
        }

    };
    const uploadImage = async (event) => {
        const file = event.target.files[0];
       
        setpanDetailsVerify({ ...panDetailsVerify, pan_image: file });
    };

    // //Input Handler
    // const handleOnInputChange = (event) => {
    //     setState({
    //         ...state,
    //         [event.target.name]: event.target.value,
    //     });
    // };
    // const handleChangeAadhar = (event) => {
    //     setState({
    //         ...state,
    //         [event.target.name]: event.target.value,
    //     });
    // };

    const handleChange = (e) => {
        setState((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };
    const handleAdharChangeNumber =(e)=>{
        let REGEX = /^\d+$/;
        if (e.target.value === "" || REGEX.test(e.target.value)) {
            setadhaarNumber(prevState => ({
                ...prevState,
                [e.target.name]: e.target.value
            }))
        }
    }
    const handleAdharCaptcha =(e)=>{
        setaadharCaptcha(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }
    const handleBankChange =(e) =>{
        setbankDetails((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    }
    // const handleAadhaarChange =(e) =>{
    //     setadhaarNumber((prevState) => ({
    //         ...prevState,
    //         [e.target.name]: e.target.value,
    //     }));
    // }
    const handleChangeNumber = (e) => {
        let REGEX = /^\d+$/;
        if (e.target.value === "" || REGEX.test(e.target.value)) {
            setState((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }));
        }
    };
    const handlePhoneChangeNumber = (e) => {
        let REGEX = /^\d+$/;
        if (e.target.value === "" || REGEX.test(e.target.value)) {
            setphoneVerify((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }));
        }
    };
    const handleAadharChangeNumber = (e) => {
        let REGEX = /^\d+$/;
        if (e.target.value === "" || REGEX.test(e.target.value)) {
            setaadharphoneverify((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }));
        }
    };
    const handlePanChangeNumber = (e) => {
        setpanDetailsVerify((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };
    const handleBankChangeNumber = (e) => {
        let REGEX = /^\d+$/;
        if (e.target.value === "" || REGEX.test(e.target.value)) {
            setbankDetails((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }));
        }
    };

    const stateList = () => {
        ApiCall.get('properties/state/list', (response) => {
            if (response.success) {
               
                setStateName(response?.data?.states)
            }
        })
    }

    const cityList = () => {
        ApiCall.get('properties/city/list', (response) => {
            if (response.success) {
                
                setCityName(response?.data?.cities)
            }
        })
    }
    const createFarmer = () => {
        const {
            name,
            email,
            phone,
            add_line_1,
            add_line_2,
            zipcode,
            city,
            farm_state,
            country,
            checkbox,
        } = state;

        if (name === "" || name === null) {
            toastError("Please enter the farmer name");
        } else if (name.length < 3) {
            toastError("Please enter the farmer owner name minimum 3 characters");
        } else if (isInvalidName(name)) {
            toastError("Please enter the farmer owner name in alphabets only");
        } else if (add_line_1 === "" || add_line_1 === null) {
            toastError("Please enter the address");
            // } else if (add_line_2 === "" || add_line_2 === null) {
            //     toastError("Please enter the street address");
        } else if (phone === "" || phone === null) {
            toastError("Please enter the phone number");
        } else if (phone.length > 10 || phone.length < 10) {
            toastError("Please enter the phone number in 10 digits");
        } else if (city === "" || city === null) {
            toastError("Please select the city");
            // } else if (country === "" || country === null) {
            //     toastError("Please select the country");
        }
        // else if (email === "" || email === null) {
        //     toastError("Please enter the email address");
        // } 
        else if (email !== "" && isInvalidEmail(email)) {
            toastError("Please enter the valid email address");
        }
        else if (zipcode === "" || zipcode === null) {
            toastError("Please enter the zipcode");
        } else if (farm_state === "" || farm_state === null) {
            toastError("Please select the state");
        } else if (farm_state === "" || farm_state === null) {
            toastError("Please select the state");
        } else if (farm_state === "" || farm_state === null) {
            toastError("Please select the state");
        } else {
            let billing = {
                line_1:textCapitalize(add_line_1),
                
                zipcode: zipcode,
                city: {
                    name:textCapitalize(city),
                },
                state: {
                    name:textCapitalize(farm_state),
                },
               
            };
            let data = {
                name: {
                    full:textCapitalize(name),
                },
                phone: {
                    national_number: phone,
                },
                email: email,
                address: {
                    billing,
                    is_same_billing: checkbox,
                },
            };
            if (params.id) {
                dispatch(
                    farmerUpdate(params.id, data, (result) => {
                        if (result) {
                            // toastSuccess(result.message);
                            history.push(`/farmers`);
                        }
                        //  else {
                        //     toastError(result.message);
                        // }
                    })
                );
            } else {
                dispatch(
                    farmerRegister(data, (result) => {
                        if (result) {
                            // toastSuccess(result.message);
                            setVerifyPhoneNumber(true);
                            
                            setState({
                                ...state,
                                farmer_id: result.farmer.farmer_id,
                                aadhaar_status: result.farmer.documents.aadhar.status,
                                merchant_id: result.farmer.merchant_id,
                            });
                            history.push(`/farmers/edit/${result.farmer.farmer_id}`);
                            setVerifyPhoneNumber(true);
                        } 
                        // else {
                        //     toastError(result.message);
                        // }
                    })
                );
            }
        }
    };

    // Widget

    const panVerifyModal = () => {
        const { aadhaar_status } = state;
        if (aadhaar_status !== 'approved') {
            AhdaarInitial();
        }

        setVerifyModal(true);


    }
    const bankVerifyModal = () => {
        const { aadhaar_status } = state;
        if (aadhaar_status !== 'approved') {
            AhdaarInitial();
        }

        setVerifyModal(true);


    }
    const phoneVerifyModal = () => {
        const { phone_number } = state;
        if (phone_number) {
            validatePhoneOtp()
        }
        setVerifyPhoneNumber(true);

    }
    const aadhaarVerifyModal = () => {
        const { aadhaar_status } = state;
        if (aadhaar_status !== 'approved') {
            AhdaarInitial();
        }
        setVerifyModal(true);

    }

    const cancelVerifyModal = () => {
        setVerifyModal(false);

        setaadharphoneverify({
            ...aadharphoneverify,
            adhaar_phone_number: "",
            // pan_image: "",
        })
        setadhaarNumber({
            ...adhaarNumber,
        })
        setaadharCaptcha({
            ...aadharCaptcha,
            send_captcha:"",
        })
        setpanDetailsVerify({
            pan_image:"",
        })
    }
    const cancelVerifyphoneModal = () => {
        setVerifyPhoneNumber(false);
        setState({
            ...state,
            phone_Otp: ""

        })
    }

    const success = <svg className="checkmark check_success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle check_success" cx="26" cy="26" r="25" fill="none" /><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>;

    const failed = <svg className="checkmark m-r-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle className="checkmark__circle check_fail" cx="26" cy="26" r="25" fill="none" />
        <path className="checkmark__check" fill="none" d="M16 16 36 36 M36 16 16 36" />;
    </svg>
    const email_label = (<p>Email <span className='email_opt'>(Optional)</span></p>)
    const bank_acc_details = (<Form
        name="basic"
        layout="vertical"
        className=""
        initialValues={{ remember: true }}
        autoComplete="off"
    >
        <div className="flex" style={{ marginTop: 10 }}>

            <Form.Item
                className="business_form_input "
                style={{ width: "100%" }}
                label="Account Number:"
            >
                <Input
                    name="bankacc_num"
                    value={bankDetails.bankacc_num}
                    className="business_input_bank ht-38"
                    onChange={handleBankChangeNumber}
                    placeholder="Enter Account Number"
                />
            </Form.Item>
        </div>
        <div className="flex">
            <Form.Item
                className="business_form_input "

                label="Account Holder Name:"
            >
                <Input
                    name="bankacc_name"
                    value={bankDetails.bankacc_name}
                    className="business_input_bank ht-38"
                    onChange={handleBankChange}
                    placeholder="Enter Account Holder Name"
                />
            </Form.Item>
            {/* <Form.Item
                    className="business_form_input "
                    label="Account Type:"
                >
                    <select
                        value={state.bankacc_type}
                        name="bankacc_type"
                        onChange={handleChange}
                        className="business_select business_bank_select"
                    >
                        <option value="">Select</option>
                        <option value="chennai">Saving</option>
                        <option value="madurai">Current</option>
                    </select>
                </Form.Item> */}
            <Form.Item
                className="business_form_input "
                label="IFSC Code:"
            >
                <div className="input-group">
                    <Input
                        name="bankacc_ifsc"
                        value={bankDetails.bankacc_ifsc}
                        className="business_input_bank ht-38 b_r_0"
                        onChange={handleBankChange}
                        placeholder="Enter IFSC"
                    />
                    {/* <span className="input-group-addon search_clr">
                        <i className="glyphicon glyphicon-search"></i>
                    </span> */}
                </div>
            </Form.Item>
        </div>
        <div onClick={bankSubmit}
            className="container-login100-form-btn p-r-20"

        >
            <a
                className="login100-form-btn btn-primary"
                style={{ cursor: "pointer" }}
            >
                Submit
            </a>
        </div>

    </Form>)
    const { aadhaar_status, adhar_status, adhaar_success, pan_status, farmer_id, verified_adhaar_number, verified_pan_number, phone_number } = state;
    const{adhaar_number} = adhaarNumber;
    const{pan_number,pan_image}=panDetailsVerify;

  
    return (
        <>
            <>
                <Toaster />
                
                <div className="main-content app-content mt-0">
                    <div className="side-app">
                        <div className="container-fluid main-container p-0 ">
                            <div className="business_top">
                                <div className="business_header">
                                    <h4 className="farmer_head">Create Farmer</h4>
                                    <button className='btn btn-primary' type="primary" onClick={() => back()}>Back</button>
                                </div>

                                {farmer_id !== "" && (
                                    <div className="row m-t-30">
                                        <div className="col-xs-12 col-sm-12 col-md-4 ">
                                            <div className="card">
                                                <div className="status-card-body">
                                                    <div className="d-flex">
                                                        <div className="verfy_details">
                                                            <p className="account-verification">Phone Number</p>
                                                            <p className="verification_number">{state.phone}</p>
                                                            <p>{phone_number ? <span className="verify_success_msg">{success}Verified

                                                            </span>
                                                                : <span className="verify_failed_msg" onClick={phoneVerifyModal}>{failed}<button className='btn-xs not_verfy_btn btn btn-danger'>Click to Verify</button>

                                                                </span>}
                                                            </p>
                                                        </div>
                                                        <div className="ms-auto status_icon">
                                                            <img src={Phone_icon} />
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-sm-12 col-md-4">
                                            <div className="card">
                                                <div className="status-card-body">
                                                    <div className="d-flex">
                                                        <div className="verfy_details">
                                                            <p className="account-verification">Aadhaar Number</p>
                                                            <p className="verification_number">{verified_adhaar_number}</p>
                                                            <p>{aadhaar_status === "approved" ? <span className="verify_success_msg">{success}Verified

                                                            </span> : <span className="verify_failed_msg" onClick={phone_number ? aadhaarVerifyModal : phoneVerifyModal}>{failed}<button className='btn-xs not_verfy_btn btn btn-danger'>Click to Verify</button>

                                                            </span>}
                                                            </p>
                                                        </div>
                                                        <div className="ms-auto status_icon">
                                                            <img src={Aadhar_icon} />
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="col-xs-12 col-sm-12 col-md-4 p-r-0">
                                            <div className="card">
                                                <div className="status-card-body">
                                                    <div className="d-flex">
                                                        <div className="verfy_details">
                                                            <p className="account-verification">PAN Card Number</p>
                                                            <p className="verification_number">{verified_pan_number}</p>
                                                            <p>{pan_status === "approved" ? <span className="verify_success_msg">{success}Verified

                                                            </span>
                                                                : <span className="verify_failed_msg" onClick={phone_number ? panVerifyModal : phoneVerifyModal}>{failed}Not Verified

                                                                </span>}
                                                            </p>
                                                        </div>
                                                        <div className="ms-auto status_icon">
                                                            <img src={Pan_icon} />
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div> */}
                                        <div className="col-xs-12 col-sm-12 col-md-4 p-r-0">
                                            <div className="card">
                                                <div className="status-card-body">
                                                    <div className="d-flex">
                                                        <div className="verfy_details">
                                                            <p className="account-verification">Bank Account Number</p>
                                                            <p className="verification_number">{state.verified_bank_number}</p>
                                                            <p>{state.bank_approval_status === "approved" ?
                                                                <span className="verify_success_msg">{success}Verified</span>
                                                                :
                                                                <span className="verify_failed_msg" onClick={phone_number ? bankVerifyModal : phoneVerifyModal}>{failed}<button className='btn-xs not_verfy_btn btn btn-danger'>Click to Verify</button></span>
                                                            }
                                                            </p>
                                                        </div>
                                                        <div className="ms-auto status_icon">
                                                            <img src={Pan_icon} />
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}


                                <div className="business_top agro_card">
                                    <Card>
                                        {/* <ul className="nav nav-pills m-b-30">
                                            <li className="active">
                                                <a data-toggle="pill" href="#section-bar-1">
                                                    Farmer Info
                                                </a>
                                            </li>
                                            {/* <li>
                                                <a data-toggle="pill" href="#section-bar-2">
                                                    Verification
                                                </a>
                                            </li> */}
                                        {/* </ul> */}
                                        <div className="tab-content">
                                            <section
                                                id="section-bar-1"
                                                className="tab-pane fade active in create_input_form"
                                            >
                                                <Form
                                                    name="basic"
                                                    layout="vertical"
                                                    initialValues={{ remember: true }}
                                                    autoComplete="off"
                                                    onKeyPress={(event) => event.key === 'Enter' && createFarmer()}
                                                >
                                                    <div className="flex" style={{ marginTop: 10 }}>
                                                        <Form.Item
                                                            className="business_form_input ant-form-item-required"
                                                            label="Farmer Name"
                                                        >
                                                            <Input
                                                                name="name"
                                                                value={state.name}
                                                                className="business_input"
                                                                onChange={handleChange}
                                                                placeholder="Enter farmer Name"
                                                            />
                                                        </Form.Item>

                                                        <Form.Item
                                                            className="business_form_input ant-form-item-required"
                                                            label="Address"
                                                        >
                                                            <Input
                                                                name="add_line_1"
                                                                value={state.add_line_1}
                                                                className="business_input"
                                                                onChange={handleChange}
                                                                placeholder="Enter Address"
                                                            />
                                                        </Form.Item>


                                                    </div>
                                                    <div className="flex">
                                                        <Form.Item
                                                            className="business_form_input ant-form-item-required"
                                                            label="Contact"
                                                        >
                                                            {params.id ? (<Input

                                                                value={state.phone}
                                                                className="business_input"
                                                                readOnly

                                                            />) : (<Input
                                                                name="phone"
                                                                value={state.phone}
                                                                className="business_input"
                                                                onChange={handleChangeNumber}
                                                                placeholder="Enter Phone Number"
                                                            />)}

                                                        </Form.Item>

                                                        <SelectField value={state.city || undefined} name="city"
                                                            placeholder="Select By" handleChange={(value) => {
                                                                setState({
                                                                    ...state,
                                                                    city: JSON.parse(value).name,
                                                                });
                                                            }} data={cityName} label="City" className="business_form_input ant-form-item-required" selectClass="city_select" />
                                                    </div>
                                                    <div className="flex">
                                                        {/* <Form.Item
                                                            className="business_form_input"
                                                            label="Street"
                                                        >
                                                            <Input
                                                                name="add_line_2"
                                                                value={state.add_line_2}
                                                                className="business_input"
                                                                onChange={handleChange}
                                                                placeholder="Enter Street Address"
                                                            />
                                                        </Form.Item> */}
                                                        <Form.Item
                                                            className="business_form_input"
                                                            label={email_label}
                                                        >
                                                            {params.id ? (<Input
                                                                name="email"
                                                                value={state.email}
                                                                className="business_input"
                                                                readOnly

                                                            />) : (<Input
                                                                name="email"
                                                                value={state.email}
                                                                className="business_input"
                                                                onChange={handleChange}
                                                                placeholder="Enter Email"
                                                            />)}

                                                        </Form.Item>
                                                        <Form.Item
                                                            className="business_form_input ant-form-item-required"
                                                            label="Zip Code"
                                                        >
                                                            <Input
                                                                name="zipcode"
                                                                value={state.zipcode}
                                                                className="business_input"
                                                                onChange={handleChangeNumber}
                                                                placeholder="Enter Zipcode"
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                    <div className="flex">

                                                        <SelectField value={state.farm_state || undefined} name="farm_state"
                                                            placeholder="Select By" handleChange={(value) => {
                                                                setState({
                                                                    ...state,
                                                                    farm_state: JSON.parse(value).name,
                                                                });
                                                            }} data={stateName} label="State" className="business_form_input ant-form-item-required" selectClass="city_select" />

                                                        <Form.Item
                                                            className="business_form_input">
                                                        </Form.Item>
                                                    </div>
                                                    {/* <div className="flex">
                                                        <Form.Item
                                                            className="business_form_input"
                                                            label="Country"
                                                        >
                                                            <select
                                                                value={state.country}
                                                                name="country"
                                                                onChange={handleChange}
                                                                className="business_select"
                                                            >
                                                                <option value="">Select</option>
                                                                <option value="india">India</option>

                                                            </select>
                                                        </Form.Item>
                                                        <Form.Item
                                                            className="business_form_input"></Form.Item>
                                                    </div> */}
                                                    {/* <div className="business_check">
                                                        <input
                                                            type="checkbox"
                                                            name="check"
                                                            checked={state.checkbox}
                                                            style={{ marginRight: 10 }}
                                                            onChange={checkOnchange}
                                                        />{" "}
                                                        Same as billing address
                                                    </div> */}
                                                    <div>
                                                        <button
                                                            type="primary"
                                                            className="cancel_btn btn btn-default"
                                                            style={{ marginRight: "10px" }}
                                                            onClick={() => back()}
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="primary"
                                                            className="create_btn "
                                                            onClick={createFarmer}
                                                        >
                                                            {params.id ? "Update" : "Submit"}
                                                        </button>
                                                    </div>
                                                </Form>
                                            </section>
                                        </div>
                                    </Card>
                                </div>

                                <Modal
                                    visible={verifyPhoneNumber}
                                    // header={false}
                                    onCancel={cancelVerifyphoneModal}
                                    footer={
                                        [<button
                                            type="primary"
                                            className="cancel_btn btn btn-default"
                                            style={{ marginRight: "10px" }}
                                            onClick={cancelVerifyphoneModal}
                                        >
                                            Cancel
                                        </button>]
                                    }
                                    title="Verify Your Phone Number"
                                    className="modal_width"
                                >
                                    <Form
                                        name="basic"
                                        layout="vertical"
                                        initialValues={{ remember: true }}
                                        autoComplete="off"
                                    >
                                        <div className="modal_content">
                                            <h3 className="form-title m-0"> Enter the OTP </h3>
                                            <div className="input-group form_modal_input">
                                                <span className="input-group-addon b-r-1 text-muted">
                                                    <i
                                                        className="fa fa-key text-muted"
                                                        aria-hidden="true"
                                                    ></i>
                                                </span>
                                                <input
                                                    className="input100 form-control b-l-0 form-box"
                                                    placeholder="Enter OTP"
                                                    type="password"
                                                    value={phoneVerify.phone_Otp}
                                                    name="phone_Otp"
                                                    onChange={handlePhoneChangeNumber}
                                                />{" "}
                                            </div>

                                            <div
                                                className="container-login100-form-btn m-b-15"
                                                onClick={validatePhoneOtp}
                                            >
                                                <a
                                                    className="login100-form-btn btn-success"
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    Submit
                                                </a>
                                            </div>
                                        </div>
                                    </Form>
                                </Modal>
                                <Modal
                                    visible={verifyModal}
                                    width="40%"
                                    onCancel={cancelVerifyModal}
                                    footer={[
                                        [<button
                                            type="primary"
                                            className="cancel_btn btn btn-default"
                                            style={{ marginRight: "10px" }}
                                            onClick={cancelVerifyModal}
                                        >
                                            Close
                                        </button>]
                                    ]}
                                    title="Verify Your Account Details"
                                >
                                    <Form
                                        name="basic"
                                        layout="vertical"
                                        initialValues={{ remember: true }}
                                        autoComplete="off"
                                    >
                                        <div style={{ marginTop: 10 }}>
                                            <div>
                                                {adhar_status || adhaar_success || aadhaar_status === 'approved' ? (
                                                    <div>
                                                        <p className="pan_desc m-b-10">
                                                            Aadhaar Number: {verified_adhaar_number}
                                                        </p>
                                                        <h4 className="verify_succ  m-b-20">{success}Verified</h4>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <h3 className="form-title m-0">
                                                            {" "}
                                                            Enter your Aadhaar number{" "}
                                                        </h3>
                                                        <div className="input-group form_modal_input">
                                                            <span className="input-group-addon b-r-1 text-muted">
                                                                <i
                                                                    className="fa fa-id-card text-muted"
                                                                    aria-hidden="true"
                                                                ></i>
                                                            </span>
                                                            <input
                                                                className="input100 form-control b-l-0 form-box"
                                                                placeholder="Enter Aadhar Number"
                                                                type="text"
                                                                value={adhaar_number}
                                                                name="adhaar_number"
                                                                onChange={handleAdharChangeNumber}
                                                            />
                                                        </div>

                                                        {state.adhaar ? (
                                                            <div className="captcha_cont">
                                                                <div className="adhaar_captcha">
                                                                    <div className="adhaar_captcha_image">
                                                                        <img
                                                                            src={AadhaarInitiate.getCaptchaimage}
                                                                            alt="Captcha"
                                                                            width="300px"
                                                                            height="30px"
                                                                        />
                                                                    </div>
                                                                    <div className="adhaar_captcha_reload">
                                                                        <TbRefresh
                                                                            onClick={reloadCaptcha}
                                                                            style={{ cursor: "pointer" }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <input
                                                                        className="input100 form-control  form-box"
                                                                        placeholder="Enter Valid Captcha"
                                                                        type="text"
                                                                        value={adhaarNumber.send_captcha}
                                                                        name="send_captcha"
                                                                        onChange={handleAdharCaptcha}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <h3 className="form-title m-0"> Enter OTP </h3>
                                                                <div className="input-group form_modal_input">
                                                                    <span className="input-group-addon b-r-1 text-muted">
                                                                        <i
                                                                            className="fa fa-phone text-muted"
                                                                            aria-hidden="true"
                                                                        ></i>
                                                                    </span>
                                                                    <input
                                                                        className="input100 form-control b-l-0 form-box"
                                                                        placeholder="OTP"
                                                                        type="text"
                                                                        value={aadharphoneverify.adhaar_phone_number}
                                                                        name="adhaar_phone_number"
                                                                        onChange={handleAadharChangeNumber}
                                                                    />
                                                                </div>
                                                            </>
                                                        )}

                                                        {state.adhaar ? (
                                                            <div
                                                                className="container-login100-form-btn"
                                                                onClick={adhaarNumberSubmit}
                                                            >
                                                                <a
                                                                    className="login100-form-btn btn-primary"
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    Submit
                                                                </a>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className="container-login100-form-btn"
                                                                onClick={adhaarPhoneNumberSubmit}
                                                            >
                                                                <a
                                                                    className="login100-form-btn btn-primary"
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    Send
                                                                </a>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                            {/* <div
                                                className="pan_checkbox"
                                                style={{ marginTop: "20px", marginBottom: "10px" }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    name="check"
                                                    checked={state.checkbox_Pan}
                                                    onChange={checkOnPanchange}
                                                />{" "}
                                                <span className="pan_desc">
                                                    Do you want Ippopay Card
                                                </span>
                                            </div>
                                            {state.checkbox_Pan ? (
                                                <div style={{ marginTop: 10 }}>
                                                    {state.pan || pan_status === 'approved' ? (
                                                        <div>
                                                            <p className="pan_desc  m-b-10">
                                                                PAN Card Number: {verified_pan_number}
                                                            </p>
                                                            <h4 className="verify_succ  m-b-20">{success}Verified</h4>


                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div>
                                                                <h3 className="form-title m-0">
                                                                    {" "}
                                                                    Enter your PAN Card number{" "}
                                                                </h3>
                                                                <div className="input-group form_modal_input">
                                                                    <span className="input-group-addon b-r-1 text-muted">
                                                                        <i
                                                                            className="fa fa-id-card text-muted"
                                                                            aria-hidden="true"
                                                                        ></i>
                                                                    </span>
                                                                    <input
                                                                        className="input100 form-control b-l-0 form-box"
                                                                        placeholder="Enter PAN Card Number"
                                                                        type="text"
                                                                        value={pan_number}
                                                                        name="pan_number"
                                                                        onChange={handlePanChangeNumber}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div style={{ marginTop: 15 }}></div>
                                                            <div className="pan_cont">
                                                                <div className="imge_container">
                                                                    <div className="fileUploadInput">
                                                                        <label className="pan_desc">Upload PAN Card Image</label>

                                                                        <div className="file-upload-wrapper-pan" onChange={
                                                                            uploadImage
                                                                        }>{state.pan_image ? state.pan_image.name : "Upload Your PAN"}
                                                                            <input name="file-upload-field" type="file" className="file-upload-field" />
                                                                        </div>

                                                                    </div>

                                                                </div>
                                                            </div>

                                                            <div
                                                                className="container-login100-form-btn "
                                                                onClick={panCardsubmit}
                                                            >
                                                                <a
                                                                    className="login100-form-btn btn-primary"
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    Submit
                                                                </a>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ) : (
                                                ""
                                            )} */}
                                            {state.bankVerify || state.bank_approval_status === "approved" ?

                                                <>
                                                    <p className="pan_desc m-b-10">Bank Account Number: {state.verified_bank_number} </p>
                                                    <h4 className="verify_succ  m-b-20">{success}Verified</h4>
                                                </>
                                                :
                                                <div className="m-t-24">
                                                    <h3 class="form-title m-0 m-b-15">Add Bank Account </h3>
                                                    {bank_acc_details}
                                                </div>

                                            }
                                        </div>
                                    </Form>
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </>
    );
}

export default AddEditFarmer;
