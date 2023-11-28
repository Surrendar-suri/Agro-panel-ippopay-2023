import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, Form, Input, Card, Space, Spin, Table, DatePicker, Tabs, Select, Row, Col } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { isInvalidEmail, isInvalidName, number, toastError, Toaster, passwordValidations, showDate, getIsoString, showError, toastSuccess } from '../../helpers/Utils';
import { businessList, businessRegister, suspendStatus, activeStatus, businessDashboard } from '../../store/actions/businessList';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingOutlined, FormOutlined } from '@ant-design/icons';
import Filter from "../ui/filters";
import 'antd/dist/antd.css';
import Spinner from "../ui/spinner";
import TableField from "../../components/ui/table";
import DashboardField from "../../components/ui/dashboardField";
import moment from "moment";
const { TabPane } = Tabs;
const { Option } = Select;
const { Search } = Input;
function Business(props) {

  const history = useHistory()
  const dispatch = useDispatch();
  let business = useSelector(state => state.business_list.user)
  let [loading, setLoading] = useState(false);
  const [apply, setApply] = useState(true);


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
    data: [],
    from: "",
    to: "",
    status: "",
    searchOption: "",
    searchInput: "",
    business_id: "",
    country: "",
    province: "",
    city: "",
    postal_code: "",
    address_1: "",
    address_2: "",
    ship_country: "",
    ship_province: "",
    ship_city: "",
    ship_postal_code: "",
    ship_address_1: "",
    ship_address_2: "",
    checkbox: false,
    checkboxes: "",
    account_type: "",
    account_no: "",
    bank_name: "",
    bank_branch: "",
    bank_address: "",
    businessBankInfo: "",
    dashboard: ""
  });

  const [modal2Visible, setModal2Visible] = useState(false);
  const [modalBankAccount, setModalBankAccount] = useState(false);
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setPage] = useState(1);
  const [total, setTotal] = useState();
  const [modalBusiness, setModalBusiness] = useState(false);
  const [modal1Business, setModal1Business] = useState(false);
  const [statusData, setStatusData] = useState([{ value: "Active", key: "active" }, { value: "Inactive", key: "inactive" }, { value: "Suspended", key: "suspended" }])
  const [searchData, setSearchData] = useState([{ value: "Id", key: "business_id" }, { value: "Name", key: "name.full" }, { value: "City", key: "city" }, { value: "Business Name", key: "business.name" }, { value: "Phone", key: "phone.national_number" }, { value: "Email", key: "email" }])
  const [data, setData] = useState([])
  useEffect(() => {

    handleTable();
    businessNewDashboard();
    // businessNewDashboard();
  }, [currentPage, pageSize])


  const handleTable = () => {
    // setTimeout(() =>{
    //   setLoading(true);

    // },1000)
    const { to, from, status, searchOption, searchInput } = state;

    var queryParams = "?page=" + currentPage + "&limit=" + pageSize;

    if (searchInput !== "" && searchOption !== "") {
      queryParams += `&${searchOption}=` + searchInput;
    }

    if (status !== "") queryParams += "&status=" + status;
    if (from !== "") queryParams += "&from_time=" + getIsoString(from);
    if (to !== "") queryParams += "&to_time=" + getIsoString(to);
    if (from > to) {
      showError("Select the valid date", 3);
    } else {
      dispatch(businessList(queryParams, (result) => {
        if (result) {

          let data = result.business
          setLoading(true);
          setData(data)
          setTotal(result.total)
        } else {
          setLoading(false);

        }
      }));
    }
  }

  const businessNewDashboard = () => {
    dispatch(businessDashboard((result) => {

      setState({ ...state, dashboard: result?.business_dashboard });
    }))
  }
  useEffect(() => {
    if (!apply && state.searchInput === "" && state.searchOption === "" && state.status === "" && state.to === "" && state.from === "") {
      handleTable();
    }
  }, [state])

  const checkOnchange = (event) => {
    setState({ ...state, checkbox: event.target.checked })
  }
  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
    handleTable();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState(
      prevState => ({
        ...prevState,
        [name]: value
      })
    )
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

  const redirectToDetails = (business_id) => {
    history.push(`/businesses/details/${business_id}`);
  }


  const updateBusiness = (obj) => {

    setModal2Visible(true)
    history.push(`/businesses/AddEdit/${obj.business_id}`);

  }

  // added modal 
  const businessAccount = (object) => {
    setModalBankAccount(true)
    setState({
      ...state,
      businessBankInfo: object

    })

  }
  const cancelBankPass = () => {
    setModalBankAccount(false);
  }


  const businessAdd = () => {
    history.push(`/businesses/AddEdit`);

  }



  const statusSuspendChange = (id) => {
    let data = {};
    dispatch(activeStatus(id, data, (result) => {
      handleTable();
      businessNewDashboard();
    }))
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
      title: "Business Name",
      dataIndex: "name",
      render: (name, object) => <>
        <a onClick={() => redirectToDetails(object.business_id)}>{name?.full ?? "-"}</a>
      </>
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (email) => `${email ?? "-"}`
    },
    {
      title: "Phone",
      dataIndex: "phone",
      render: (phone) => `${phone.national_number}`
    },
    {
      title: "City",
      dataIndex: "address",
      render: (address) => <span style={{ textTransform: "capitalize" }}>{address?.billing?.city?.name ?? "-"}</span>
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (createdAt) => showDate(createdAt)
    },
    {
      title: "Status",
      dataIndex: "business_id",
      // key: "status",
      render: (business_id, object) => (
        <div >
          {object.status === "active" && <button className='btn btn-success table-btn ' style={{ textTransform: "capitalize" }} onClick={() => statusSuspendChange(business_id)}>{object.status}</button>}
          {object.status === "inactive" && <button className='btn btn-danger table-btn ' style={{ textTransform: "capitalize" }} onClick={() => statusSuspendChange(business_id)}>{object.status}</button>}
          {object.status === "suspended" && <button className='btn btn-warning table-btn ' style={{ textTransform: "capitalize" }} onClick={() => statusSuspendChange(business_id)}>{object.status}</button>}
        </div>
      )

    },
    {
      title: "Action",
      dataIndex: "business_id",
      render: (business_id, object) => (
        <div className="view_invoice">
          <Link to={`/invoices?searchOption=customer.id&&searchInput=${business_id}&&name=${object?.name?.full}`} className="text-primary det_view">
            <p className="cust_view_invoice" >
              Invoice
            </p>

          </Link>
          <a onClick={() => updateBusiness(object)} className="det_view text-warning">

            <p className="cust_edit_invoice" >
              Edit
            </p>

          </a>

        </div>
      )
    },
    {
      title: "View Account",
      dataIndex: "business_id",
      render: (business_id, object) => (
        <div className="view_invoice">

          <a onClick={() => businessAccount(object)} className="det_view  text-warning">

            <p className="cust_bank_info" >
              Bank Info
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

  let locale = {
    emptyText: (
      <span className="empty_data">
        <p>
          Data not found
        </p>

      </span>
    )

  };
  const searchInput = (e) => {
    setState({ ...state, searchInput: e.target.value })

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
  const clearFilter = () => {
    setState({
      ...state,
      from: "",
      to: "",
      status: "",
      searchOption: "",
      searchInput: ""
    })
    setApply(false);
    setPage(1)
  }
  const applyFilter = () => {
    handleTable();
    setPage(1)

  }



  return (
    <>
      <Toaster />
      {loading ? (
        <>
          {/*  */}
          <div className="main-content app-content mt-0" >
            <div className="side-app">
              <div className="container-fluid main-container p-0 ">
                <div className="business_top">

                  <DashboardField active={state.dashboard?.active?.count ?? "0"} inactive={state.dashboard?.inactive?.count ?? "0"} suspended={state.dashboard?.suspended?.count ?? "0"} total={total} activeName="Total Active" inactiveName="Total Inactive" totalTitle="Total Businesses" suspendName="Total Suspended" name="Business" />

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
                          <button className="create_btn" style={{margin:"10px 0 10px 15px", float: "right" }} onClick={businessAdd} >+ Create Business</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <TableField column={column} data={business.business} local={locale} current={currentPage} total={total} change={handlePageChange} />

                </div>
              </div>
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
                      <span className="acc_info acc_pop_info">{state.businessBankInfo?.payout?.account?.account_number ?? "-"}</span>
                    </div>
                    <div className="pop_flex">
                      <span className="acc_heading acc_pop_heading" >Account Holder Name :</span>
                      <span className="acc_info acc_pop_info">{state.businessBankInfo?.payout?.account?.name ?? "-"}</span>
                    </div>
                    <div className="pop_flex">
                      <span className="acc_heading acc_pop_heading">IFSC Code :</span>
                      <span className="acc_info acc_pop_info">{state.businessBankInfo?.payout?.account?.ifsc ?? "-"}</span>
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

    </>
  );
}

export default Business;