import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Card, Space, Spin, Table, DatePicker, Select, Badge, Tabs, Layout } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { isInvalidEmail, isInvalidName, number, specialChars, uppercase, lowercase, toastError, toastSuccess, Toaster, passwordValidations, showDate, getIsoString, showError } from '../../helpers/Utils';
import { farmerList, farmerRegister, suspendStatus, activeStatus, farmerDashboard } from '../../store/actions/farmerList';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingOutlined, FormOutlined } from '@ant-design/icons';
import Filter from "../ui/filters";
import Spinner from "../ui/spinner";
import TableField from "../../components/ui/table";
import DashboardField from "../../components/ui/dashboardField";
import 'antd/dist/antd.css';
const { TabPane } = Tabs;
const { Search } = Input;

const { Option } = Select;
function Farmer(props) {
    const history = useHistory()

    const dispatch = useDispatch();
    let profile = useSelector(state => state.farmer_list.user)

    const [statusData, setStatusData] = useState([{ value: "Active", key: "active" }, { value: "Inactive", key: "inactive" }, { value: "Suspended", key: "suspended" }])
    const [searchData, setSearchData] = useState([{ value: "Id", key: "farmer_id" }, { value: "Name", key: "name.full" }, { value: "City", key: "city" }, { value: "Phone", key: "phone.national_number" }, { value: "Email", key: "email" }])


    const [state, setState] = useState({
        email: '',
        password: '',
        name: "",
        phone: "",
        conPassword: "",
        states: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
        from: '',
        to: '',
        status: '',
        searchOption: '',
        searchInput: '',
        account_no: '',
        account_type: "",
        bank_name: '',
        bank_branch: '',
        bank_address: "",
        address_1: '',
        address_2: '',
        country: '',
        province: '',
        city: '',
        postal_code: '',
        popup_bank_name: "",
        popup_bank_number: "",
        popup_bank_ifsc: "",
    });
    const [Dashboard, setDashboard] = useState({
        farmerActive: "",
        farmerInactive: "",
        farmerSuspended: "",
        farmerTotal: "",
    })

    const [modal2Visible, setModal2Visible] = useState(false);

    const [modalBankAccount, setModalBankAccount] = useState(false);

    const [modal3Visible, setModal3Visible] = useState(false);

    const [loading, setLoading] = useState(false);
    const [currentPage, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10)

    const [total, setTotal] = useState()
    const [apply, setApply] = useState(true)

    const handlePageChange = (page, pageSize) => {

        setPage(page);
        setPageSize(pageSize);
        handleTable();
    };

    function handleTable() {
        // setTimeout(() =>{
        //     setLoading(true);
        // },1000)

        const { status, searchInput, searchOption, from, to } =
            state;
        var queryParams = "?page=" + currentPage + "&limit=" + pageSize;
        if (searchInput !== "" && searchOption !== "") {
            queryParams += `&${searchOption}=` + searchInput;
        }

        if (status !== "") queryParams += "&status=" + status;
        if (from !== "") queryParams += "&from_time=" + getIsoString(from);
        if (to !== "") queryParams += "&to_time=" + getIsoString(to);
        if (from > to) {
            showError("Select the valid date");
        } else {
            dispatch(farmerList(queryParams, (result) => {

                if (result) {
                    setLoading(true);
                    setTotal(result.total);
                } else {
                    setLoading(false);
                }
            }));
        }

    }

    const handleFarmerDashboard = () => {
        dispatch(farmerDashboard((result) => {
            if (result) {

                let data = result?.farmer_dashboard;

                setDashboard({
                    ...Dashboard,
                    farmerActive: data?.active?.count ?? "0",
                    farmerInactive: data?.inactive?.count ?? "0",
                    farmerSuspended: data?.suspended?.count ?? "0",
                    farmerTotal: data?.total?.count ?? "0",
                });
            }
        }));
    }
    useEffect(() => {
        handleTable();
        handleFarmerDashboard();
    }, [currentPage, pageSize])

    useEffect(() => {
        if (!apply && state.searchInput === "" && state.searchOption === "" && state.status === "" && state.to === "" && state.from === "") {
            handleTable();
        }
    }, [state])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState(
            prevState => ({
                ...prevState,
                [name]: value
            })
        )
    }
    const createSignup = (e) => {
        const { name, email, phone, states, password, conPassword } = state;

        if (name === "" || name === null) {
            toastError("Please enter the name");
        } else if (name.length < 3) {
            toastError("Please enter the name minimum 3 characters");
        } else if (isInvalidName(name)) {
            toastError("Please enter alphabets only");
        }
        else if (isInvalidEmail(email)) {
            toastError("Please enter a valid email id")
        } else if (phone === "" || phone === null) {
            toastError("Please enter a valid phone")
        } else if (number(phone)) {
            toastError("Please enter numbers only")
        } else if (phone.length < 10 || phone.length > 10) {
            toastError("Please enter 10 digits ")
        } else if (states === "" || states === null) {
            toastError("Please enter the state name")
        } else if (states.length < 3) {
            toastError("Please enter the state name minimum 3 characters")
        } else if (password === "" || password === null) {
            toastError("Please enter a valid password")
        }
        else if (passwordValidations(password)) {
            toastError("Password should contain At least one uppercase, one lower case, one special characters ,one numeric and eight characters or longer");
        }
        else if (conPassword === "" || conPassword === null) {
            toastError("Please enter a confirm password");
        } else if (password !== conPassword) {
            toastError("Password must be same");
        }
        else {
            let data = {
                name: {
                    full: state.name,
                },
                phone: {
                    national_number: state.phone,
                },
                email: state.email,
                password: state.password,
                state: {
                    name: state.states,
                }
            };

            dispatch(farmerRegister(data, (result) => {
                if (result) {
                    e.preventDefault();
                    handleTable();
                    setModal2Visible(false)
                    setState({
                        ...state, name: "", phone: "", email: "", password: "", conPassword: "", states: ""
                    })
                }
            }
            ))
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
    const cancelPass = () => {

        setModal2Visible(false);
    }

    const cancelBankPass = () => {
        setModalBankAccount(false);
    }

    const redirectToDetails = (farmer_id) => {
        history.push("/farmers/details/" + farmer_id);
    }

    const searchInput = (e) => {

        setState(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
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
        setApply(false);
        setPage(1)

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

    const invoicePage = (id) => {
        history.push("/invoices?searchOption=customer.id");
    }

    const updateFarmer = (obj) => {

        // setState({
        //     ...state,
        //     name: obj.name.full,
        //     email: obj.email,
        //     phone: obj.phone.national_number,
        //     state: obj.state
        // })
        history.push(`/farmers/edit/${obj.farmer_id}`);
        // setModal2Visible(true);
    }

    const submitContact = () => {
        const { name, email, phone } = state;
        if (name === "" || name === null) {
            toastError("Please enter the name");
        } else if (name.length < 3) {
            toastError("Name should contain minimum 3 characters");
        } else if (isInvalidName(name)) {
            toastError("Please enter alphabets only");
        } else if (isInvalidEmail(email)) {
            toastError("Please enter a valid email")
        } else if (phone === "" || phone === null) {
            toastError("Please enter the phone number")
        } else if (number(phone)) {
            toastError("Please enter numbers only")
        } else if (phone.length < 10 || phone.length > 10) {
            toastError("Please enter 10 digits")
        } else {
            toastSuccess("Submitted Successfully");
            setModal2Visible(false);
            setState({ ...state, name: '', email: '', phone: '' })
        }
    }

    const submitBankinfo = () => {
        const { account_type, account_no, bank_name, bank_branch, bank_address } = state;
        if (account_no === "" || account_no === null || number(account_no)) {
            toastError("Please enter the valid account number");
        } else if (account_type === "" || account_type === null) {
            toastError("Please select the account type");
        } else if (bank_name === "" || bank_name === null) {
            toastError("Please enter the bank name")
        } else if (bank_branch === "" || bank_branch === null) {
            toastError("Please enter the branch name")
        } else if (bank_address === "" || bank_address === null) {
            toastError("Please enter the bank address")
        } else {
            toastSuccess("Submitted Successfully");
            setModal2Visible(false);
            setState({ ...state, account_type: '', account_no: '', bank_name: '', bank_branch: '', bank_address: '' })
        }
    }
    const handleChangeAccountType = (e) => {
        setState({ ...state, account_type: e })
    }
    const handleChangeCountry = (e) => {
        setState({ ...state, country: e })
    }

    const handleChangeCity = (e) => {
        setState({ ...state, city: e })
    }

    const handleChangeState = (e) => {
        setState({ ...state, province: e })
    }

    const submitBilling = () => {
        const { address_1, address_2, country, province, city, postal_code } = state;
        if (address_1 === "" || address_1 === null) {
            toastError("Please enter the address line_1")
        } else if (address_2 === "" || address_2 === null) {
            toastError("Please enter the address line_2")
        } else if (country === "" || country === null) {
            toastError("Please select the country")
        } else if (province === "" || province === null) {
            toastError("Please select the province")
        } else if (city === "" || city === null) {
            toastError("Please select the city")
        } else if (postal_code === "" || postal_code === null) {
            toastError("Please enter the postal code")
        } else {
            toastSuccess("Submitted successfully")
            setModal2Visible(false);
            setState({ ...state, address_1: '', address_2: '', country: '', province: '', city: '', postal_code: '' })

        }
    }

    const checkOnchange = () => {

    }

    const submitShipping = () => {

    }



    const statusSuspendChange = (id) => {
        // let data = item;
        let data = {
            // status:'active'
        };
        dispatch(activeStatus(id, data, (result) => {
            handleTable();
            handleFarmerDashboard();
        }))
    }

    const farmerAccount = (object) => {
        setState({
            ...state,
            popup_bank_name: object?.bank_info?.acc_holder_name ?? "-",
            popup_bank_number: object?.bank_info?.acc_no ?? "-",
            popup_bank_ifsc: object?.bank_info?.ifsc ?? "-",
        })
        setModalBankAccount(true);
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
            title: "Farmer Name",
            dataIndex: "name",
            render: (name, object) =>
                <>
                    <a onClick={() => redirectToDetails(object.farmer_id)}>{name.full}</a>
                </>
        },

        {
            title: "Email",
            dataIndex: "email",
            render: (email) => `${email !== "" ? email : "-"}`

        },
        {
            title: "Phone",
            dataIndex: "phone",
            render: (phone) => `${phone.national_number}`
        },

        {
            title: "Date",
            dataIndex: "createdAt",
            render: (createdAt) => showDate(createdAt)
        },
        {
            title: "City",
            dataIndex: "address",
            render: (address) =>
                <span style={{ textTransform: "capitalize" }}>
                    {address?.billing?.city?.name}
                </span>
        },
        {
            title: "Status",
            dataIndex: "farmer_id",

            render: (farmer_id, object) => (
                <div >
                    {object.status === "active" && <button className='btn table-btn btn-success' style={{ textTransform: "capitalize" }} onClick={() => statusSuspendChange(farmer_id)}>{object.status}</button>}
                    {object.status === "inactive" && <button className='btn table-btn btn-danger' style={{ textTransform: "capitalize" }} onClick={() => statusSuspendChange(farmer_id)}>{object.status}</button>}
                    {object.status === "suspended" && <button className='btn table-btn btn-warning' style={{ textTransform: "capitalize" }} onClick={() => statusSuspendChange(farmer_id)}>{object.status}</button>}
                </div>
            )

        },
        {
            title: "Action",
            dataIndex: "farmer_id",
            render: (farmer_id, object) => (
                <div className="view_invoice">
                    <Link to={`/invoices?searchOption=customer.id&&searchInput=${farmer_id}&&name=${object?.name?.full}`} className="det_view text-primary">
                        <p className="cust_view_invoice" >
                            Invoice
                        </p>
                        {/* <span className='fe fe-eye'></span> */}
                        {/* <span class="tooltiptext ">Invoice</span> */}
                    </Link>
                    <a onClick={() => updateFarmer(object)} className="det_view tooltip_edit text-warning">
                        <p className="cust_edit_invoice" >
                            Edit
                        </p>
                        {/* <span className='fe fe-edit'></span>
                        <span class="tooltiptext tooltiptext_edit">Edit</span> */}
                        {/* <FormOutlined /> */}
                    </a>
                </div>

            )
        },
        {
            title: "View Account",
            dataIndex: "farmer_id",
            render: (farmer_id, object) => (
                <div className="view_invoice">

                    <a onClick={() => farmerAccount(object)} className="det_view text-warning">

                        <p className="cust_bank_info" >
                            Bank Info
                        </p>

                    </a>

                </div>
            )
        }

    ]

    const cancelModal3 = () => {
        setState({ ...state, name: "", password: "", conPassword: "", email: "", phone: "", states: "" })
        setModal3Visible(false)
    }

    return (
        <Layout>
            <Toaster />
            {loading ? (
                <>

                    <div className="main-content app-content mt-0" >
                        <div className="side-app">
                            <div className="container-fluid main-container p-0 ">
                                <div className="farmer_top">

                                    <DashboardField active={Dashboard.farmerActive} inactive={Dashboard.farmerInactive} suspended={Dashboard.farmerSuspended} total={Dashboard.farmerTotal} activeName="Total Active" inactiveName="Total Inactive" totalTitle="Total Farmers" suspendName="Total Suspended" name="Farmers" />

                                    <div className="farmer_header">
                                        <div className="farmer_filter" >
                                            <div className='col-xs-12 p-0'>
                                                <Filter
                                                    searchSelect={state.searchOption}
                                                    searchData={searchData}
                                                    searchOption={searchOption}
                                                    searchName="searchOption"
                                                    searchOnchangeInput={searchInput}
                                                    searchInput={state.searchInput}
                                                    searchInputName="searchInput"
                                                    statusSelect={state.status}
                                                    statusName="status"
                                                    statusOnChange={statusOnChange}
                                                    statusData={statusData}
                                                    fromName="from"
                                                    fromDate={state.from}
                                                    handleOnFromChange={handleOnFromChange}
                                                    toDate={state.to}
                                                    handleOnToChange={handleOnToChange}
                                                    toName="to"
                                                    applyFilter={applyFilter}
                                                    clearFilter={clearFilter}
                                                />
                                                <div className="col-xs-2 p-0 ">
                                                    <Link to="/farmers/add" ><button style={{margin:"10px 0 10px 15px", float: "right" }} className="create_btn">+ Create Farmer</button></Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <TableField column={column} data={profile.farmers} local={locale} current={currentPage} total={total} change={handlePageChange} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <Modal
                                title="New Customer"
                                centered
                                visible={modal2Visible}
                                onCancel={cancelPass}
                                width="40%"
                                footer={false}
                            >
                                <Tabs defaultActiveKey="1" centered >
                                    <TabPane tab="Contact" key="1">
                                        <div>
                                            <Form
                                                name="basic"
                                                labelCol={{ span: 8 }}
                                                wrapperCol={{ span: 16 }}
                                                initialValues={{ remember: true }}
                                                autoComplete="off"
                                                centered
                                            >
                                                <Form.Item
                                                    label="Name"
                                                >
                                                    <Input name="name" placeholder="Name" className="business_label" value={state.name} onChange={handleChange} />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Email"
                                                >
                                                    <Input name="email" placeholder="Email" className="business_label" value={state.email} onChange={handleChange} />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Phone"
                                                >
                                                    <Input name="phone" placeholder="phone" className="business_label" value={state.phone} onChange={handleChangeNumber} />
                                                </Form.Item>
                                                {/* <Form.Item
                      label="State"
                    >
                      <Input name="states" placeholder="state" value={state.states} onChange={handleChange} />
                    </Form.Item> */}
                                            </Form>

                                            <div className="tab_btn">
                                                {/* <button className='create_btn' style={{ marginRight: 5 }} onClick={cancelModalBusiness}>Cancel</button> */}
                                                <button className='create_btn' onClick={submitContact}>Submit</button>

                                            </div>
                                        </div>
                                    </TabPane>
                                    <TabPane tab="Banking Info" key="2">
                                        <div >
                                            <Form
                                                name="basic"
                                                labelCol={{ span: 8 }}
                                                wrapperCol={{ span: 16 }}
                                                initialValues={{ remember: true }}
                                                autoComplete="off"
                                                centered
                                                className='invaoice_label'
                                            >
                                                <div>
                                                    <Form.Item
                                                        label="Account Number:"
                                                    >
                                                        <Input name="account_no" placeholder="Account number" className="business_label" value={state.account_no} onChange={handleChangeNumber} />
                                                    </Form.Item>
                                                    <Form.Item
                                                        label="Select Account Type:"

                                                    >
                                                        <Select
                                                            value={state.account_type}
                                                            name="account_type"
                                                            onChange={handleChangeAccountType}
                                                            className="business_label"

                                                        >
                                                            <Option value="">Select</Option>
                                                            <Option value="savings">Savings</Option>
                                                            <Option value="current">Current</Option>

                                                        </Select>
                                                    </Form.Item>
                                                    <Form.Item
                                                        label="IFSC Code"
                                                    >
                                                        <Search
                                                            className="business_label"
                                                            placeholder="input search text"
                                                        // onSearch={onSearch}


                                                        />
                                                    </Form.Item>
                                                    <Form.Item
                                                        label="Bank Name"
                                                    >
                                                        <Input name="bank_name" className="business_label" value={state.bank_name} placeholder="Bank Name" onChange={handleChange} />
                                                    </Form.Item>
                                                    <Form.Item
                                                        label="Bank Branch"
                                                    >
                                                        <Input name="bank_branch" className="business_label" value={state.bank_branch} placeholder="Bank Branch" onChange={handleChange} />
                                                    </Form.Item>

                                                    <Form.Item
                                                        label="Bank Address"
                                                    >
                                                        <Input name="bank_address" className="business_label" placeholder="Bank Address"
                                                            value={state.bank_address}
                                                            onChange={handleChange}
                                                        />
                                                    </Form.Item>

                                                    <div className="tab_btn">
                                                        {/* <button className='create_btn' style={{ marginRight: 5 }} onClick={cancelModalBusiness}>Cancel</button> */}
                                                        <button className='create_btn' onClick={submitBankinfo}>Submit</button>

                                                    </div>
                                                </div>
                                            </Form>
                                        </div>
                                    </TabPane>
                                    <TabPane tab="Billing" key="3">
                                        <div>
                                            <Form
                                                name="basic"
                                                labelCol={{ span: 8 }}
                                                wrapperCol={{ span: 16 }}
                                                initialValues={{ remember: true }}
                                                autoComplete="off"
                                                centered
                                            >
                                                <Form.Item
                                                    label="Address Line 1:"
                                                >
                                                    <Input name="address_1" placeholder="Address Line 1" className="business_label" value={state.address_1} onChange={handleChange} />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Address Line 2:"
                                                >
                                                    <Input name="address_2" className="business_label" placeholder="Address Line 2" value={state.address_2} onChange={handleChange} />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Country"
                                                >
                                                    <Select
                                                        value={state.country}
                                                        name="payMode"
                                                        onChange={handleChangeCountry}
                                                        className="business_label"
                                                    >
                                                        <Option value="">Select</Option>
                                                        <Option value="india">India</Option>
                                                        <Option value="america">America</Option>

                                                    </Select>
                                                </Form.Item>
                                                <Form.Item
                                                    label="Province/State"
                                                >
                                                    <Select
                                                        value={state.province}
                                                        name="province"
                                                        onChange={handleChangeState}
                                                        className="business_label"
                                                    >
                                                        <Option value="">Select</Option>
                                                        <Option value="tamilnadu">Tamilnadu</Option>
                                                        <Option value="kerala">Kerala</Option>

                                                    </Select>
                                                </Form.Item>
                                                <Form.Item
                                                    label="City"
                                                >
                                                    <Select
                                                        value={state.city}
                                                        name="city"
                                                        onChange={handleChangeCity}
                                                        className="business_label"
                                                    >
                                                        <Option value="">Select</Option>
                                                        <Option value="chennai">Chennai</Option>
                                                        <Option value="madurai">Madurai</Option>

                                                    </Select>
                                                </Form.Item>
                                                <Form.Item
                                                    label="Postal/ZIP code"
                                                >
                                                    <Input name="postal_code" className="business_label" placeholder="postal"
                                                        value={state.postal_code}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Item>
                                            </Form>

                                            <div className="tab_btn">
                                                {/* <button className='create_btn' style={{ marginRight: 5 }} onClick={cancelModalBusiness}>Cancel</button> */}
                                                <button className='create_btn' onClick={submitBilling}>Submit</button>

                                            </div>
                                        </div>
                                    </TabPane>
                                    <TabPane tab="Documents" key="4">
                                        <div>

                                            <div className="tab_btn">
                                                {/* <button className='create_btn' style={{ marginRight: 5 }} onClick={cancelModalBusiness}>Cancel</button> */}
                                                <button className='create_btn' onClick={submitShipping}>Submit</button>

                                            </div>

                                        </div>
                                    </TabPane>
                                </Tabs>
                            </Modal>
                        </div>
                        <div>
                            <Modal
                                title="Create Farmers"
                                centered
                                visible={modal3Visible}

                                onCancel={cancelModal3}

                                footer={[
                                    <Button
                                        key="cancel"
                                        type="primary"

                                        onClick={cancelModal3}
                                    >
                                        Cancel
                                    </Button>,
                                    <Button
                                        key="submit"
                                        type="primary"
                                        onClick={createSignup}
                                    >
                                        Submit
                                    </Button>
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
                                            <Input name="name" placeholder="Name" value={state.name} onChange={handleChange} />
                                        </Form.Item>
                                        <Form.Item
                                            label="Email"
                                        >
                                            <Input name="email" placeholder="Email" value={state.email} onChange={handleChange} />
                                        </Form.Item>
                                        <Form.Item
                                            label="Phone"
                                        >
                                            <Input name="phone" placeholder="phone" value={state.phone} onChange={handleChangeNumber} />
                                        </Form.Item>
                                        <Form.Item
                                            label="State"
                                        >
                                            <Input name="states" placeholder="state" value={state.states} onChange={handleChange} />
                                        </Form.Item>


                                        <Form.Item
                                            label="Password"
                                        >
                                            <Input.Password name="password" placeholder="password" value={state.password} onChange={handleChange} />
                                        </Form.Item>
                                        <Form.Item
                                            label="Confirm Password"
                                        >
                                            <Input.Password name="conPassword" placeholder="Confirm Password" value={state.conPassword} onChange={handleChange} />
                                        </Form.Item>

                                    </Form>
                                </div>
                            </Modal>
                        </div>
                        <div>
                            <Modal
                                title="Account Details"
                                centered
                                visible={modalBankAccount}
                                className="account_card"
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
                                        <div className="pop_flex">
                                            <span className="acc_heading acc_pop_heading" >Account Number :</span>
                                            <span className="acc_info acc_pop_info">{state.popup_bank_number}</span>
                                        </div>
                                        <div className="pop_flex">
                                            <span className="acc_heading acc_pop_heading" >Account Holder Name :</span>
                                            <span className="acc_info acc_pop_info">{state.popup_bank_name}</span>
                                        </div>
                                        <div className="pop_flex">
                                            <span className="acc_heading acc_pop_heading">IFSC Code :</span>
                                            <span className="acc_info acc_pop_info">{state.popup_bank_ifsc}</span>
                                        </div>
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

        </Layout>
    );
}

export default Farmer;