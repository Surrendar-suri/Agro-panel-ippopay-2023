import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import { Button, Modal, Form, Input, Card, Space, Spin, Table, DatePicker, } from 'antd';
import { isInvalidName, showError, showDate, toastError, Toaster, getIsoString, toFixed, showDateTime } from '../../helpers/Utils';
import { transactionList, transactionPopUp } from '../../store/actions/transaction';
import ApiCall from "../../helpers/apicall";
import Filter from "../ui/filters";
import Spinner from "../ui/spinner";


function Transaction(props) {
    let history = useHistory();
    const dispatch = useDispatch();
    const transaction = useSelector(state => state.transaction_list.user)

    const [statusData, setStatusData] = useState([{ value: "Paid", key: "paid" }, { value: "Collected", key: "collected" }, { value: "Initiated", key: "initiated"}])
    const [searchData, setSearchData] = useState([{ value: "Id", key: "trans_id" }, { value: "Name", key: "name" }, { value: "Role", key: "role" }])
    const [loading, setLoading] = useState(false);

    const [state, setState] = useState({
        currentPage: 1,
        total: '',
        pageSize: 10,
        from: "",
        to: "",
        searchInput: "",
        searchOption: "",
        status: "",
        name: "",
        type: "",
        mode: "",
        trans_status: "",
        trans_id: "",
        date: "",
        total_amount: "",
        transactions: [],

    })
    const [filter, setFilter] = useState({
        status: "",
        to: "",
        searchInput: "",
        from: "",
        searchOption: "",
        inv_type:""
    })
    const [total, setTotal] = useState();
    const [apply, setApply] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [transactionModal, setTransactionModal] = useState(false);

    useEffect(() => {
        handleTable();
    }, [currentPage])



    useEffect(() => {
        if (!apply && filter.searchInput === "" && filter.searchOption === "" && filter.status === "" && filter.to === "" && filter.from === "" && filter.inv_type==="") {
            handleTable();
        }
    }, [filter])

    const handleTable = () => {
        // setTimeout(() => {
        //     setLoading(true);
        // }, 1000)
        const { status, searchInput, searchOption, from, to,inv_type  } =
            filter;
        var queryParams = "?page=" + currentPage + "&limit=10";
        if (searchInput !== "" && searchOption !== "") {
            queryParams += `&${searchOption}=` + searchInput;
        }

       if (status !== "") queryParams += "&status=" + status;
        if (from !== "") queryParams += "&from_time=" + getIsoString(from);
        if (to !== "") queryParams += "&to_time=" + getIsoString(to);
        if (status == "paid") queryParams += "&invoice_type=f2m&status=success";
        if (status == "collected") queryParams += "&invoice_type=m2b&status=success";
        if (from > to) {
            showError("Select the valid date", 3);
        } else {
            dispatch(transactionList(queryParams, (result) => {
                if (result) {
                    setLoading(true);
                    setState({ ...state, transactions: result?.transactions })
                    setTotal(result.total)
                } else {
                    setLoading(false);

                }
            }))

        }
    }


    const handlePageChange = (page) => {

        setCurrentPage(page);
        handleTable();
    };

    const searchInput = (e) => {

        setFilter(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    };

    const searchOption = (e) => {
        setFilter({ ...filter, searchOption: e })
    }

    const statusOnChange = (e) => {
        setFilter({ ...filter, status: e })
    }
    const handleOnToChange = (date, dateString, e) => {

        setFilter({ ...filter, to: date })

    };

    const handleOnFromChange = (date, dateString) => {
        setFilter({ ...filter, from: date })

    };
    const redirectToDetails = (obj) => {

        dispatch(transactionPopUp(obj.trans_id, (result) => {
            if (result) {

                let data = result.transaction;
                setTransactionModal(true);
                setState({
                    ...state,
                    name: data?.customer?.name,
                    // type: obj,
                    type: data?.invoice?.customer?.customer_type ?? "-",
                    status: data?.status ?? "-",
                    trans_status: data?.transaction_status || '',
                    trans_id: data?.trans_id,
                    total_amount: data?.invoice?.cost?.final ?? "-",
                    mode: data?.manual_payment_mode ?? "-",
                    date: data?.createdAt,
                })
            }
        }))
    }
    const applyFilter = () => {
        handleTable();
        setCurrentPage(1)
    }
    const clearFilter = () => {
        setApply(false);
        setFilter(prevState => ({ ...prevState, from: "", to: "", searchInput: "", searchOption: "", status: "" }))
        handleTable();
        setCurrentPage(1)

    }

    const cancelTransactionModal = () => {
        setTransactionModal(false);
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
            title: "Transaction ID",
            dataIndex: 'trans_id',
            render: (trans_id, object) =>
                <>
                    <a onClick={() => redirectToDetails(object)}>{trans_id}</a>
                </>
        },
        {
            title: "Type",
            dataIndex: "invoice",
            render: (invoice) => (
                <div style={{ textTransform: "capitalize" }}>
                    <div >{invoice?.customer?.customer_type ?? -""}</div>
                </div>
            )

        },
        {
            title: "Customer Name",
            dataIndex: "customer",
            render: (customer) => <>
                <span style={{ textTransform: "capitalize" }}>{customer?.name}</span>
            </>

        },
        {
            title: "Price",
            dataIndex: "cost",

            render: (cost) => (
                <p style={{ margin: 0 }}>&#x20B9; {toFixed(cost.paid)}</p>
            )
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            render: (createdAt) => showDateTime(`${createdAt}`),
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (status, object) => (
                <div style={{ textTransform: "capitalize" }}>
                    {(status === "success" && object?.invoice?.customer?.customer_type?.toString().toLowerCase() === "business") && <div className="badge bg-success-transparent text-success rounded-pill  p-2 px-3">Collected</div>}
                    {(status === "success" && object?.invoice?.customer?.customer_type?.toString().toLowerCase() === "farmer") && <div className="badge bg-success-transparent text-success rounded-pill  p-2 px-3">Paid</div>}
                    {status === "initiated" && <div className="badge bg-primary-transparent text-primary rounded-pill  p-2 px-3">{status}</div>}
                    {status === "failed" && <div className="badge bg-danger-transparent text-danger rounded-pill  p-2 px-3">{status}</div>}
                    {status === "paid" && <div className="badge bg-success-transparent text-success rounded-pill  p-2 px-3">{status}</div>}
                </div>
            )
        },



    ]
    return (

        <>
            {loading ? (<>
                
                <div className="main-content app-content mt-0" >
                    <div className="side-app">
                        <div className="container-fluid main-container p-0 ">


                            <div className="profile_top">
                                <div className="profile_header">

                                    <h4 className="business_head">Transactions List</h4>


                                </div>
                            </div>
                            <div className="farmer_header">
                                <div className="farmer_filter" >
                                    <Filter
                                        searchSelect={filter.searchOption}
                                        searchData={searchData}
                                        searchOption={searchOption}
                                        searchName="searchOption"
                                        searchOnchangeInput={searchInput}
                                        searchInput={filter.searchInput}
                                        searchInputName="searchInput"
                                        statusSelect={filter.status}
                                        statusName="status"
                                        statusOnChange={statusOnChange}
                                        statusData={statusData}
                                        fromName="from"
                                        fromDate={filter.from}
                                        handleOnFromChange={handleOnFromChange}
                                        toDate={filter.to}
                                        handleOnToChange={handleOnToChange}
                                        toName="to"
                                        applyFilter={applyFilter}
                                        clearFilter={clearFilter}
                                    />
                                </div>
                            </div>

                            <div className="business_top">
                                <div className='agro_card_table'>
                                    <div className='card'>
                                        <div className='card-body'>
                                            <Table
                                                align="left"
                                                className="gx-table-responsive agri_table"
                                                columns={column}
                                                dataSource={state.transactions}
                                                locale={locale}
                                                size="middle"
                                                pagination={{
                                                    current: currentPage,
                                                    total: total,
                                                    onChange: handlePageChange,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Modal
                        title="Transaction Details"
                        visible={transactionModal}
                        width={490}
                        onCancel={cancelTransactionModal}
                        footer={[
                            <button className="create_btn" style={{ fontWeight: 'bold' }} onClick={cancelTransactionModal}>Cancel</button>
                        ]}
                    >
                        <Form
                            name="basic"
                            layout="vertical"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            initialValues={{ remember: true }}
                            autoComplete="off">
                            <div className="flex" >

                                <table className="trans_table">
                                    <tbody>
                                        <tr className="trans_tr">
                                            <td className="trans_label">Customer Name</td>
                                            <td>:</td>
                                            <td className="trans_value" style={{ textTransform: "capitalize" }}>{state.name}</td>
                                        </tr>
                                        {/* <tr>
                                        <td className="trans_label">Status</td>
                                        <td>:</td>
                                        <td className="trans_value">{state.status}</td>

                                    </tr> */}
                                        <tr>
                                            <td className="trans_label">Mode</td>
                                            <td>:</td>
                                            <td className="trans_value" style={{ textTransform: "capitalize" }}>{state.mode === "" ? "-" : state.mode}</td>

                                        </tr>

                                        <tr>
                                            <td className="trans_label">Transaction Id</td>
                                            <td>:</td>
                                            <td className="trans_value">{state.trans_id}</td>

                                        </tr>
                                        <tr>
                                            <td className="trans_label">Date</td>
                                            <td>:</td>
                                            <td className="trans_value">{showDate(state.date)}</td>

                                        </tr>
                                        <tr>
                                            <td className="trans_label">Total Amount</td>
                                            <td>:</td>
                                            <td className="trans_value">&#x20B9;  {state.total_amount}</td>
                                        </tr>
                                        <tr>
                                            <td className="trans_label">Status</td>
                                            <td>:</td>
                                            <td className="trans_value" style={{ textTransform: "capitalize", fontWeight: "500" }}>
                                                {state.status === "success" && (state.type?.toString().toLowerCase() === "business") && <div className="text-success">Collected</div>}
                                                {state.status === "success" && (state.type?.toString().toLowerCase() === "farmer") && <div className="text-success">Paid</div>}
                                                {state.status === "initiated" && <div className="text-primary">{state.status}</div>}
                                                {state.status === "failed" && <div className="text-danger">{state.status}</div>}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Form>
                    </Modal>
                </div>
            </>) : (<>
                <Spinner />
            </>)}

        </>
    )
}

export default Transaction;