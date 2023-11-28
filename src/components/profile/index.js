import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingOutlined, FormOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";

// import imageCompression from "browser-image-compression";

import { myprofile, UploadProfile, addProfile } from '../../store/actions/profile';
import { changePassword } from '../../store/actions/password';
import { toastError, Toaster, passwordValidations, isInvalidName, showDate, toastSuccess } from '../../helpers/Utils';
import { Button, Modal, Form, Input, Card, Space, Spin, Table, Switch } from 'antd';
import uploadImage from "../../images/cloud.png";
import uploadMerchant_logo from "../../images/agri_logo_img.jpg";
import noImage from "../../images/noimage.jpg";
// import { FormInput } from '../component/index';
import 'antd/dist/antd.css'
// var ReactS3Uploader = require("react-s3-uploader");

// var ReactS3Uploader = require("react-s3-uploader");
import InputField from "../../components/ui/InputField";
import Spinner from "../ui/spinner";

function Profile(props) {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    let history = useHistory();
    let profile = useSelector(state => state.myprofile.user)

    const [modal2Visible, setModal2Visible] = useState(false);
    const [logomodal, setlogoModal] = useState(false);

    const [loading, setLoading] = useState(false);
    const [isEnabled, setIsEnabled] = useState(true);
    const [total, setTotal] = useState();
    const [currentPage, setPage] = useState(1)
    const [merchantImage, setMerchantImage] = useState("");
    const [imageLoaded, setImageLoaded] = useState(false);
    const [state, setState] = useState({
        currentPage: 1,
        pageSize: 10,
        total: 0,

        viewDetails: false,


    })
    const [detail, setDetail] = useState({
        name: "",
        email: "",
        phone: "",
        id: "",
        checkbox: "",
    })
    const [password, setPassword] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    })

    const [billingAddress, setBillingAddress] = useState({
        bill_city: "",
        bill_country: "",
        bill_state: "",
        checkbox: "",
    })

    const [shippingAddress, setShippingAddress] = useState({
        ship_city: "",
        ship_country: "",
        ship_state: "",
    })





    useEffect(() => {
        profilelist();

    }, [])

    const profilelist = () => {
        // setTimeout(() => {
        //     setLoading(true);
        // }, 1000)

        dispatch(myprofile((result) => {

            if (result && result.merchant) {
                let merchant = result.merchant;
                let address = merchant.address;

                setLoading(true);

                setMerchantImage(merchant?.image ?? "");

                result && setDetail({
                    ...detail,
                    merchant: merchant,
                    email: merchant?.email ?? "",
                    name: merchant?.name?.full ?? "",
                    phone: merchant?.phone?.national_number ?? "",
                    id: merchant?.merchant_id ?? "",
                    checkbox: address?.is_same_billing ?? "",
                    image: merchant?.image ?? "",
                    GST: merchant?.business?.gst ?? ""
                });

                if (address && address.billing) {
                    let billing = address.billing;
                    setBillingAddress({
                        ...billingAddress,
                        checkbox: address?.is_same_billing || '',
                        bill_city: billing?.city?.name ?? "-",
                        bill_add_1: billing?.line_1 ?? "-",
                        bill_zipcode: billing?.zipcode ?? "-",
                        bill_state: billing?.state?.name ?? "-",
                        bill_country: billing?.country?.name ?? "-",
                    });
                }
                if (address && address.shipping) {
                    let shipping = address.shipping;
                    setShippingAddress({
                        ...shippingAddress,
                        ship_add_1: shipping?.line_1 ?? "-",
                        ship_zipcode: shipping?.zipcode ?? "-",
                        ship_city: shipping?.city?.name ?? "-",
                        ship_state: shipping?.state?.name ?? "-",
                        ship_country: shipping?.country?.name ?? "-",
                    })
                }

            } else {
                setLoading(false)

            }
        }))
    }

    const handleChanges = (e) => {
        const { name, value } = e.target;
        setDetail(
            prevState => ({
                ...prevState,
                [name]: value
            })

        )
    }

    const handleBillChanges = (e) => {
        const { name, value } = e.target;
        setBillingAddress(
            prevState => ({
                ...prevState,
                [name]: value
            })
        )
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPassword(
            prevState => ({
                ...prevState,
                [name]: value
            })

        )
    }

    const handleShipChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(
            prevState => ({
                ...prevState,
                [name]: value
            })
        )
    }

    const updatePassword = () => {
        const { current_password, new_password, confirm_password } = password;
        if (current_password === "" || current_password === null) {
            toastError("Please enter the current password");
        } else if (new_password === "" || new_password === null) {
            toastError("Please enter the new password");
        } else if (passwordValidations(new_password)) {
            toastError("Password should contain At least one uppercase, one lower case, one special characters ,one numeric and eight characters or longer");
        }
        else if (confirm_password === "" || confirm_password === null) {
            toastError("Please enter the confirm password");
        } else if (confirm_password !== new_password) {
            toastError("Password must be same")
        } else {
            let data = {
                current_password: current_password,
                new_password: new_password,
            }
            dispatch(changePassword(data, (result) => {
                if (result) {
                    setModal2Visible(false)
                } else {
                    setModal2Visible(true);
                }
            }))
        }
    }

    const updateLogo = () => {


        let billing = {
            line_1: billingAddress.bill_add_1,
            zipcode: billingAddress.bill_zipcode,
            city: {
                name: billingAddress.bill_city
            },
            state: {
                name: billingAddress.bill_state
            },


        }

        let shipping = {
            line_1: shippingAddress.ship_add_1,
            zipcode: shippingAddress.ship_zipcode,
            city: {
                name: shippingAddress.ship_city
            },
            state: {
                name: shippingAddress.ship_city
            },

        }

        let data = {
            image: merchantImage,
            name: {
                full: detail.name,
            },
            address: {
                billing,
                is_same_billing: detail.checkbox,
                shipping: detail.checkbox ? billing : shipping,
            }
        }


        dispatch(addProfile(data, (result) => {
            if (result) {

                setlogoModal(false)
                profilelist();
            }
        }))

    }



    const cancelPass = () => {
        setPassword({ ...password, new_password: '', current_password: '', confirm_password: '' });
        setModal2Visible(false);
    }
    const cancelLogoModal = () => {
        setImageLoaded(false)
        setlogoModal(false);
        setMerchantImage("")
    }

    const editProfile = () => {
        history.push('/profile/edit')
    }
    const antIcon = (
        <LoadingOutlined
            style={{
                fontSize: 24,
            }}
            spin
        />
    );



    let locale = {
        emptyText: (
            <span className="empty_data">
                <p>
                    Data not found
                </p>

            </span>
        )

    };

    const uploadImages = async (event) => {
        setImageLoaded(true)
        const file = event.target.files[0];
        // setMerchantImage(file);
        // let upload = "logo"
        // let formData = new FormData();
        // formData.append('uploadFile', file);

        // dispatch(UploadProfile(detail.id, upload, formData, (result) => {
        //     if (result) {

        //         setTimeout(() => {
        //             setImageLoaded(false)
        //             setMerchantImage("https://ippo-agritech.s3.amazonaws.com/" + result.data.url)
        //             event.preventDefault();
        //         }, 3000);

        //     }
        // }))
        if (file.type === "image/png" || file.type === "image/jpg" || file.type === "image/jpeg") {

            if (file.size > 5e6) {
                toastError("Please upload a file smaller than 5 MB");
                setImageLoaded(false);
            }
            else {
                let upload = "logo"
                let formData = new FormData();
                formData.append('uploadFile', file);

                dispatch(UploadProfile(detail.id, upload, formData, (result) => {
                    if (result) {
                        setTimeout(() => {
                            setImageLoaded(false)
                            setMerchantImage("https://ippo-agritech.s3.amazonaws.com/" + result.data.url)
                            event.preventDefault();
                        }, 3000);

                    }
                }))
            }

        }
        else {
            toastError("File does not support.You must use .png ,.jpg and .jpeg");
            setImageLoaded(false);
        }

    }

    const removeImage = () => {
        setMerchantImage("")

    }

    const cloudImgae = (
        <span className="remove_icon" onClick={removeImage}><i aria-label="icon: delete" className="anticon anticon-delete align-icon"><svg viewBox="64 64 896 896" focusable="false" className data-icon="delete" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z" /></svg></i>Remove</span>
    )

    const viewImage = (detail.image === "" || detail.image === undefined || detail.image === null)

    return (
        <>

            <Toaster />
            {loading ? (
                <>

                    
                    <div className="main-content app-content mt-0" >
                        <div className="side-app">
                            <div className="container-fluid main-container p-0 ">
                                <div className="profile_top">
                                    <div className="profile_header">
                                        <h4 className="business_head">Profile Details</h4>
                                        <div>
                                            <button className=" pwd_btn" style={{ marginLeft: "15px" }} onClick={() => setModal2Visible(true)}>Change Password</button>
                                            <button className="create_btn" style={{ marginLeft: "15px" }} onClick={editProfile}>Edit Profile</button>
                                        </div>
                                    </div>
                                    <div className="business_top" style={{ marginTop: "15px" }}>
                                        <div className='agro_card agro_view_details'>
                                            <div className='col-xs-12 col-sm-12 col-md-9 p-0'>
                                                <div className='card'>
                                                    <div className='card-body'>
                                                        <div className='row border_btm'>
                                                            <div className='col-xs-12 col-sm-12 col-md-8'>
                                                                <p className='agro_view_title'>Name </p>
                                                                <h4 className='agro_view_desc'>{detail.name}</h4>
                                                            </div>
                                                            <div className='col-xs-12 col-sm-12 col-md-4'>
                                                                <p className='agro_view_title'>Merchant ID</p>
                                                                <h4 className='agro_view_desc'>{detail?.merchant?.merchant_id ?? "-"}</h4>
                                                            </div>


                                                        </div>
                                                        <div className="contact_info" style={{ position: 'relative' }}>
                                                            <div className="profile-view-image">
                                                                <img src={viewImage ? noImage : detail.image} width="140px" height="140px" />
                                                                <div>
                                                                    <button className="profile_logo" onClick={() => setlogoModal(true)}>{merchantImage !== "" ? "Change Logo" : "Choose Logo"}</button>
                                                                </div>
                                                            </div>
                                                            <h5 className='contact_heading m-t-15'>Contact Details</h5>
                                                            <div className='row'>
                                                                <div className='col-xs-12 col-sm-12 col-md-4'>
                                                                    <p className='agro_view_title'>Email Address</p>
                                                                    <h4 className='agro_view_desc'>{detail.email}</h4>
                                                                </div>
                                                                <div className='col-xs-12 col-sm-12 col-md-4'>
                                                                    <p className='agro_view_title'>Phone number </p>
                                                                    <h4 className='agro_view_desc'>{detail.phone}</h4>
                                                                </div>
                                                                {/* <div className='col-xs-12 col-sm-12 col-md-4'>
                                                                    <p className='agro_view_title'>GST Number </p>
                                                                    <h4 className='agro_view_desc'>{detail.GST ? detail.GST : "-"}</h4>
                                                                </div> */}
                                                            </div>
                                                            <div className="check_address">
                                                                Billing Address :
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-xs-12 col-sm-12 col-md-6'>
                                                                    <p className='agro_view_title'>Address </p>

                                                                    <h4 className='agro_view_desc' style={{ textTransform: "capitalize" }}>{billingAddress.bill_add_1}</h4>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-xs-12 col-sm-12 col-md-4'>
                                                                    <p className='agro_view_title'>Zip Code </p>
                                                                    <h4 className='agro_view_desc'>{billingAddress.bill_zipcode}</h4>
                                                                </div>
                                                                <div className='col-xs-12 col-sm-12 col-md-4'>
                                                                    <p className='agro_view_title'>City </p>
                                                                    <h4 className='agro_view_desc' style={{ textTransform: "capitalize" }}>{billingAddress.bill_city}</h4>
                                                                </div>
                                                                <div className='col-xs-12 col-sm-12 col-md-4'>
                                                                    <p className='agro_view_title'>State</p>
                                                                    <h4 className='agro_view_desc' style={{ textTransform: "capitalize" }}>{billingAddress.bill_state}</h4>
                                                                </div>
                                                            </div>

                                                            {!billingAddress.checkbox ? (
                                                                <>
                                                                    <div className="check_address">
                                                                        Shipping Address :
                                                                    </div>
                                                                    <div className='row'>
                                                                        <div className='col-xs-12 col-sm-12 col-md-5'>
                                                                            <p className='agro_view_title'>Address </p>

                                                                            <h4 className='agro_view_desc' style={{ textTransform: "capitalize" }}>{shippingAddress.ship_add_1}</h4>
                                                                        </div>
                                                                    </div>
                                                                    <div className='row'>
                                                                        <div className='col-xs-12 col-sm-12 col-md-4'>
                                                                            <p className='agro_view_title'>Zip Code </p>
                                                                            <h4 className='agro_view_desc'>{shippingAddress.ship_zipcode}</h4>
                                                                        </div>
                                                                        <div className='col-xs-12 col-sm-12 col-md-4'>
                                                                            <p className='agro_view_title'>City </p>
                                                                            <h4 className='agro_view_desc' style={{ textTransform: "capitalize" }}>{shippingAddress.ship_city}</h4>
                                                                        </div>
                                                                        <div className='col-xs-12 col-sm-12 col-md-4'>
                                                                            <p className='agro_view_title'>State</p>
                                                                            <h4 className='agro_view_desc' style={{ textTransform: "capitalize" }}>{shippingAddress.ship_state}</h4>
                                                                        </div>
                                                                    </div>

                                                                </>

                                                            ) : ""}
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className='col-xs-12 col-sm-12 col-md-3' style={{ padding: "0px 0px 0px 15px" }}>
                                                <div className='card acc_view_card'>
                                                    <div className='card-body'>
                                                        <div className='d-flex m-b-10'>
                                                            <p className="acc_det_heading">Bank Account Details</p>
                                                        </div>
                                                        <h3 className="comp_name">{detail?.merchant?.payout?.account?.name ?? "-"}</h3>
                                                        <p className="acc_heading">Account Number</p>
                                                        <p className="acc_info">{detail?.merchant?.payout?.account?.account_number ?? "-"}</p>
                                                        <p className="acc_heading">IFSC Code</p>
                                                        <p className="acc_info">{detail?.merchant?.payout?.account?.ifsc ?? "-"}</p>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <Modal
                                title="Change Password"
                                centered
                                visible={modal2Visible}

                                onCancel={cancelPass}

                                footer={[
                                    <button
                                        key="cancel"
                                        type="primary"
                                        className='cancel_btn'
                                        style={{ marginRight: "10px" }}
                                        onClick={cancelPass}
                                    >
                                        Cancel
                                    </button>,
                                    <button
                                        key="submit"
                                        type="primary"
                                        className='create_btn'
                                        onClick={updatePassword}
                                    >
                                        Submit
                                    </button>
                                ]}
                            >
                                <div>
                                    <Form
                                        name="basic"
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 16 }}
                                        initialValues={{ remember: true }}
                                        autoComplete="off"
                                    >
                                        <InputField id="password" label="Current Password" name="current_password" placeholder="Current Password" value={password.current_password} handleChange={handleChange} className1="business_form_input ant-form-item-required" className2="business_input" />

                                        <InputField id="password" label="New Password" name="new_password" placeholder="New Password" value={password.new_password} handleChange={handleChange} className1="business_form_input ant-form-item-required" className2="business_input" />

                                        <InputField id="password" label="Confirm Password" name="confirm_password" placeholder="Confirm Password" value={password.confirm_password} handleChange={handleChange} className1="business_form_input ant-form-item-required" className2="business_input" />

                                    </Form>
                                </div>
                            </Modal>
                            <Modal
                                title="Logo"
                                centered
                                visible={logomodal}

                                onCancel={cancelLogoModal}

                                footer={[
                                    <button
                                        key="cancel"
                                        type="primary"
                                        className='cancel_btn'
                                        style={{ marginRight: "10px" }}
                                        onClick={cancelLogoModal}
                                    >
                                        Cancel
                                    </button>,
                                    <button
                                        key="submit"
                                        type="primary"
                                        className='create_btn'
                                        onClick={updateLogo}
                                    >
                                        Submit
                                    </button>
                                ]}
                            >
                                <div style={{ marginBottom: "20px" }}>
                                    {/* <h4 className='upload_title'>Logo</h4> */}
                                    <div className='profileUpload-content'>
                                        <div style={{ marginRight: "20px" }} >
                                            <h5 className='upload_desc'>Choose File to upload :</h5>
                                        </div>

                                        {imageLoaded ? (
                                            <div className="upload-logo">
                                                <div className="loader"></div>
                                            </div>
                                        ) : (
                                            <>
                                                {merchantImage !== "" ? (
                                                    <div className='upload-logo' >

                                                        <img className='update_logo_img' style={{ display: "block", margin: "0 auto" }} src={merchantImage} alt="upload img" accept='image/*' />
                                                        {cloudImgae}

                                                    </div>
                                                ) : (
                                                    <div className='upload-logo' onChange={uploadImages}>

                                                        <img className='update_logo_img' style={{ display: "block", margin: "0 auto" }} src={uploadImage} alt="upload img" loading="lazy" />
                                                        {cloudImgae}
                                                        <input accept="image/*" className="pop-body-vi-0" type="file" />

                                                    </div>
                                                )}
                                            </>
                                        )}




                                    </div>
                                </div>
                            </Modal>
                        </div>


                    </div>
                </>
            ) : (
                <>
                    <Spinner />
                </>
            )
            }

        </>
    );
}

export default Profile;