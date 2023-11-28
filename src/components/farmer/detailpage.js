import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Card, Space, Spin, Table } from 'antd';
import { Route, Link, Routes, useParams, useHistory } from 'react-router-dom';
import { farmerBankverify, farmerDetail } from '../../store/actions/farmerList';
import { useDispatch, useSelector } from 'react-redux';
import {
    showDate, toastError, Toaster,
    toastSuccess, masking
} from '../../helpers/Utils';
import { LoadingOutlined } from '@ant-design/icons';
import bankverfyimg from '../../images/paid-img.png';
import Spinner from "../ui/spinner";

function FarmerDetail() {
    const history = useHistory();
    const dispatch = useDispatch();
    const params = useParams();
    const [state, setState] = useState({
        name: "",
        email: "",
        phone: "",
        farmerId: "",
        phone_number: "",
        verified_adhaar_number: "",
        verified_bank_number: "",
        aadhaar_status: "",
        status: "",
        date: "",
        merchantId: "",
        add_line_1: "",
        add_line_2: "",
        zipcode: "",
        city: "",
        farm_state: "",
        bankacc_num: "",
        bankacc_ifsc: "",
        bankacc_name: "",
        farmer_id: "",
        bankdetail_bank_name: "",
        bankdetail_bank_number: "",
        bankdetail_bank_ifsc: "",
        bankChangeStatus: false,

    })
    let [loading, setLoading] = useState(false);
    const [modalChangeBankAccount, setModalChangeBankAccount] = useState(false);
    useEffect(() => {
        if (params.id) {
            handleTable();
        }

    }, [])

    const handleTable = () => {
        // setTimeout(() => {
        //     setLoading(true)
        // }, 1000);
        dispatch(farmerDetail(params.id, (result) => {
            if (result) {

                let data = result.farmer;
                let billing = data?.address?.billing;
                let documents = data?.documents;

                // let phone = data?.phone?.national_number;
                // let documents = data?.documents;
                setLoading(true);
                setState({
                    ...state, name: data.name && data.name.full,
                    email: data?.email ?? "-",
                    phone: data?.phone?.national_number ?? "Not Updated",
                    farmerId: data?.farmer_id,
                    // bankApprovalstatus: data?.bank_approval_status,
                    status: data?.status,
                    date: showDate(data.createdAt),
                    merchantId: data?.merchant_id,

                    // name: data?.name?.full || "",
                    // email: data?.email || "",
                    // phone: phone,
                    phone_number: data?.phone?.is_verified || "",
                    aadhaar_status: documents?.aadhar?.status || "",
                    verified_adhaar_number: documents?.aadhar?.number ?? "",
                    verified_bank_number: data?.bank_info?.acc_no ?? "",
                    // pan_status: documents?.pan?.status || "",
                    // verified_pan_number: documents?.pan?.number || "",
                    add_line_1: billing?.line_1 || "",
                    add_line_2: billing?.line_2 || "",
                    zipcode: billing?.zipcode || "",
                    city: billing?.city?.name || "",
                    farm_state: billing?.state?.name || "",
                    // country: billing?.country?.name || "",
                    // merchant_id: data.merchant_id,
                    farmer_id: data.farmer_id,
                    bank_approval_status: data?.bank_approval_status ?? "Not Updated",
                    bankdetail_bank_name: data?.bank_info?.acc_holder_name ?? "-",
                    bankdetail_bank_number: data?.bank_info?.acc_no ?? "-",
                    bankdetail_bank_ifsc: data?.bank_info?.ifsc ?? "-",
                });
            } else {
                setLoading(false)
            }
        }));
    }


    const back = () => {
        history.goBack();
    }

    const antIcon = (
        <LoadingOutlined
            style={{
                fontSize: 24,
            }}
            spin
        />
    );
    const cancelBankPass = () => {
        setModalChangeBankAccount(false);
    }
    const farmerChangeAccount = () => {
        setModalChangeBankAccount(true);
    }
    const changeBankSubmit = () => {
        const { bankacc_num, bankacc_ifsc, bankacc_name, farmer_id,
        } = state;
        var queryParams =
            "/" +
            farmer_id;
        if (bankacc_num === "" || bankacc_num === undefined) {
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
                change_bank: true,
                bank_info: {
                    acc_holder_name: bankacc_name,
                    acc_no: bankacc_num,
                    ifsc: bankacc_ifsc,
                }
            };

            dispatch(
                farmerBankverify(queryParams, data, (result) => {

                    if (result) {
                        setModalChangeBankAccount(false);
                        handleTable();
                    }
                })
            );

        }
    }


    const handleChange = (e) => {
        setState((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };
    const handleChangeNumber = (e) => {
        let REGEX = /^\d+$/;
        if (e.target.value === "" || REGEX.test(e.target.value)) {
            setState((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }));
        }
    };

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
                    value={state.bankacc_num}
                    className="business_input_bank ht-38"
                    onChange={handleChangeNumber}
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
                    value={state.bankacc_name}
                    className="business_input_bank ht-38"
                    onChange={handleChange}
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
                        value={state.bankacc_ifsc}
                        className="business_input_bank ht-38 b_r_0"
                        onChange={handleChange}
                        placeholder="Enter IFSC"
                    />
                    {/* <span className="input-group-addon search_clr">
                        <i className="glyphicon glyphicon-search"></i>
                    </span> */}
                </div>
            </Form.Item>
        </div>
        <div
            className="container-login100-form-btn p-r-20 "
            onClick={changeBankSubmit}

        >
            <a
                className="login100-form-btn btn-primary"
                style={{ cursor: "pointer" }}
            >
                Submit
            </a>
        </div>

    </Form>)
    const success = <svg className="checkmark check_success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle check_success" cx="26" cy="26" r="25" fill="none" /><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>;

    const failed = <svg className="checkmark m-r-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle className="checkmark__circle check_fail" cx="26" cy="26" r="25" fill="none" />
        <path className="checkmark__check" fill="none" d="M16 16 36 36 M36 16 16 36" />;
    </svg>
    return (<>

        {loading ? (
            <>
                <Toaster />
                
                <div className="main-content app-content mt-0" >
                    <div className="side-app">
                        <div className="container-fluid main-container p-0 ">
                            <div className="business_top">
                                <div className="business_header">
                                    <h4 className="business_head">Farmer Details</h4>
                                    <button type="primary" className='btn btn-primary' onClick={() => back()}>Back</button>
                                </div>

                                <div className="business_top">
                                    {/* <Card>
                                        <Form
                                            name="basic"
                                            layout="vertical"
                                            labelCol={{ span: 8 }}
                                            wrapperCol={{ span: 16 }}
                                            initialValues={{ remember: true }}
                                            autoComplete="off">
                                            <div className="flex" style={{ marginTop: 10 }}>
                                                <Form.Item className="form_inputs" label="Name">
                                                    <p className="business_detail">{state.name}</p>
                                                </Form.Item>
                                                <Form.Item className="form_inputs" label="Email">
                                                    <p className="business_detail">{state.email}</p>
                                                </Form.Item>
                                                <Form.Item className="form_inputs" label="Contact">
                                                    <p className="business_detail">{state.phone}</p>
                                                </Form.Item>
                                            </div>
                                            <div className="flex">
                                                <Form.Item className="form_inputs" label="Status">
                                                    <p className="business_detail">{state.status}</p>
                                                </Form.Item>
                                                <Form.Item className="form_inputs" label="Farmer Id">
                                                    <p className="business_detail">{state.farmerId}</p>
                                                </Form.Item>
                                                <Form.Item className="form_inputs" label="Bank Approval">
                                                    <p className="business_detail">{state.bankApprovalstatus}</p>
                                                </Form.Item>
                                            </div>
                                            <div className="flex">
                                                <Form.Item className="form_inputs" label="Date">
                                                    <p className="business_detail">{showDate(state.date)}</p>
                                                </Form.Item>
                                                <Form.Item className="form_inputs" label="Merchant Id">
                                                    <p className="business_detail">{state.merchantId}</p>
                                                </Form.Item>

                                            </div>
                                        </Form>
                                    </Card> */}

                                    <div className='agro_card agro_view_details'>
                                        <div className='col-xs-12 col-sm-12 col-md-9 p-0'>
                                            <div className='card'>
                                                <div className='card-body'>
                                                    <div className='row'>
                                                        <div className='col-xs-12 col-sm-12 col-md-8'>
                                                            <p className='agro_view_title'>Farmer Name </p>
                                                            <h4 className='agro_view_desc' style={{ textTransform: "capitalize" }}>{state.name}</h4>
                                                        </div>
                                                        <div className='col-xs-12 col-sm-12 col-md-4'>
                                                            <p className='agro_view_title'>Status</p>

                                                            <h4 className='agro_view_desc text-success' style={{ textTransform: "capitalize" }}>
                                                                {state.status === "active" && <span class="badge bg-success-transparent text-success rounded-pill  p-2 px-3" style={{ textTransform: "capitalize" }}>{state.status}</span>}
                                                                {state.status === "inactive" && <span class="badge bg-danger-transparent text-danger rounded-pill  p-2 px-3" style={{ textTransform: "capitalize" }}>{state.status}</span>}
                                                                {state.status === "suspended" && <span class="badge bg-warning-transparent text-warning rounded-pill  p-2 px-3" style={{ textTransform: "capitalize" }}>{state.status}</span>}
                                                            </h4>
                                                        </div>
                                                        <div className='col-xs-12 col-sm-12 col-md-4'>
                                                            <p className='agro_view_title'>Farmer ID</p>
                                                            <h4 className='agro_view_desc'>{state.farmerId}</h4>
                                                        </div>
                                                        <div className='col-xs-12 col-sm-12 col-md-4'>
                                                            <p className='agro_view_title'>Merchant ID</p>
                                                            <h4 className='agro_view_desc'>{state.merchantId}</h4>
                                                        </div>
                                                        <div className='col-xs-12 col-sm-12 col-md-4'>
                                                            <p className='agro_view_title'>Created Date</p>
                                                            <h4 className='agro_view_desc'>{(state.date)}</h4>
                                                        </div>
                                                        {/* <div className='col-xs-12 col-sm-12 col-md-4'>
                                                            <p className='agro_view_title'>Bank Approval </p>
                                                            <h4 className='agro_view_desc text-warning m-b-15'>Pending</h4>
                                                        </div> */}
                                                    </div>
                                                    <hr></hr>
                                                    <h5 className='contact_heading'>Contact Details</h5>
                                                    {/* <div className='row'>
                                                        <div className='col-xs-12 col-sm-12 col-md-4'>
                                                            <p className='agro_view_title'>Business Owner Name </p>
                                                            <h4 className='agro_view_desc'>Charles</h4>
                                                        </div>
                                                    </div> */}
                                                    <div className='row'>
                                                        <div className='col-xs-12 col-sm-12 col-md-4'>
                                                            <p className='agro_view_title'>Email Address </p>
                                                            <h4 className='agro_view_desc'>{state.email=="" ? "-" :state.email}</h4>
                                                        </div>
                                                        <div className='col-xs-12 col-sm-12 col-md-4'>
                                                            <p className='agro_view_title'>Phone number </p>
                                                            <h4 className='agro_view_desc'>{state.phone}</h4>
                                                        </div>
                                                    </div>
                                                    <div className="check_address">
                                                        Billing Address :
                                                    </div>
                                                    <div className='row'>
                                                        <div className='col-xs-12 col-sm-12 col-md-6'>
                                                            <p className='agro_view_title'>Address </p>
                                                            <h4 className='agro_view_desc' style={{ textTransform: "capitalize" }}>{state.add_line_1}</h4>
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className='col-xs-12 col-sm-12 col-md-4'>
                                                            <p className='agro_view_title'>Zip Code </p>
                                                            <h4 className='agro_view_desc'>{state.zipcode}</h4>
                                                        </div>
                                                        <div className='col-xs-12 col-sm-12 col-md-4'>
                                                            <p className='agro_view_title'>City </p>
                                                            <h4 className='agro_view_desc' style={{ textTransform: "capitalize" }}>{state.city}</h4>
                                                        </div>
                                                        <div className='col-xs-12 col-sm-12 col-md-4'>
                                                            <p className='agro_view_title' >State</p>
                                                            <h4 className='agro_view_desc' style={{ textTransform: "capitalize" }}>{state.farm_state}</h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-xs-12 col-sm-12 col-md-3' style={{ padding: "0px 0px 0px 15px" }}>
                                            <div className='card acc_view_card' style={{ position: "relative" }}>
                                                <div className='card-body'>
                                                    <div className='d-flex m-b-10'>
                                                        <p className="acc_det_heading">Bank Account Details</p>
                                                        {state.bank_approval_status === "approved" ? (<a onClick={() => farmerChangeAccount()} className="det_view text-warning"><p className="cust_bank_info bg-warning" >Change</p></a>)
                                                        :
                                                        null
                                                    }
                                                    </div>
                                                    <h3 className="comp_name" style={{ textTransform: "capitalize" }}>{state.bankdetail_bank_name}</h3>
                                                    <p className="acc_heading">Account Number</p>
                                                    <p className="acc_info">{state.bankdetail_bank_number !== "" ? (masking(state.bankdetail_bank_number)) : "-"}</p>
                                                    <p className="acc_heading">IFSC Code</p>
                                                    <p className="acc_info">{state.bankdetail_bank_ifsc === "" ? "-" : state.bankdetail_bank_ifsc}</p>
                                                    {/* <p className="acc_heading">Balance</p>
                                                    <p className="acc_info">&#x20B9; XXXXXX</p> */}
                                                    {state.bank_approval_status === "approved" ? (
                                                        <div className='bankverfy_badge text-center'>
                                                            Bank Verified
                                                            {/* <img src /> */}
                                                        </div>
                                                    )
                                                        :
                                                        (
                                                            <div className='bankfail_badge text-center'>
                                                                Bank not Verified
                                                                {/* <img src /> */}
                                                            </div>
                                                        )
                                                    }
                                                </div>

                                            </div>
                                            <div className='card acc_view_card verify_card'>
                                                <div className='card-body'>
                                                    <div className='d-flex'>
                                                        <div className=''>
                                                            <p className="acc_heading">Phone Number</p>
                                                            <p className="acc_info">{state.phone}</p>
                                                        </div>
                                                        <div className='ms-auto'>
                                                            <p>{state.phone_number ? <span className="verify_success_msg">{success}

                                                            </span>
                                                                : <span className="verify_failed_msg">{failed}

                                                                </span>}
                                                            </p>
                                                            {/* <svg className="checkmark check_success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle check_success" cx="26" cy="26" r="25" fill="none" /><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='card acc_view_card verify_card'>
                                                <div className='card-body'>
                                                    <div className='d-flex'>
                                                        <div className=''>
                                                            <p className="acc_heading">Aadhaar Number</p>
                                                            <p className="acc_info">{state.verified_adhaar_number !== "" ? (masking(state.verified_adhaar_number)) : "Not Updated"}</p>
                                                        </div>
                                                        <div className='ms-auto'>
                                                            <p>{state.aadhaar_status === "approved" ? <span className="verify_success_msg">{success}

                                                            </span> : <span className="verify_failed_msg" >{failed}

                                                            </span>}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='card acc_view_card verify_card'>
                                                <div className='card-body'>
                                                    <div className='d-flex'>
                                                        <div className=''>
                                                            <p className="acc_heading">Bank Account Number</p>

                                                            <p className="acc_info">{state.verified_bank_number !== "" ? (masking(state.verified_bank_number)) : "Not Updated"}</p>
                                                        </div>
                                                        <div className='ms-auto'>
                                                            <p>{state.bank_approval_status === "approved" ?
                                                                <span className="verify_success_msg">{success}</span>
                                                                :
                                                                <span className="verify_failed_msg">{failed}</span>
                                                            }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* <div className='card acc_view_card verify_card'>
                                                <div className='card-body'>
                                                    <div className='d-flex'>
                                                        <div className=''>
                                                            <p className="acc_heading">GST Number</p>
                                                            <p className="acc_info">22GHKPS7989F7H9</p>
                                                        </div>
                                                        <div className='ms-auto'>
                                                            <svg className="checkmark check_success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle check_success" cx="26" cy="26" r="25" fill="none" /><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Modal
                            title="Verify Account Details"
                            centered
                            visible={modalChangeBankAccount}
                            className="account_card popup_acc_change"
                            onCancel={cancelBankPass}

                            footer={[
                                <button
                                    type="primary"
                                    className="cancel_btn btn btn-default"
                                    style={{ marginRight: "10px" }}
                                    onClick={cancelBankPass}
                                >
                                    Close
                                </button>

                            ]}
                        >


                            <div >

                                <div className="card-body">
                                    <h3 class="form-title m-0 m-b-15">Change Bank Account </h3>
                                    {bank_acc_details}
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
        )}

    </>
    );
}

export default FarmerDetail;