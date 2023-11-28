import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Card, Space, Spin, Table } from 'antd';
import { useParams, useHistory } from 'react-router-dom';
import { invoiceItemDetails, } from '../../store/actions/invoiceItem';
import { useDispatch, useSelector } from 'react-redux';
import { showDate, Toaster } from '../../helpers/Utils';
import { LoadingOutlined } from '@ant-design/icons';
import Spinner from "../ui/spinner";

function InvoiceItemDetails(props) {

    const history = useHistory()
    const params = useParams()
    let dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (params.id) {
            handleTable()
        }


    }, []);

    const [state, setState] = useState({
        name: "",
        description: "",
        cost: "",
        currency: "",
        quantity: "",
        itemId: "",
        merchantId: "",
        date: "",
    })

    const handleTable = () => {
        // setTimeout(() => {
        //     setLoading(true);
        // }, 1000)

        dispatch(invoiceItemDetails(params.id, (result) => {
            if (result) {
                let data = result.item;
                setLoading(true);
                setState({
                    ...state, name: data.name,
                    description: data.description,
                    cost: data.cost,
                    currency: data.currency,
                    quantity: data.qty,
                    itemId: data.item_id,
                    merchantId: data.merchant_id,
                    date: data.createdAt,
                })
            } else {
                setLoading(false)

            }
        }))
    }
    const back = () => {
        history.goBack()
    }

    const antIcon = (
        <LoadingOutlined
            style={{
                fontSize: 24,
            }}
            spin
        />
    );




    return (
        <>
            <Toaster />

            {loading ? (
                <>

                    
                    <div className="main-content app-content mt-0" >
                        <div className="side-app">
                            <div className="container-fluid main-container p-0 ">
                                <div className="business_top">
                                    <div className="business_header">
                                        <h4 className="business_head">Item Details</h4>
                                        <div>

                                            <button className='create_btn' onClick={() => back()}>Back</button>
                                        </div>
                                    </div>
                                    <div className="business_top">
                                        <div className='agro_card agro_view_details'>
                                            <div className='col-xs-12 col-sm-12 col-md-12 p-0'>
                                                <div className='card'>
                                                    <div className='card-body'>
                                                        <div className='row m-b-15 '>
                                                            <div className='col-xs-12 col-sm-12 col-md-4'>
                                                                <p className='agro_view_title'>Item Name</p>
                                                                <h4 className='agro_view_desc'>{state.name}</h4>
                                                            </div>
                                                            <div className='col-xs-12 col-sm-12 col-md-4'>
                                                                <p className='agro_view_title'>Description</p>
                                                                <h4 className='agro_view_desc'>{state.description}</h4>
                                                            </div>
                                                            <div className='col-xs-12 col-sm-12 col-md-4'>
                                                                <p className='agro_view_title'>Quantity</p>
                                                                <h4 className='agro_view_desc'>{state.quantity}</h4>
                                                            </div>
                                                        </div>
                                                        <div className='row  m-b-15'>
                                                            <div className='col-xs-12 col-sm-12 col-md-4'>
                                                                <p className='agro_view_title'>Item ID</p>
                                                                <h4 className='agro_view_desc'>{state.itemId}</h4>
                                                            </div>
                                                            <div className='col-xs-12 col-sm-12 col-md-4'>
                                                                <p className='agro_view_title'>Merchant ID</p>
                                                                <h4 className='agro_view_desc'>{state.merchantId}</h4>
                                                            </div>
                                                            <div className='col-xs-12 col-sm-12 col-md-4'>
                                                                <p className='agro_view_title'>Cost</p>
                                                                <h4 className='agro_view_desc'>&#x20B9; {state.cost}</h4>
                                                            </div>
                                                        </div>
                                                        <div className='row '>
                                                        <div className='col-xs-12 col-sm-12 col-md-4'>
                                                                <p className='agro_view_title'>Date</p>
                                                                <h4 className='agro_view_desc'>{showDate(state.date)}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
                                                    <Form.Item className="form_inputs" label="Description">
                                                        <p className="business_detail">{state.description}</p>
                                                    </Form.Item>
                                                    <Form.Item className="form_inputs" label="Quantity">
                                                        <p className="business_detail">{state.quantity}</p>
                                                    </Form.Item>

                                                </div>
                                                <div className="flex">

                                                    <Form.Item className="form_inputs" label="Cost">
                                                        <p className="business_detail">&#x20B9; {state.cost}</p>
                                                    </Form.Item>
                                                    <Form.Item className="form_inputs" label="Item Id">
                                                        <p className="business_detail">{state.itemId}</p>
                                                    </Form.Item>
                                                    <Form.Item className="form_inputs" label="Merchant Id">
                                                        <p className="business_detail">{state.merchantId}</p>
                                                    </Form.Item>
                                                </div>
                                                <div className="flex">
                                                    <Form.Item className="form_inputs" label="Date">
                                                        <p className="business_detail">{showDate(state.date)}</p>
                                                    </Form.Item>

                                                </div>
                                            </Form>
                                        </Card> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </>) : (
                <>
                    <Spinner />
                </>
            )
            }
        </>
    );
}

export default InvoiceItemDetails;