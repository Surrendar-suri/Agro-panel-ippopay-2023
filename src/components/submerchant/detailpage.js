import React, { useState, useEffect } from 'react';
import { Button, Form, Card, Spin, } from 'antd';
import { useParams, useHistory } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import { submerchantActive } from '../../store/actions/submerchantActive';
import { submerchantSuspend } from '../../store/actions/submerchantSuspend';
import { submerchantDetail } from '../../store/actions/submerchantList';
import { useDispatch, useSelector } from 'react-redux';
import { showDate, Toaster } from '../../helpers/Utils';
import Spinner from "../ui/spinner";


function SubmerchantDetail() {

    const history = useHistory()
    const dispatch = useDispatch();
    const params = useParams();
    let [loading, setLoading] = useState(false);
    const [state, setState] = useState({
        name: "",
        email: "",
        status: "",
        merchantId: "",
        submerchantId: "",
        phone: "",
        date: "",
    })

    const [status, setStatus] = useState('')
    useEffect(() => {
        if (params.id) {
            handleTable();

        }

    }, [])

    const handleTable = () => {
        // setTimeout(() => {
        //     setLoading(true);
        // }, 1000)
        dispatch(submerchantDetail(params.id, (result) => {
            if (result) {

                let data = result.sub_merchant;
                setLoading(true);
                setState({
                    ...state, name: data?.name?.full,
                    email: data.email,
                    status: data.status,
                    merchantId: data.merchant_id,
                    submerchantId: data.submerchant_id,
                    phone: data.phone.national_number,
                    date: data.createdAt,
                })
                setStatus(data.status)

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
    const state_status = status === "active";

    const statusChange = () => {
        if (state_status) {
            let data = {};
            dispatch(submerchantSuspend(params.id, data, (result) => {
                if (result) {
                    handleTable();

                }
            }));
        } else {
            let data = {};
            dispatch(submerchantActive(params.id, data, (result) => {
                if (result) {
                    handleTable();
                }
            }));
        }
    }

    return (<>

        <Toaster />
        {loading ? (
            <>
                
                <div className="main-content app-content mt-0" >
                    <div className="side-app">
                        <div className="container-fluid main-container p-0 ">
                            <div className="business_top">
                                <div className="business_header">

                                    <h4 className="business_head">Submerchant Details</h4>
                                    <div>

                                        <button className={state_status ? "cancel_btn bg-alert-warning" : "create_btn btn-success"} onClick={statusChange} style={{ marginRight: 10 }}>{state_status ? "Suspend" : "Activate"}</button >
                                        <button className='create_btn' type="primary" onClick={() => back()}>Back</button>
                                    </div>

                                </div>

                                <div className="business_top">
                                    <div className='agro_card agro_view_details'>
                                        <div className='col-xs-12 col-sm-12 col-md-12 p-0'>
                                            <div className='card'>
                                                <div className='card-body'>
                                                    <div className='row'>
                                                        <div className='col-xs-12 col-sm-12 col-md-8'>
                                                            <p className='agro_view_title'>Business Name </p>
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
                                                            <p className='agro_view_title'>Submerchant ID</p>
                                                            <h4 className='agro_view_desc'>{state.submerchantId}</h4>
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
                                                            <p className='agro_view_title'>Email Address </p>
                                                            <h4 className='agro_view_desc'>{state.email}</h4>
                                                        </div>
                                                        <div className='col-xs-12 col-sm-12 col-md-4'>
                                                            <p className='agro_view_title'>Phone number </p>
                                                            <h4 className='agro_view_desc'>{state.phone}</h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className='card'>
                                        <div className='card-body'>
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
                                                        <p className="business_detail">{status}</p>
                                                    </Form.Item>
                                                    <Form.Item className="form_inputs" label="Merchant Id">
                                                        <p className="business_detail">{state.merchantId}</p>
                                                    </Form.Item>
                                                    <Form.Item className="form_inputs" label="Date">
                                                        <p className="business_detail">{showDate(state.date)}</p>
                                                    </Form.Item>

                                                </div>
                                                <div className="flex">

                                                    <Form.Item className="form_inputs" label="Submerchant Id">
                                                        <p className="business_detail">{state.submerchantId}</p>
                                                    </Form.Item>

                                                </div>
                                            </Form>
                                        </div>

                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        ) : (<>
            <Spinner />
        </>)}

    </>
    );
}

export default SubmerchantDetail;