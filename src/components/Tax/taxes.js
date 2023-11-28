import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import { taxList, createTax, updateTax } from '../../store/actions/tax';
import { getDetailTax } from '../../store/actions/taxDetails';
import { toastError, Toaster, isInvalidName } from '../../helpers/Utils';
import { Modal, Form, Input, Table, Switch } from 'antd';
import 'antd/dist/antd.css'
import Spinner from "../ui/spinner";


function Profile(props) {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    let taxLists = useSelector(state => state.tax_list.user.tax_list)
    const [modal2Visible, setModal2Visible] = useState(false);
    const [taxVisible, setTaxVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEnabled, setIsEnabled] = useState(true);
    const [total, setTotal] = useState();
    const [currentPage, setPage] = useState(1)
    const [state, setState] = useState({
        currentPage: 1,
        pageSize: 10,
        total: 0,
        taxId: "",
        viewDetails: false,
        addEditTax: false,

    })
    const [tax, setTax] = useState({
        name: "",
        percentage: "",
    })

    useEffect(() => {
        taxTable();
        if (state.taxId !== "") {
            detailTaxes(state.taxId);
        }
    }, [])

    const taxTable = () => {
        // setTimeout(() => {
        //     setLoading(true)
        // }, 1000)
        var queryParams = "?page=" + currentPage + "&limit=10";
        dispatch(taxList(queryParams, (result) => {
            if (result) {

                setTotal(result.total)
                setLoading(true);

            } else {
                setLoading(false)

            }
        }))

    }

    const detailTaxes = (id) => {
        dispatch(getDetailTax(id, (result) => {
            if (result) {
                let data = result.tax
                setTax({ ...tax, name: data.name, percentage: data.percentage })
            }
        }))
    }
    const handlePageChange = (page) => {
        setState({ ...state, currentPage: page }, () => {
            taxTable();
        });
    };


    const taxhandleChange = (e) => {
        const { name, value } = e.target;
        setTax(
            prevState => ({
                ...prevState,
                [name]: value
            })
        )
    }

    const handleChangeNumber = (e) => {
        let guidRegex = /^([0-9.])+$/
        // let REGEX = /^([0-9.])+$/;
        if (e.target.value === "" || guidRegex.test(e.target.value)) {
            setTax(prevState => ({
                ...prevState,
                [e.target.name]: e.target.value
            }))
        }
    }
    const createTaxes = () => {
        const { name, percentage } = tax;
        const { taxId } = state;
        if (name === "" || name === null) {
            toastError("Please enter the tax name")
        } else if (isInvalidName(name)) {
            toastError("Please enter alphabets only")
        }
        else if (percentage === "" || percentage === null) {
            toastError("Please enter the percentage")
        } else if (percentage < 1) {
            toastError("Please enter the above zero")
        }
        else {
            let data = { name: name, percentage: percentage }
            if (taxId !== "") {
                dispatch(updateTax(data, taxId, (result) => {
                    if (result) {
                        setTaxVisible(false);
                        taxTable();
                    }
                }))

            } else {
                dispatch(createTax(data, (result) => {
                    if (result) {
                        setTaxVisible(false);
                        setTax({ ...tax, name: "", percentage: "" })
                        taxTable();

                    }
                }))
            }

        }
    }


    const cancelTax = () => {
        setTaxVisible(false);
    }
    const antIcon = (
        <LoadingOutlined
            style={{
                fontSize: 24,
            }}
            spin
        />
    );
    const updateTaxs = (obj) => {

        setState({ ...state, taxId: obj.tax_id, viewDetails: false, addEditTax: true })
        setTaxVisible(true);
        detailTaxes(obj.tax_id);
    }

    const detailTax = (obj) => {
        setTaxVisible(true);
        setState({ ...state, taxId: obj.tax_id, viewDetails: true, addEditTax: false })
        detailTaxes(obj.tax_id);
    }

    const addTax = () => {
        setTaxVisible(true);
        setState({ ...state, taxId: "", viewDetails: false, addEditTax: true })
        setTax({ ...tax, name: "", percentage: "" })

    }
    const onChangeSWitch = (data, id) => {

        data.is_enabled = !data.is_enabled;

        dispatch(updateTax({
            is_enabled: data.is_enabled,
        }, id, (result) => {
            if (result) {

                taxTable()
            }
        }))

    }

    let locale = {
        emptyText: (
            <span className="empty_data">
                <p>
                    Data not found
                </p>

            </span>
        )

    };
    let column = [
        {
            title: "S.NO",
            dataIndex: "S.No",
            render: (value, item, index) => (
                <div style={{ paddingLeft: 10 }}>
                    {(state.currentPage - 1) * 10 + (index + 1)}

                </div>
            )
        },
        {
            title: "Name",
            dataIndex: "tax_id",
            render: (tax_id, object) => (
                <a onClick={() => detailTax(object)}>{object.name}</a>
            )
        },

        {
            title: "Percentage",
            dataIndex: "percentage",
        },
        {
            title: "Status",
            dataIndex: "tax_id",
            render: (tax_id, object) => {
                return (
                    <div className='switch_primary'><Switch onChange={(e) => onChangeSWitch(object, tax_id)} checked={object.is_enabled} /></div>
                )
            }
        },
        {
            title: "Action",
            dataIndex: "tax_id",
            render: (tax_id, object) =>
                <div className='view_invoice'>
                    <a onClick={() => updateTaxs(object)} className="det_view tooltip_edit text-warning">
                        <p className="cust_edit_invoice" >
                            Edit
                        </p>
                    </a>
                </div>

        }
    ]
    return (
        <>

            <Toaster />
            {loading ? (
                <>
                    
                    <div className="main-content app-content mt-0" >
                        <div className="side-app">
                            <div className="container-fluid main-container p-0 ">

                                <div>
                                    <div className="tax_header">
                                        <h4 className="profile_head">Taxes</h4>
                                        <button className="create_btn" onClick={addTax}>+ Add Tax</button>
                                    </div>

                                    <div className="container_top">
                                        <div className='agro_card_table'>
                                            <div className='card'>
                                                <div className='card-body'>
                                                    <Table
                                                        align="left"
                                                        className="gx-table-responsive agri_table"
                                                        columns={column}
                                                        dataSource={taxLists}
                                                        locale={locale}
                                                        size="middle"
                                                        pagination={{
                                                            pageSize: state.pageSize,
                                                            current: state.currentPage,
                                                            total: state.total,
                                                            onChange: handlePageChange,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                        <div>
                            <Modal
                                title={state.addEditTax ? (state.taxId === "" ? "Create Tax" : "Update Tax") : "View Details"}
                                centered
                                visible={taxVisible}
                                onCancel={cancelTax}
                                footer={false}
                            >
                                <div>
                                    <Form
                                        name="basic"
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 16 }}
                                        initialValues={{ remember: true }}
                                        autoComplete="off"
                                    >


                                        {state.viewDetails && (
                                            <>
                                                <Form.Item className='tax_label'
                                                    label="Tax Name"
                                                >
                                                    {/* <Input name="name" className="cursor" readOnly value={tax.name} /> */}
                                                    <h5 style={{ lineHeight: "32px" }}><span style={{ marginRight: "10px" }}>:</span>{tax.name}</h5>
                                                </Form.Item>

                                                <Form.Item className='tax_label'
                                                    label="Tax Percentage "
                                                >

                                                    {/* <Input name="percentage" className="cursor" readOnly value={tax.percentage} /> */}
                                                    <h5 style={{ lineHeight: "32px" }}><span style={{ marginRight: "10px" }}>:</span>{tax.percentage}</h5>
                                                </Form.Item>
                                                <div className='tax_button'>
                                                    <button
                                                        key="cancel"
                                                        type="primary"
                                                        style={{ marginRight: 5 }}
                                                        onClick={cancelTax}
                                                        className="cancel_btn  btn btn-default"
                                                    >
                                                        Close
                                                    </button>
                                                </div>

                                            </>
                                        )}

                                        {state.addEditTax && (
                                            <>
                                                <Form.Item
                                                    label="Name"
                                                >
                                                    <Input name="name" placeholder="GST Name" value={tax.name} onChange={taxhandleChange} />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Percentage"
                                                >
                                                    <Input name="percentage" placeholder="Percentage" value={tax.percentage} onChange={handleChangeNumber} maxLength={4} />
                                                </Form.Item>

                                            </>
                                        )}
                                        {state.addEditTax && (
                                            <div className="tax_button">
                                                <button
                                                    key="cancel"
                                                    type="primary"
                                                    onClick={cancelTax}
                                                    style={{ marginRight: 10 }}
                                                    className="cancel_btn  btn btn-default"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    key="submit"
                                                    type="primary"
                                                    onClick={createTaxes}
                                                    className="create_btn"
                                                >
                                                    {state.taxId === "" ? "Submit" : "Update"}
                                                </button>
                                            </div>
                                        )}

                                    </Form>
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