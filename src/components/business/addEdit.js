import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Card, Select } from 'antd';
import { useParams, useHistory, } from 'react-router-dom';
import { bussinessDetails, businessUpdate } from '../../store/actions/businessList';
import ApiCall from "../../helpers/apicall";

import { useDispatch, useSelector } from 'react-redux';
import { isInvalidEmail, isInvalidName, toastError, toastSuccess, Toaster } from '../../helpers/Utils';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { businessList, businessRegister, businessAdhaarInitiate, businessPhonenumber, businessGSTverify, businessPanverify, businessAdhaarCaptcha, businessAdhaarPhoneNumber } from '../../store/actions/businessList';
// import  phone_icon from "../../images/"
import Phone_icon from "../../images/phone_icon.svg"
import Aadhar_icon from "../../images/aadhar_icon.svg"
import Pan_icon from "../../images/bank_icon.svg"
import Gst_icon from "../../images/gst_icon.svg"
import { TbRefresh, } from "react-icons/tb";
import { textCapitalize, } from "../../helpers/Utils"
import SelectField from "../../components/ui/selectField";


function BusinessDetail() {
    const { TextArea } = Input;
    const history = useHistory()
    const dispatch = useDispatch();
    const params = useParams();
    const { Option } = Select;

    const file = document.getElementById('upload');
    const [state, setState] = useState({
        name: "",
        email: "",
        phone: "",
        business_owner: "",
        bill_add_1: "",
        bill_add_2: "",
        bill_zipcode: "",
        bill_city: "",
        bill_state: "",
        bill_country: "",
        ship_add_1: "",
        ship_add_2: "",
        ship_zipcode: "",
        ship_city: "",
        ship_state: "",
        ship_country: "",
        checkbox: true,
        // phonenumber_otp: "",
        transaction_id: "",
        image_captcha: "",
        gst_number: "",
        pan_number: "",
        adhaar_phone_number: "",
        adhaar: true,
        pan_image: "",
        image: "",
        transaction_id: "",
        business_id: "",
        aadhar_status: "",
        merchant_id: "",
        gst: false,
        pan: false,
        adhaar_success: false,
        aadhaar_status: "",
        adhar_status: false,
        pan_status: "",
        gst_status: "",
        gst_number1: "",
        phoneNumber_verify: "",
        phoneVerify: "",
        verified_adhaar_number: "",
        verified_pan_number: "",
    })
    let [loading, setLoading] = useState(false);
    const [verifyModal, setVerifyModal] = useState(false);
    const [verifyPhoneNumber, setVerifyPhoneNumber] = useState(false);
    const [stateName, setStateName] = useState([]);
    const [cityName, setCityName] = useState([]);

    const [adharInitial, getAdharInitial] = useState({
        transaction_id: "",
        image: "",
        phoneNumber_verify: "",
        phoneVerify: "",

    });

    const [phoneOtp, setPhoneOtp] = useState({
        phonenumber_otp: "",
        phone: "",

    });

    const [GstVerify, setGstVerify] = useState({
        gst_number: "",
    })

    const [pancard, setPancard] = useState({
        pan_number: '',
        pan_image: "",
    })

    const [adharPhoneNumber, setAdharPhoneNumber] = useState({
        adhaar_phone_number: ""
    })
    const [adharNumber, setAdharNumber] = useState({
        adhaar_number: "",
    })
    const [aadharCaptcha, setaadharCaptcha] = useState({
        image_captcha: ''
    })

    useEffect(() => {
        if (params.id) {
            handleTable();
        }


        stateList();
        cityList();
    }, [])


    const AhdaarInitial = () => {
        const { aadhar_status } = state;

        dispatch(businessAdhaarInitiate((result) => {
            if (result) {


                setState({ ...state, transaction_id: result.initiation_transaction_id, image: "data:image/png;base64, " + result.captchaImage, phoneNumber_verify: true })

                getAdharInitial({ ...state, transaction_id: result.initiation_transaction_id, image: "data:image/png;base64, " + result.captchaImage, phoneNumber_verify: true })

            }
        }))
    }


    const checkOnchange = (event) => {
        setState({ ...state, checkbox: event.target.checked })
    }
    const handleTable = () => {
        dispatch(bussinessDetails(params.id, (result) => {

            if (result) {

                var data = result?.business;
                let billing = data?.address?.billing;
                let shipping = data?.address?.shipping;
                let address = data?.address;
                let check = address?.is_same_billing === false;
                let documents = data?.documents;
                let gst = data?.business?.gst;
                let gst_num = gst?.number || "";

                let owner = data?.name?.full || '';
                let phone = data?.phone?.national_number ?? "Not Verified";


                setLoading(true);
                setState({
                    ...state,
                    name: data?.business?.name ?? '',
                    aadhaar_status: documents?.aadhar?.status ?? '',
                    pan_status: documents?.pan?.status ?? '',
                    pan_number1: documents?.pan?.number ?? '',
                    gst_status: gst?.status ?? '',
                    verified_gst_number: gst?.number ?? 'Not Verified',
                    verified_adhaar_number: documents?.aadhar?.number ?? "Not Verified",
                    verified_pan_number: documents?.pan?.number ?? "Not Verified",
                    email: data?.email ?? '',
                    phone: phone ?? 'Not Verified',
                    phoneNumber_verify: data?.phone?.is_verified ?? '',
                    business_owner: owner || '',
                    bill_add_1: billing?.line_1 ?? '',
                    bill_add_2: billing?.line_2 ?? '',
                    bill_zipcode: billing?.zipcode ?? '',
                    bill_city: billing?.city?.name ?? '',
                    bill_state: billing?.state?.name ?? '',
                    bill_country: billing?.country?.name ?? '',
                    checkbox: address?.is_same_billing ?? '',
                    ship_add_1: check && (shipping?.line_1) || '',
                    ship_add_2: check && (shipping?.line_2) || '',
                    ship_zipcode: check && (shipping?.zipcode) || '',
                    ship_city: check && (shipping?.city?.name) || '',
                    ship_state: check && (shipping?.state?.name) || '',
                    ship_country: check && (shipping?.country?.name) || '',
                    merchant_id: data.merchant_id,
                    business_id: data.business_id,
                })


                setPhoneOtp({
                    ...phoneOtp,
                    phone: phone ?? 'No data',
                })
            }
        }));
    }
    const back = () => {

        history.push('/businesses');

    }

    const antIcon = (
        <LoadingOutlined
            style={{
                fontSize: 24,
            }}
            spin
        />
    );

    const handleChange = (e) => {
        setState(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const handleGstverifyChange = (e) => {
        setGstVerify(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }
    const handleChangePhoneNumber = (e) => {
        setPhoneOtp(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }
    const handlePanNumberChange = (e) => {
        setPancard(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const handleAdharChangeNumber = (e) => {
        let REGEX = /^\d+$/;
        if (e.target.value === "" || REGEX.test(e.target.value)) {
            setAdharNumber(prevState => ({
                ...prevState,
                [e.target.name]: e.target.value
            }))
        }
    }
    const handleAdharCaptcha = (e) => {
        setaadharCaptcha(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }
    const handleChangeNumber = (e) => {
        let REGEX = /^\d+$/;
        if (e.target.value === "" || REGEX.test(e.target.value)) {
            setState(prevState => ({
                ...prevState,
                [e.target.name]: e.target.value
            }))
        }
    }

    const handleAdharPhoneNumberChange = (e) => {
        let REGEX = /^\d+$/;
        if (e.target.value === "" || REGEX.test(e.target.value)) {
            setAdharPhoneNumber(prevState => ({
                ...prevState,
                [e.target.name]: e.target.value
            }))
        }
    }
    const createBusiness = () => {
        const { name, email, phone, business_owner, bill_add_1, bill_add_2, bill_zipcode, bill_city, bill_state, bill_country, ship_add_1, ship_add_2, ship_zipcode, ship_city, ship_state, ship_country, checkbox } = state;

        if (business_owner === "" || business_owner === null) {
            toastError("Please enter the business owner name");
        } else if (business_owner.length < 3) {
            toastError("Please enter the business owner name minimum 3 characters");
        } else if (isInvalidName(business_owner)) {
            toastError("Please enter the business owner name in alphabets only");
        } else if (bill_add_1 === "" || bill_add_1 === null) {
            toastError("Please enter the address")
        } else if (name === "" || name === null) {
            toastError("Please enter the business name");
        } else if (name.length < 3) {
            toastError("Please enter the business name minimum 3 characters");
        } else if (isInvalidName(name)) {
            toastError("Please enter the business name in alphabets only");
        } else if (bill_city === "" || bill_city === null) {
            toastError("Please select the city")
        } else if (phone === "" || phone === null) {
            toastError("Please enter the phone number");
        } else if (phone.length > 10 || phone.length < 10) {
            toastError("Please enter the phone number in 10 digits")
        }
        else if (email === "" || email === null) {
            toastError("Please enter the email address")
        }
        else if (email !== "" && isInvalidEmail(email)) {
            toastError("Please enter the valid email address")
        }
        else if (bill_zipcode === "" || bill_zipcode === null) {
            toastError("Please enter the zipcode")
        }
        else if (bill_state === "" || bill_state === null) {
            toastError("Please select the state")
        } else if (!checkbox && (ship_add_1 === "" || ship_add_1 === null)) {
            toastError("Please enter the flat addresss")
        }

        else if (!checkbox && (ship_city === "" || ship_city === null)) {
            toastError("Please select the city")
        }
        else if (!checkbox && (ship_zipcode === "" || ship_zipcode === null)) {
            toastError("Please enter the zipcode")
        }

        else if (!checkbox && (ship_state === "" || ship_state === null)) {
            toastError("Please select the state")
        }
        else {
            let billing = {
                line_1: bill_add_1,


                zipcode: bill_zipcode,
                city: {
                    name: textCapitalize(bill_city)
                },
                state: {
                    name: textCapitalize(bill_state)
                },

            }

            let shipping = {
                line_1: ship_add_1,


                zipcode: ship_zipcode,
                city: {
                    name: textCapitalize(ship_city)
                },
                state: {
                    name: textCapitalize(ship_state)
                },

            }

            let shipping_same = {
                line_1: bill_add_1,


                zipcode: bill_zipcode,
                city: {
                    name: bill_city
                },
                state: {
                    name: bill_state
                },

            }

            let data = {
                name: {
                    full: textCapitalize(business_owner),
                },
                phone: {
                    national_number: phone,
                },
                email: email,
                business: {
                    name: textCapitalize(name)
                },
                address: {
                    billing,
                    is_same_billing: checkbox,
                    shipping: checkbox ? shipping_same : shipping,
                }
            }


            if (params.id) {
                dispatch(businessUpdate(params.id, data, (result) => {
                    if (result) {
                        toastSuccess(result.message);
                        history.push(`/businesses`)
                    } else {
                        toastError(result.message)
                    }
                }))
            } else {
                dispatch(businessRegister(data, (result) => {


                    if (result) {

                        toastSuccess(result.message);

                        setState({
                            ...state,
                            phone: result?.business?.phone?.national_number ?? "",
                            business_id: result?.business?.business_id ?? "",
                            aadhar_status: result?.business?.documents?.aadhar?.status ?? "",
                            merchant_id: result?.business?.merchant_id ?? "",
                        })

                        setPhoneOtp({ ...phoneOtp, phone: result?.business?.phone?.national_number ?? "" })
                        history.push(`/businesses/AddEdit/${result.business.business_id}`);
                        setVerifyPhoneNumber(true);

                    } else {
                        toastError(result.message)
                    }
                }))
            }
        }
    }

    const createBusinesss = () => {
        // setVerifyPhoneNumber(true);
        setVerifyModal(true)
        AhdaarInitial();

    }

    const phoneNumberOtp = () => {
        const { phonenumber_otp, phone } = phoneOtp;

        if (phonenumber_otp === "" || phonenumber_otp === null) {
            toastError("Please enter the otp")
        } else {
            let data = {
                phone: phone,
                phone_otp: phonenumber_otp,
            }

            dispatch(businessPhonenumber(data, (result) => {

                if (result) {
                    setState({ ...state, phoneVerify: result.success === true })
                    setPhoneOtp({ ...phoneOtp, phoneVerify: result.success === true })
                    setVerifyPhoneNumber(false);
                    setVerifyModal(true);
                    handleTable();
                    AhdaarInitial()

                } else {
                    setVerifyPhoneNumber(true);
                    setVerifyModal(false)
                }

            }))


        }
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    const gstVerify = () => {
        const { gst_number } = GstVerify;
        const { business_id } = state;

        if (gst_number === "" || gst_number === null) {
            toastError("Please enter the GST number")
        } else {
            let data = {
                gst_number,
                business_id: business_id
            }
            dispatch(businessGSTverify(data, (result) => {
                if (result) {
                    setState({ ...state, gst: true })
                    handleTable();
                } else {
                    setState({ ...state, gst: false })

                }
            }))
        }
    }

    const panCardsubmit = () => {
        const { business_id, merchant_id, pan } = state;
        const { pan_number, pan_image } = pancard;

        var queryParams = "/" + business_id + "?id=" + merchant_id + "&upload_from=agri&upload_for=pan";

        if (pan_number === "" || pan_number === null) {
            toastError("Please enter the pan card number")
        } else if (pan_image === "" || pan_image === null || pan_image === undefined) {
            toastError("Please upload the pancard image")
        } else {
            let formData = new FormData();
            formData.append('uploadFile', pan_image);
            formData.append('pan_number', pan_number);

            dispatch(businessPanverify(queryParams, formData, (result) => {
                if (result) {

                    setState({ ...state, pan: true })
                    handleTable();
                } else {
                    setState({ ...state, pan: false })
                }
            }))
        }
    }

    const reloadCaptcha = () => {
        AhdaarInitial();
    }

    const adhaarPhoneNumberSubmit = () => {
        const { business_id, transaction_id, adhaar_number, adhaar_success, aadhaar_status, pan_status, gst_status } = state;
        const { adhaar_phone_number } = adharPhoneNumber;



        if (adhaar_phone_number === "" || adhaar_phone_number === null) {
            toastError("Please Enter phone number OTP")
        } else {
            let data = {
                aadhaar_number: adhaar_number,
                otp: adhaar_phone_number,
                business_id: business_id,
                initiation_transaction_id: transaction_id
            }
            dispatch(businessAdhaarPhoneNumber(data, (result) => {
                if (result) {

                    setState({ ...state, adhaar_success: true })
                    handleTable();
                } else {
                    toastError(result.message)

                }
            }))
        }
    }

    const adhaarNumberSubmit = () => {
        const { business_id, transaction_id } = state;
        const { adhaar_number, image_captcha } = adharNumber;

        if (adhaar_number === "" || adhaar_number === null) {
            toastError("Please enter the adhaar number")
        } else if (image_captcha === "" || image_captcha === null) {
            toastError("Please enter the image captcha")
        } else {
            let data = {
                aadhaar_number: adhaar_number,
                captcha: image_captcha,
                business_id: business_id,
                initiation_transaction_id: transaction_id

            }

            dispatch(businessAdhaarCaptcha(data, (result) => {

                if (result) {
                    setState({ ...state, adhaar_success: true })
                    handleTable();
                    // setState({ ...state, adhaar: false, })
                } else {
                    setState({ ...state, adhaar_success: false, adhar_status: false })



                }
            }))
        }
    }

    const uploadImage = async (event) => {

        const file = event.target.files[0];
        // setState({ ...state, pan_image: file })
        setPancard({ ...pancard, pan_image: file })

    }
    const gstVerifyModal = () => {

        const { aadhaar_status } = state;
        if (aadhaar_status !== 'approved') {
            AhdaarInitial();
        }
        setVerifyModal(true);

    }
    const panVerifyModal = () => {
        const { aadhaar_status } = state;
        if (aadhaar_status !== 'approved') {
            AhdaarInitial();
        }

        setVerifyModal(true);


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

        // setState({
        //     ...state,
        //     image_captcha: "",
        //     adhaar_phone_number: "",
        //     // pan_image: "",
        // })
        setAdharNumber({ ...adharNumber, image_captcha: "" })
        setAdharPhoneNumber({ ...adharPhoneNumber, adhaar_phone_number: "" })
        setaadharCaptcha({ ...aadharCaptcha, image_captcha: "" })
    }

    const phonenumberModal = () => {
        setVerifyPhoneNumber(true)
    }

    const cancelVerifyPhoneNumberModal = () => {
        setVerifyPhoneNumber(false)
        // setState({ ...state, phonenumber_otp: "" })
        setPhoneOtp({ ...phoneOtp, phonenumber_otp: "" })

    }

    const success = <svg className="checkmark check_success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle check_success" cx="26" cy="26" r="25" fill="none" /><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>;

    const failed = <svg className="checkmark m-2-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle className="checkmark__circle check_fail" cx="26" cy="26" r="25" fill="none" />
        <path className="checkmark__check" fill="none" d="M16 16 36 36 M36 16 16 36" />;
    </svg>
    const email_label = (<p>Email</p>)
    const { aadhar_status, adhaar_success, pan, gst, aadhaar_status, pan_status, gst_status, pan_number, business_id, gst_number, gst_number1, pan_number1, phone, phoneNumber_verify, phoneVerify, verified_adhaar_number, verified_pan_number, verified_gst_number, adhar_status } = state;

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

    // const selectName= (<span style={{color:"gray"}}>Select By</span>)
    return (<>

        <>
            <Toaster />
            {/*  */}
            <div className="main-content app-content mt-0" >
                <div className="side-app">
                    <div className="container-fluid main-container p-0 ">
                        <div className="business_top">
                            <div className="business_header">
                                <h4 className="business_head">Create Business</h4>
                                <button className='btn btn-primary' type="primary" onClick={() => back()}>Back</button>
                            </div>
                            {business_id !== "" && (
                                <div className="row m-t-30">
                                    <div className="col-xs-12 col-sm-12 col-md-3">
                                        <div className="card">
                                            <div className="status-card-body">
                                                <div className="d-flex">
                                                    <div className="verfy_details">
                                                        <p className="account-verification">Phone Number</p>
                                                        <p className="verification_number">{phone}</p>
                                                        <p>{phoneNumber_verify ? <span className="verify_success_msg">{success}Verified

                                                        </span>
                                                            : <span className="verify_failed_msg" onClick={phonenumberModal}>{failed}<button className='btn-xs not_verfy_btn btn btn-danger'>Click to Verify</button>
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
                                    <div className="col-xs-12 col-sm-12 col-md-3">
                                        <div className="card">
                                            <div className="status-card-body">
                                                <div className="d-flex">
                                                    <div className="verfy_details">
                                                        <p className="account-verification">Aadhaar Number</p>
                                                        <p className="verification_number">{verified_adhaar_number}</p>
                                                        <p>{aadhaar_status === "approved" ? <span className="verify_success_msg">{success}Verified

                                                        </span> : <span className="verify_failed_msg" onClick={phoneNumber_verify ? aadhaarVerifyModal : phonenumberModal}>{failed}<button className='btn-xs not_verfy_btn btn btn-danger'>Click to Verify</button>

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
                                    <div className="col-xs-12 col-sm-12 col-md-3 p-r-0">
                                        <div className="card">
                                            <div className="status-card-body">
                                                <div className="d-flex">
                                                    <div className="verfy_details">
                                                        <p className="account-verification">PAN Card Number</p>
                                                        <p className="verification_number">{verified_pan_number}</p>
                                                        <p>{pan_status === "approved" ? <span className="verify_success_msg">{success}Verified

                                                        </span>
                                                            : <span className="verify_failed_msg" onClick={phoneNumber_verify ? panVerifyModal : phonenumberModal}>{failed}<button className='btn-xs not_verfy_btn btn btn-danger'>Click to Verify</button>

                                                            </span>}
                                                        </p>
                                                    </div>
                                                    <div className="ms-auto status_icon">
                                                        <img src={Pan_icon} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-12 col-md-3 p-r-0">
                                        <div className="card">
                                            <div className="status-card-body">
                                                <div className="d-flex">
                                                    <div className="verfy_details">
                                                        <p className="account-verification">GST Number</p>
                                                        <p className="verification_number">{verified_gst_number}</p>
                                                        <p>{gst_status === "approved" ? <span className="verify_success_msg">{success}Verified

                                                        </span>
                                                            : <span className="verify_failed_msg" onClick={phoneNumber_verify ? gstVerifyModal : phonenumberModal}>{failed}<button className='btn-xs not_verfy_btn btn btn-danger'>Click to Verify</button>

                                                            </span>}
                                                        </p>
                                                    </div>
                                                    <div className="ms-auto status_icon">
                                                        <img src={Gst_icon} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            )}


                            <div className="business_top agro_card">
                                <Card>
                                    <section className='create_input_form'>
                                        <Form
                                            name="basic"
                                            layout="vertical"

                                            initialValues={{ remember: true }}
                                            autoComplete="off" onKeyPress={(event) => event.key === 'Enter' && createBusiness()}                                            >
                                            <div className="flex" style={{ marginTop: 10 }}>

                                                <Form.Item className="business_form_input ant-form-item-required" label="Business Owner Name" >
                                                    <Input name="business_owner" value={state.business_owner} className="business_input" onChange={handleChange} placeholder="Business Owner Name" />
                                                </Form.Item>
                                                <Form.Item className="business_form_input ant-form-item-required" label="Address">
                                                    <Input name="bill_add_1" value={state.bill_add_1} className="business_input" onChange={handleChange} placeholder="Enter Billing Address" />
                                                </Form.Item>


                                            </div>
                                            <div className="flex">
                                                <Form.Item className="business_form_input ant-form-item-required" label="Business Name">
                                                    <Input name="name" value={state.name} className="business_input" onChange={handleChange} placeholder="Business Name" />
                                                </Form.Item>

                                                <SelectField value={state.bill_city || undefined} name="bill_city"
                                                    placeholder="Select By" handleChange={(value) => {
                                                        setState({
                                                            ...state,
                                                            bill_city: JSON.parse(value).name,
                                                        });
                                                    }} data={cityName} label="City" className="business_form_input ant-form-item-required" selectClass="city_select" />


                                            </div>
                                            <div className="flex">

                                                <Form.Item className="business_form_input ant-form-item-required" label="Contact">
                                                    {params.id ? (<Input name="phone" value={state.phone} className="business_input" readOnly />) : (<Input name="phone" value={state.phone} className="business_input" onChange={handleChangeNumber} placeholder="Phone Number" />)}

                                                </Form.Item>
                                                <Form.Item className="business_form_input ant-form-item-required" label="Zip Code">
                                                    <Input name="bill_zipcode" value={state.bill_zipcode} className="business_input" onChange={handleChangeNumber} placeholder="Billing Zipcode" />
                                                </Form.Item>
                                            </div>




                                            <div className="flex">

                                                <Form.Item
                                                    className="business_form_input ant-form-item-required"
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

                                                <SelectField value={state.bill_state || undefined} name="bill_state"
                                                    placeholder="Select By" handleChange={(value) => {
                                                        setState({
                                                            ...state,
                                                            bill_state: JSON.parse(value).name,
                                                        });
                                                    }} data={stateName} label="State" className="business_form_input ant-form-item-required" selectClass="city_select" />

                                            </div>
                                            <div className="business_check">
                                                <input type="checkbox" name="check" checked={state.checkbox}
                                                    style={{ marginRight: 10 }}

                                                    onChange={checkOnchange}
                                                />  Same as billing address
                                            </div>
                                            {state.checkbox ? ("") : (
                                                <>
                                                    <div className="flex">
                                                        <Form.Item className="business_form_input ant-form-item-required" label="Address">
                                                            <Input name="ship_add_1" value={state.ship_add_1} className="business_input" onChange={handleChange} placeholder="Enter Shipping Address" />
                                                        </Form.Item>

                                                        <SelectField value={state.ship_city || undefined} name="ship_city"
                                                            placeholder="Select By" 
                                                            handleChange={(value) => {
                                                                setState({
                                                                    ...state,
                                                                    ship_city: JSON.parse(value).name,
                                                                });
                                                            }} data={cityName} label="City" className="business_form_input ant-form-item-required" selectClass="city_select" />
                                                            {/* Reference */}
                                                            {/* {submerchantList?.map((submerchant, i) => (
                                                            <Option value={JSON.stringify({ submerchant_id: submerchant.merchant_id, submerchant_name: submerchant.name.full })} key={i}>
                                                                {submerchant.name.full}
                                                            </Option>
                                                        ))} */}
                                                    </div>

                                                    <div className="flex">
                                                        <Form.Item className="business_form_input ant-form-item-required" label="Zip Code">
                                                            <Input name="ship_zipcode" value={state.ship_zipcode} className="business_input" onChange={handleChangeNumber} placeholder="Shipping Zipcode" />
                                                        </Form.Item>


                                                        <SelectField value={state.ship_state || undefined} name="ship_state"
                                                            placeholder="Select By" handleChange={(value) => {
                                                                setState({
                                                                    ...state,
                                                                    ship_state: JSON.parse(value).name,
                                                                });
                                                            }} data={stateName} label="State" className="business_form_input ant-form-item-required" selectClass="city_select" />
                                                    </div>


                                                </>
                                            )}
                                            <div>
                                                <button className="cancel_btn btn btn-default" style={{ marginRight: "10px" }} onClick={() => back()}>Cancel</button>
                                                <button className="create_btn " onClick={createBusiness} >{params.id ? "Update" : "Submit"}</button>

                                            </div>
                                        </Form>
                                    </section>
                                </Card>
                            </div>
                            <Modal
                                visible={verifyModal}
                                width="40%"
                                onCancel={cancelVerifyModal}
                                footer={[
                                    <button
                                        type="primary"
                                        className="cancel_btn btn btn-default"
                                        style={{ marginRight: "10px" }}
                                        onClick={cancelVerifyModal}
                                    >
                                        Close
                                    </button>
                                ]}
                                title="Verify Your Account Details"
                            >
                                <Form
                                    name="basic"
                                    layout="vertical"

                                    initialValues={{ remember: true }}
                                    autoComplete="off">




                                    <div style={{ marginTop: 10 }}>
                                        <div>
                                            {adhar_status || adhaar_success || aadhaar_status === 'approved' ? (
                                                // {adhaar_success  ? (

                                                <div>
                                                    <p className="pan_desc  m-b-10">Aadhaar Number: {adharNumber.adhaar_number}</p>
                                                    <h4 className="verify_succ  m-b-20">{success}Verified</h4>

                                                </div>
                                            ) : (
                                                <>
                                                    <h3 className="form-title m-0"> Enter your Aadhaar number </h3>
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
                                                            value={adharNumber.adhaar_number}
                                                            name="adhaar_number"
                                                            onChange={handleAdharChangeNumber}
                                                        />
                                                    </div>

                                                    {state.adhaar ? (
                                                        <div className="captcha_cont">
                                                            <div className="adhaar_captcha">
                                                                <div className="adhaar_captcha_image">
                                                                    <img src={adharInitial.image} alt="captcha" width="300px" height="30px" />
                                                                </div>
                                                                <div className="adhaar_captcha_reload">
                                                                    <TbRefresh onClick={reloadCaptcha} style={{ cursor: "pointer" }} />
                                                                </div>

                                                            </div>
                                                            <div>
                                                                <input
                                                                    className="input100 form-control  form-box"
                                                                    placeholder="Enter Valid Captcha"
                                                                    type="text"
                                                                    value={adharNumber.image_captcha}
                                                                    name="image_captcha"
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
                                                                    value={adharPhoneNumber.adhaar_phone_number}
                                                                    name="adhaar_phone_number"
                                                                    onChange={handleAdharPhoneNumberChange}
                                                                />
                                                            </div>
                                                        </>

                                                    )}


                                                    {state.adhaar ? (

                                                        <div
                                                            className="container-login100-form-btn"
                                                            onClick={adhaarNumberSubmit}>
                                                            <a
                                                                className="login100-form-btn btn-primary"
                                                                style={{ cursor: "pointer" }} >
                                                                Submit
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="container-login100-form-btn"
                                                            onClick={adhaarPhoneNumberSubmit}>
                                                            <a
                                                                className="login100-form-btn btn-primary"
                                                                style={{ c2ursor: "pointer" }} >
                                                                Send
                                                            </a>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        <div style={{ marginTop: 15 }}>
                                            {pan || pan_status === 'approved' ? (
                                                <div>
                                                    <p className="pan_desc  m-b-10">PAN Card Number: {pan_number1}</p>
                                                    <h4 className="verify_succ m-b-20">{success}Verified</h4>
                                                </div>
                                            ) : (

                                                <>
                                                    <div >
                                                        <h3 className="form-title m-0"> Enter your PAN Card number </h3>
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
                                                                value={pancard.pan_number}
                                                                name="pan_number"
                                                                onChange={handlePanNumberChange}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div style={{ marginTop: 15 }}>

                                                    </div>
                                                    <div className="pan_cont">
                                                        <div className="imge_container">
                                                            <div className="fileUploadInput">
                                                                <label className="pan_desc">Upload PAN Card Image</label>

                                                                <div className="file-upload-wrapper-pan" onChange={
                                                                    uploadImage
                                                                }>{pancard.pan_image ? pancard.pan_image.name : "Upload Your PAN"}
                                                                    <input name="file-upload-field" type="file" className="file-upload-field" />
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>

                                                    {/* <div className="file-upload-wrapper" data-text="Select your file!">
                                                        <input name="file-upload-field" type="file" className="file-upload-field" defaultValue />
                                                    </div> */}
                                                    <div
                                                        className="container-login100-form-btn"
                                                        onClick={panCardsubmit}>
                                                        <a
                                                            className="login100-form-btn btn-primary"
                                                            style={{ cursor: "pointer" }} >
                                                            Submit
                                                        </a>
                                                    </div>


                                                </>
                                            )}
                                        </div>
                                        <div>
                                            {gst || gst_status === 'approved' ? (
                                                <div style={{ marginTop: 15 }}>
                                                    <p className="pan_desc  m-b-10">GST Number: {GstVerify.gst_number}</p>
                                                    <h4 className="verify_succ  m-b-20">{success}Verified</h4>


                                                </div>
                                            ) : (

                                                <>
                                                    <div style={{ marginTop: 15 }}>
                                                        <h3 className="form-title m-0"> Enter your GST number </h3>
                                                        <div className="input-group form_modal_input">
                                                            <span className="input-group-addon b-r-1 text-muted">
                                                                <i
                                                                    className="fa fa-id-card text-muted"
                                                                    aria-hidden="true"
                                                                ></i>
                                                            </span>
                                                            <input
                                                                className="input100 form-control b-l-0 form-box"
                                                                placeholder="Enter GST Number"
                                                                type="text"
                                                                value={GstVerify.gst_number}
                                                                name="gst_number"
                                                                onChange={handleGstverifyChange}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="container-login100-form-btn"
                                                        onClick={gstVerify}>
                                                        <a
                                                            className="login100-form-btn btn-primary"
                                                            style={{ cursor: "pointer" }} >
                                                            Submit
                                                        </a>
                                                    </div>
                                                </>)}
                                        </div>
                                    </div>
                                </Form>
                            </Modal>
                            <div>
                                <Modal
                                    visible={verifyPhoneNumber}
                                    onCancel={cancelVerifyPhoneNumberModal}
                                    footer={[
                                        <button className="cancel_btn btn btn-default" style={{ fontWeight: 'bold' }} onClick={cancelVerifyPhoneNumberModal}>Cancel</button>
                                    ]}
                                    title="Verify Your Phone Number"
                                    className='modal_width'
                                >
                                    <Form
                                        name="basic"
                                        layout="vertical"
                                        initialValues={{ remember: true }}
                                        autoComplete="off">
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
                                                    value={phoneOtp.phonenumber_otp}
                                                    name="phonenumber_otp"
                                                    onChange={handleChangePhoneNumber}
                                                />{" "}
                                            </div>
                                            <div
                                                className="container-login100-form-btn m-b-15"
                                                onClick={phoneNumberOtp}>
                                                <a
                                                    className="login100-form-btn btn-success"
                                                    style={{ cursor: "pointer" }} >
                                                    Submit
                                                </a>
                                            </div>
                                        </div>
                                    </Form>
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

        {/* <>
                
                <div className="main-content app-content mt-0" >
                    <div className="side-app">
                        <div className="container-fluid main-container p-0 ">
                            <div className="business_top">
                                <div className="business_header" style={{ display: 'flex', justifyContent: 'center', marginTop: 150 }}>
                                    <Spin indicator={antIcon} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </> */}


    </>
    );
}

export default BusinessDetail;