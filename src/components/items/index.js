import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import { Button, Modal, Form, Input, Card, Space, Spin, Table, DatePicker, } from 'antd';
import { isInvalidName, showError, showDate, toastError, Toaster, getIsoString } from '../../helpers/Utils';
import { invoiceItemList, updateItem, createInvoiceItem } from '../../store/actions/invoiceItem';
import { LoadingOutlined, FormOutlined } from '@ant-design/icons';
import Filter from "../../components/ui/filters";
import Spinner from "../../components/ui/spinner";
import TableField from "../../components/ui/table";

function Item(props) {

    let history = useHistory();
    const dispatch = useDispatch();
    let invoiceItem = useSelector(state => state.invoice_item.user)
    const [state, setState] = useState({
        currentPage: 1,
        pageSize: 10,
        name: "",
        description: "",
        cost: "",
        gst: "",
        currency: "",
        quantity: "",
        from: "",
        to: "",
        status: "",
        searchInput: "",
        searchOption: "",
        item_id: ""
    })
    const [modal2Visible, setModal2Visible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState();
    const [currentPage, setPage] = useState(1)
    const [apply, setApply] = useState(true);
    const [statusData, setStatusData] = useState([{ value: "Active", key: "active" }, { value: "Pending", key: "pending" }])
    const [searchData, setSearchData] = useState([{ value: "Name", key: "name" }])

    useEffect(() => {
        handleTable();
    }, [currentPage])


    const handleTable = () => {
        const { status, searchInput, searchOption, from, to } =
            state;
        var queryParams = "?page=" + currentPage + "&limit=10";
        if (searchInput !== "" && searchOption !== "") {
            queryParams += `&${searchOption}=` + searchInput;
        }

        if (status !== "") queryParams += "&status=" + status;
        if (from !== "") queryParams += "&from=" + getIsoString(from);
        if (to !== "") queryParams += "&to=" + getIsoString(to);
        if (from > to) {
            showError("Select the valid date", 3);
        } else {

            getInvoices({ queryParams })
        }
    }

    const getInvoices = ({
        queryParams,
    }) => {
        // setTimeout(() => {
        //     setLoading(true)
        // },1000)
        dispatch(invoiceItemList(queryParams, (result) => {
            if (result) {
                let data = result.invoices;
                setLoading(true);
                setTotal(result.total)

            } else {
                setLoading(false)

            }
        }))
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setState(
            prevState => ({
                ...prevState,
                [name]: value
            })
        )
    }

    const cancelPass = () => {
        setState({ ...state, name: "", description: "", cost: "", currency: "", quantity: "", item_id: "" ,gst:""})
        setModal2Visible(false);
    }

    const createSignup = () => {
        const { name, description, cost, currency, quantity,gst } = state;

        if (name === "" || name === null) {
            toastError("Please enter the name");
        } else if (name.length < 3) {
            toastError("Please enter the name minimum 3 characters");
        } else if (isInvalidName(name)) {
            toastError("Please enter alphabets only");
        }
        // else if (quantity === "" || quantity === null) {
        //     toastError("Please enter the quantity");
        // } 
        // else if (description === "" || description === null) {
        //     toastError("Please enter the description");
        // } 
        else if (cost === "" || cost === null) {
            toastError("Please enter the cost");
        }
        //  else if (currency === "" || currency === null) {
        //     toastError("Please enter the currency");
        // }
        else {
            let data = {
                name: name,
                qty: quantity,
                description: description,
                cost: cost,
                gst:gst,
                currency: currency,
            }
            if (state.item_id) {
                dispatch(updateItem(data, state.item_id, (result) => {
                    if (result) {
                        setModal2Visible(false);
                        setState({ ...state, item_id: "", name: "", description: "", cost: "", currency: "", quantity: "" ,gst:""})
                        handleTable();
                    }
                }))
            } else {
                dispatch(createInvoiceItem(data, (result) => {
                    if (result) {
                        setModal2Visible(false);
                        setState({
                            ...state, name: "", description: "", cost: "", currency: "", quantity: "",gst:""
                        })
                        handleTable();
                    }
                }))
            }

        }
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

     // Item modal
     const handleItemChangeNumber = (e) => {
        const re = /^\d+\.?\d*$/;
        if (e.target.value === "" || re.test(e.target.value)) {
            setState((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }));
        }
    };
    const handleItemChange = (e) => {
        let REGEX = /^([a-zA-Z0-9]+\s?)*$/;
        if (e.target.value === "" || REGEX.test(e.target.value)) {
            setState((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }));
        }
        // getsubTotal();
    };

    const handlePageChange = (page) => {
        setPage(page);

    };

    const redirectToDetails = (item_id) => {
        history.push("/items/details/" + item_id);
    }

    const updateItems = (obj) => {
        setModal2Visible(true);

        setState({
            ...state, item_id: obj.item_id, name: obj.name, description: obj.description, cost: obj.cost, currency: obj.currency, quantity: obj.qty, gst: obj.gst
        })
    }
    const column = [
        {
            title: "S.No",
            dataIndex: "S.No",
            render: (value, item, index) =>
                <div style={{ paddingLeft: 10 }}>
                    {(currentPage - 1) * 10 + (index + 1)}
                </div>

        },

        {
            title: "Name",
            dataIndex: "name",
            render: (name, object) =>
                <>
                    <a onClick={() => redirectToDetails(object.item_id)}>{name}</a>
                </>

        },
        {
            title: "Date",
            dataIndex: "createdAt",
            render: (createdAt) => showDate(`${createdAt}`),
        },
        // {
        //     title: "Quantity",
        //     dataIndex: "qty"
        // },
        {
            title: "Cost",
            dataIndex: "cost",
            render: (cost) => (<p style={{ margin: 0 }}>&#x20B9; {cost}</p>)
        },
        {
            title: "GST ",
            dataIndex: "gst",
            render: (gst) => (<p style={{ margin: 0 }}>{gst==="" ? "0" : gst}%</p>)
        },

        {
            title: "Action",
            dataIndex: "item_id",
            render: (item_id, object) => (
                <div className='view_invoice'>
                    <a onClick={() => updateItems(object)} className="det_view tooltip_edit text-warning">
                        <p className="cust_edit_invoice" >
                            Edit
                        </p>
                    </a>
                </div>
            )
        }
    ]

    const antIcon = (
        <LoadingOutlined
            style={{
                fontSize: 24,
            }}
            spin
        />
    );
    const searchInput = (e) => {

        setState(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))

        // handleTable();
    };

    const searchOption = (e) => {



        setState({ ...state, searchOption: e })
    }

    const statusOnChange = (e) => {



        setState({ ...state, status: e })

    }
    const handleOnToChange = (date, dateString, e) => {

        setState({ ...state, to: date })

    };

    const handleOnFromChange = (date, dateString) => {
        setState({ ...state, from: date })

    };

    const applyFilter = () => {
        handleTable();
        setPage(1)
    }
    const clearFilter = () => {
        setState({ ...state, from: "", to: "", searchInput: "", searchOption: "", status: "" })
        setPage(1)
        getInvoices({
            queryParams: `?page=${1}&limit=${10}`
        });
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
    return (
        <>
            <Toaster />
            {loading ? (
                <>

                    <div className="main-content app-content mt-0" >
                        <div className="side-app">
                            <div className="container-fluid main-container p-0 ">
                                <div className="business_top">

                                    <div className="farmer_header">
                                        <div className="farmer_filter" >
                                            <div className='col-xs-12 p-0'>
                                                <Filter statusSelect={state.status} statusName="status" searchSelect={state.searchOption} searchOption={searchOption} searchName="searchOption" searchInput={state.searchInput} searchInputName="searchInput" fromDate={state.from} toDate={state.to} fromName="from" toName="to" handleOnToChange={handleOnToChange} handleOnFromChange={handleOnFromChange} clearFilter={clearFilter} applyFilter={applyFilter} statusOnChange={statusOnChange} searchOnchangeInput={searchInput} searchData={searchData} statusData={statusData} />
                                                <div className="col-xs-2 p-0 ">
                                                    <button className="create_btn" style={{ margin: "10px 0 10px 15px", float: "right" }} onClick={() => setModal2Visible(true)}>+ Create Item</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <TableField column={column} data={invoiceItem.items} local={locale} current={currentPage} total={total} change={handlePageChange} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <Modal
                                title={state.item_id ? "Update Item" : "Create Item"}
                                centered
                                visible={modal2Visible}

                                onCancel={cancelPass}

                                footer={[
                                    <button
                                        key="cancel"
                                        type="primary"
                                        style={{ marginRight: 10 }}
                                        className="cancel_btn  btn btn-default"
                                        onClick={cancelPass}
                                    >
                                        Cancel
                                    </button>,
                                    <button
                                        key="submit"
                                        type="primary"
                                        className="create_btn"
                                        onClick={createSignup}
                                    >
                                        {state.item_id ? "Update" : "Submit"}
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
                                        <Form.Item
                                            label="Name"
                                        >
                                            <Input name="name" placeholder="Name" value={state.name} onChange={handleItemChange} />
                                        </Form.Item>
                                        {/* <Form.Item
                                            label="Quantity"
                                        >
                                            <Input name="quantity" placeholder="quantity" value={state.quantity} onChange={handleChangeNumber} />
                                        </Form.Item> */}
                                        <Form.Item
                                            label="Description"
                                        >
                                            <Input name="description" placeholder="Description" value={state.description} onChange={handleChange} />
                                        </Form.Item>
                                        <Form.Item
                                            label="Cost"
                                        >
                                            <Input name="cost" placeholder="Cost" value={state.cost} onChange={handleItemChangeNumber} />
                                        </Form.Item>
                                        <Form.Item
                                            label="GST"
                                        >
                                            <Input name="gst" placeholder="Gst" value={state.gst} onChange={handleItemChangeNumber} />
                                        </Form.Item>

                                    </Form>
                                </div>
                            </Modal>
                        </div>

                    </div>
                </>
            ) : (
                <>
                    <>
                        <Spinner />
                    </>
                </>
            )}

        </>
    );
}

export default Item;