import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { useParams, useHistory } from 'react-router-dom';
import { bussinessDetails } from '../../store/actions/businessList';
import { useDispatch, useSelector } from 'react-redux';
import { showDate, masking } from '../../helpers/Utils';
import { LoadingOutlined } from '@ant-design/icons';
import Spinner from "../ui/spinner";

function BusinessDetail() {

    const history = useHistory()
    const dispatch = useDispatch();
    const params = useParams();


    const [state, setState] = useState({
        name: "",
        email: "",
        phone: "",
        businessId: "",
        merchantId: "",
        bankApprovalstatus: "",
        date: "",
        status: "",
        owner: "",
        bill_add_1: '',
        bill_add_2: '',
        bill_zipcode: '',
        bill_city: '',
        bill_state: '',
        bill_country: '',
        checkbox: true,
        ship_add_1: '',
        ship_add_2: '',
        ship_zipcode: '',
        ship_city: '',
        ship_state: '',
        ship_country: '',
        aadhaar_status: "",
        pan_status: "",
        gst_status: "",
        verified_gst_number: "",
        verified_adhaar_number: "",
        verified_pan_number: "",
        phoneNumber_verify: '',
        businessAccName: "",
        businessAccNumber: "",
        businessAccIfsc: "",

    })


    let [loading, setLoading] = useState(false)


    useEffect(() => {
        if (params.id) {
            handleTable();
        }

    }, [])

    const handleTable = () => {
        // setTimeout(() => {
        //     setLoading(true)
        // },1000)
        dispatch(bussinessDetails(params.id, (result) => {
            if (result) {
                let data = result.business;
                setLoading(true);
                let owner = data?.name?.full || '';
                let name = data?.business?.name || '';
                let billing = data?.address?.billing;
                let shipping = data?.address?.shipping;
                let address = data?.address;
                let check = address?.is_same_billing === false;
                let phone = data?.phone?.national_number;
                let documents = data?.documents;
                let gst = data?.business?.gst;
                let bank_info = data?.payout?.account;

                setState({
                    ...state,
                    name: name,
                    owner: owner,
                    email: data.email,
                    phone: data.phone.national_number,
                    businessId: data.business_id,
                    merchantId: data.merchant_id,
                    bankApprovalstatus: data.bank_approval_status,
                    date: data.createdAt,
                    status: data.status,
                    bill_add_1: billing?.line_1 ?? "-",
                    // bill_add_2: billing?.line_2 || '',
                    bill_zipcode: billing?.zipcode || '',
                    bill_city: billing?.city?.name || '',
                    bill_state: billing?.state?.name || '',
                    bill_country: billing?.country?.name || '',
                    checkbox: address?.is_same_billing || '',
                    ship_add_1: check && (shipping?.line_1) || '',
                    // ship_add_2: check && (shipping?.line_2) || '',
                    ship_zipcode: check && (shipping?.zipcode) || '',
                    ship_city: check && (shipping?.city?.name) || '',
                    ship_state: check && (shipping?.state?.name) || '',
                    ship_country: check && (shipping?.country?.name) || '',
                    phoneNumber_verify: data?.phone?.is_verified ?? '',
                    pan_status: documents?.pan?.status ?? '',
                    pan_number1: documents?.pan?.number ?? '',
                    gst_status: gst?.status ?? '',
                    phone: phone ?? "No Data",
                    verified_gst_number: gst?.number ?? 'Not Updated',
                    verified_adhaar_number: documents?.aadhar?.number ?? "",

                    verified_pan_number: documents?.pan?.number ?? "",
                    aadhaar_status: documents?.aadhar?.status ?? '',
                    businessAccName: bank_info?.name ?? "-",
                    businessAccNumber: bank_info?.account_number ?? "",
                    businessAccIfsc: bank_info?.ifsc ?? "-",

                })



            } else {
                setLoading(false)
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



    const success = <svg className="checkmark check_success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle check_success" cx="26" cy="26" r="25" fill="none" /><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>;

    const failed = <svg className="checkmark m-r-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle className="checkmark__circle check_fail" cx="26" cy="26" r="25" fill="none" />
        <path className="checkmark__check" fill="none" d="M16 16 36 36 M36 16 16 36" />;
    </svg>

    return (<>
        {loading ? (
            <>
                {/*  */}
                <div className="main-content app-content mt-0" >
                    <div className="side-app">
                        <div className="container-fluid main-container p-0 ">
                            <div className="business_top" style={{ marginTop: "25px" }}>
                                <div className="business_header">
                                    <h4 className="business_head">Business Details</h4>
                                    <div>
                                        {/* <button className='btn btn-primary' style={{marginRight:10}} type="primary" onClick={() => EditPage()}>Edit</button> */}
                                        <button className='btn btn-primary' type="primary" onClick={() => back()}>Back</button>
                                    </div>
                                </div>

                                <div className="business_top" style={{ marginTop: "15px" }}>

                                    <div className='agro_card agro_view_details'>
                                        <div className='col-xs-12 col-sm-12 col-md-9 p-0'>
                                            <div className='card'>
                                                <div className='card-body'>
                                                    <div className='row'>
                                                        <div className='col-xs-12 col-sm-12 col-md-8'>
                                                            <p className='agro_view_title'>Business Name </p>
                                                            <h4 className='agro_view_desc' style={{ textTransform: "capitalize" }}>{state.name}</h4>
                                                        </div>

                                                        <div className='col-xs-12 col-sm-12 col-md-4'>
                                                            <p className='agro_view_title'>Status</p>
                                                            {/* <h4 className='agro_view_desc text-success'>{state.status}</h4> */}
                                                            <h4 className='agro_view_desc text-success' style={{ textTransform: "capitalize" }}>
                                                                {state.status === "active" && <span class="badge bg-success-transparent text-success rounded-pill  p-2 px-3" style={{ textTransform: "capitalize" }}>{state.status}</span>}
                                                                {state.status === "inactive" && <span class="badge bg-danger-transparent text-danger rounded-pill  p-2 px-3" style={{ textTransform: "capitalize" }}>{state.status}</span>}
                                                                {state.status === "suspended" && <span class="badge bg-warning-transparent text-warning rounded-pill  p-2 px-3" style={{ textTransform: "capitalize" }}>{state.status}</span>}
                                                            </h4>
                                                        </div>
                                                        <div className='col-xs-12 col-sm-12 col-md-4'>
                                                            <p className='agro_view_title'>Business ID</p>
                                                            <h4 className='agro_view_desc'>{state.businessId}</h4>
                                                        </div>
                                                        <div className='col-xs-12 col-sm-12 col-md-4'>
                                                            <p className='agro_view_title'>Merchant ID</p>
                                                            <h4 className='agro_view_desc'>{state.merchantId}</h4>
                                                        </div>
                                                        <div className='col-xs-12 col-sm-12 col-md-4'>
                                                            <p className='agro_view_title'>Created Date</p>
                                                            <h4 className='agro_view_desc'>{showDate(state.date)}</h4>
                                                        </div>

                                                    </div>
                                                    <hr></hr>
                                                    <h5 className='contact_heading'>Contact Details</h5>
                                                    <div className='row'>
                                                        <div className='col-xs-12 col-sm-12 col-md-4'>
                                                            <p className='agro_view_title'>Business Owner Name </p>
                                                            <h4 className='agro_view_desc' style={{ textTransform: "capitalize" }}>{state.owner}</h4>
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className='col-xs-12 col-sm-12 col-md-4'>
                                                            <p className='agro_view_title'>Email Address </p>
                                                            <h4 className='agro_view_desc'>{state.email}</h4>
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
                                                            {/* <h4 className='agro_view_desc'>{state.bill_add_1},{state.bill_add_2}</h4> */}
                                                            <h4 className='agro_view_desc' style={{ textTransform: "capitalize" }}>{state.bill_add_1}</h4>
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className='col-xs-12 col-sm-12 col-md-4'>
                                                            <p className='agro_view_title'>Zip Code </p>
                                                            <h4 className='agro_view_desc'>{state.bill_zipcode}</h4>
                                                        </div>
                                                        <div className='col-xs-12 col-sm-12 col-md-4'>
                                                            <p className='agro_view_title'>City </p>
                                                            <h4 className='agro_view_desc' style={{ textTransform: "capitalize" }}>{state.bill_city}</h4>
                                                        </div>
                                                        <div className='col-xs-12 col-sm-12 col-md-4'>
                                                            <p className='agro_view_title'>State</p>
                                                            <h4 className='agro_view_desc' style={{ textTransform: "capitalize" }}>{state.bill_state}</h4>
                                                        </div>
                                                    </div>
                                                    {/* <div className="business_check">
                                                        <input type="checkbox" name="check" checked={state.checkbox}
                                                            style={{ marginRight: 10 }}

                                                        />  Same as billing address
                                                    </div> */}
                                                    {!state.checkbox ? (
                                                        <>
                                                            <div className="check_address">
                                                                Shipping Address :
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-xs-12 col-sm-12 col-md-5'>
                                                                    <p className='agro_view_title'>Address </p>
                                                                    {/* <h4 className='agro_view_desc'>{state.ship_add_1},{state.ship_add_2}</h4> */}
                                                                    <h4 className='agro_view_desc' style={{ textTransform: "capitalize" }}>{state.ship_add_1}</h4>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-xs-12 col-sm-12 col-md-4'>
                                                                    <p className='agro_view_title'>Zip Code </p>
                                                                    <h4 className='agro_view_desc'>{state.ship_zipcode}</h4>
                                                                </div>
                                                                <div className='col-xs-12 col-sm-12 col-md-4'>
                                                                    <p className='agro_view_title'>City </p>
                                                                    <h4 className='agro_view_desc' style={{ textTransform: "capitalize" }}>{state.ship_city}</h4>
                                                                </div>
                                                                <div className='col-xs-12 col-sm-12 col-md-4'>
                                                                    <p className='agro_view_title'>State</p>
                                                                    <h4 className='agro_view_desc' style={{ textTransform: "capitalize" }}>{state.ship_state}</h4>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : ""}
                                                </div>
                                            </div>

                                        </div>
                                        <div className='col-xs-12 col-sm-12 col-md-3' style={{ padding: "0px 0px 0px 15px" }}>
                                            <div className='card acc_view_card'>
                                                <div className='card-body'>
                                                    <div className='d-flex m-b-10'>
                                                        <p className="acc_det_heading">Bank Account Details</p>
                                                    </div>
                                                    <h3 className="comp_name" style={{ textTransform: "capitalize" }}>{state.businessAccName}</h3>
                                                    <p className="acc_heading">Account Number</p>
                                                    <p className="acc_info">{state.businessAccNumber !== "" ? (masking(state.businessAccNumber)) : "-"}</p>
                                                    <p className="acc_heading">IFSC Code</p>
                                                    <p className="acc_info">{state.businessAccIfsc}</p>
                                                    {/* <p className="acc_heading">Balance</p>
                                                    <p className="acc_info">&#x20B9; XXXXXX</p> */}
                                                </div>
                                            </div>
                                            <div className='card acc_view_card verify_card'>
                                                <div className='card-body'>
                                                    <div className='d-flex'>
                                                        <div className=''>
                                                            <p className="acc_heading">Phone Number</p>
                                                            <p className="acc_info">{(state.phone)}</p>
                                                        </div>
                                                        <div className='ms-auto'>
                                                            <p>{state.phoneNumber_verify ? <span className="verify_success_msg">{success}

                                                            </span>
                                                                : <span className="verify_failed_msg" >{failed}

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
                                                            <p className="acc_heading">PAN Number</p>
                                                            <p className="acc_info">{state.verified_pan_number !== "" ? (masking(state.verified_pan_number)) : "Not Updated"}</p>
                                                        </div>
                                                        <div className='ms-auto'>
                                                            <p>{state.pan_status === "approved" ? <span className="verify_success_msg">{success}
                                                            </span>
                                                                : <span className="verify_failed_msg" >{failed}

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
                                                            <p className="acc_heading">GST Number</p>
                                                            <p className="acc_info">{state.verified_gst_number}</p>
                                                        </div>
                                                        <div className='ms-auto'>
                                                            <p>{state.gst_status === "approved" ? <span className="verify_success_msg">{success}

                                                            </span>
                                                                : <span className="verify_failed_msg" >{failed}

                                                                </span>}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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

export default BusinessDetail;