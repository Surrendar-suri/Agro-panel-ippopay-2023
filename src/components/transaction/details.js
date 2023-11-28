import React, { useState, useEffect } from 'react';
import { Button, Form, Card, Spin, } from 'antd';
import { useParams, useHistory } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import { transactionPopUp } from '../../store/actions/transaction';
import { useDispatch, useSelector } from 'react-redux';
import { showDate, Toaster } from '../../helpers/Utils';
import {currencyFormatter} from 'muthu-plugins'
import Spinner from "../ui/spinner";

function TransactionDetail() {

    const history = useHistory()
    const dispatch = useDispatch();
    const params = useParams();
    let [loading, setLoading] = useState(false);
    const [state, setState] = useState({
        name: "",
        type: "",
        status: "",
        trans_id: "",
        total_amount: "",
        mode: "",
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
        //  setLoading(true);
        // },1000)
        dispatch(transactionPopUp(params.id, (result) => {
            if (result) {
                
                let data = result.transaction;
                setLoading(true);
                setState({
                    ...state,
                    name: data.customer && data.customer.name && data.customer.name,
                    type: data.invoice && data.invoice.customer && data.invoice.customer.customer_type && data.invoice.customer.customer_type,

                    // status: data.status,
                    merchantId: data.trans_id,
                    total_amount: data.invoice && data.invoice.cost && data.invoice.cost.final,
                    mode: data.manual_payment_mode,
                    date: data.createdAt,
                })
                setStatus(data.transaction_status)

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


   
    return (<>

        <Toaster />
        {loading ? (
            <>
                
                <div className="main-content app-content mt-0" >
                    <div className="side-app">
                        <div className="container-fluid main-container p-0 ">
                            <div className="business_top">
                                <div className="business_header">

                                    <h4 className="business_head">Transaction Details</h4>
                                    <div>
                                        <Button type="primary" onClick={() => back()}>Back</Button>
                                    </div>

                                </div>

                                <div className="business_top">
                                    <Card>
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
                                                <Form.Item className="form_inputs" label="Type">
                                                    <p className="business_detail">{state.type}</p>
                                                </Form.Item>
                                                <Form.Item className="form_inputs" label="Mode">
                                                    <p className="business_detail">{state.mode}</p>
                                                </Form.Item>
                                            </div>
                                            <div className="flex">
                                                <Form.Item className="form_inputs" label="Status">
                                                    <p className="business_detail">{status}</p>
                                                </Form.Item>
                                                <Form.Item className="form_inputs" label="Transaction Id">
                                                    <p className="business_detail">{state.merchantId}</p>
                                                </Form.Item>
                                                <Form.Item className="form_inputs" label="Date">
                                                    <p className="business_detail">{showDate(state.date)}</p>
                                                </Form.Item>

                                            </div>
                                            <div className="flex">

                                                <Form.Item className="form_inputs" label="Total Amount">
                                                    <p className="business_detail">&#x20B9; {(state.total_amount)}</p>
                                                </Form.Item>

                                            </div>
                                        </Form>
                                    </Card>
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

export default TransactionDetail;