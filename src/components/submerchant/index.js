import React, { useState, useEffect } from 'react';
import { LoadingOutlined, FormOutlined } from '@ant-design/icons';
import { Button, Modal, Form, Input, Card, Space, Spin, Table, DatePicker } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { isInvalidEmail, isInvalidName, number, toastError, toastSuccess, Toaster, showDate, passwordValidations, getIsoString, showError } from '../../helpers/Utils';

import { merchantList, submerchantCreate, submerchantUpdate } from '../../store/actions/submerchantList';
import { useDispatch, useSelector } from 'react-redux';

import 'antd/dist/antd.css';
import Filter from "../ui/filters";
import TableField from "../../components/ui/table";
import Spinner from "../ui/spinner";

function Submerchant(props) {

  const history = useHistory()

  const dispatch = useDispatch();
  // let merchant = useSelector(state => state.sub_merchant_list.user);


  const [statusData, setStatusData] = useState([{ value: "Active", key: "active" }, { value: "Suspend", key: "suspended" }])
  const [searchData, setSearchData] = useState([{ value: "Id", key: "submerchat_id" }, { value: "Phone", key: "phone.national_number" }, { value: "Email", key: "email" }])

  const [state, setState] = useState({

    currentPage: 1,
    pageSize: 10,
    total: 0,
    data: [],
    show: true,
    subMerchant: [],
  });

  const [merchant, setMerchant] = useState({
    email: "",
    name: "",
    phone: "",
    sub_id: "",

  })

  const [filter, setFilter] = useState({
    status: "",
    to: "",
    searchInput: "",
    from: "",
    searchOption: "",
  })
  const [modal2Visible, setModal2Visible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const [currentPage, setPage] = useState(1);
  const [apply, setApply] = useState(true)

  const handleTable = () => {
    // setTimeout(() => {
    //   setLoading(true);
    // }, 1000);
    const { status, searchInput, searchOption, from, to } = filter;
    var queryParams = "?page=" + currentPage + "&limit=10";
    if (searchInput !== "" && searchOption !== "") {
      queryParams += `&${searchOption}=` + searchInput;
    }

    if (status !== "") queryParams += "&status=" + status;
    if (from !== "") queryParams += "&from_time=" + getIsoString(from);
    if (to !== "") queryParams += "&to_time=" + getIsoString(to);
    if (from > to) {
      showError("Select the valid date", 3);
    } else {
      dispatch(merchantList(queryParams, (result) => {
        if (result) {
          setLoading(true);
          setState({ ...state, subMerchant: result.subMerchants })

          setTotal(result.total)
        } else {
          setLoading(false)

        }
      }));
    }
  }

  useEffect(() => {
    if (!apply && filter.searchInput === "" && filter.searchOption === "" && filter.status === "" && filter.to === "" && filter.from === "") {
      handleTable();
    }
  }, [filter])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMerchant(
      prevState => ({
        ...prevState,
        [name]: value
      })
    )
  }

  const createSignup = (e) => {
    const { name, email, phone, sub_id } = merchant;

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
    }

    else {
      let data = {
        name: {
          full: name,
        },
        phone: {
          national_number: phone,
        },
        email: email,


      };

      let datas = {
        name: {
          full: name,
        },
        phone: {
          national_number: phone,
        },
        email: email,
      };

      if (sub_id) {
        dispatch(submerchantUpdate(sub_id, datas, (result) => {
          if (result) {

            setMerchant({
              ...merchant, sub_id: "",
            });
            handleTable();
            setModal2Visible(false)
          }
        }))
      } else {
        dispatch(submerchantCreate(data, (result) => {
          if (result) {

            setMerchant({
              ...merchant, name: "", phone: "", email: ""
            });
            handleTable();
            setModal2Visible(false)
          }
        }
        ))
      }

    }
  }
  const handleChangeNumber = (e) => {
    let REGEX = /^\d+$/;
    if (e.target.value === "" || REGEX.test(e.target.value)) {
      setMerchant(prevState => ({
        ...prevState,
        [e.target.name]: e.target.value
      }))
    }
  }

  const handlePageChange = (page) => {
    setPage(page);
    handleTable();
  };
  const cancelPass = () => {
    setMerchant({ ...merchant, name: "", email: "", phone: "" })
    setModal2Visible(false);
  }

  const redirectToDetails = (submerchant_id) => {
    history.push(`/submerchants/details/${submerchant_id}`);
  }

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );

  const submitMerchat = () => {
    setModal2Visible(true)
    setState({ ...state, show: true })
    setMerchant({ ...merchant, sub_id: "", name: "", email: "", phone: "" })

  }
  const updateMerchant = (obj) => {

    setModal2Visible(true)
    setMerchant({
      ...merchant,
      name: obj?.name?.full ?? "",
      phone: obj?.phone?.national_number ?? "",
      email: obj?.email ?? "",

      sub_id: obj?.submerchant_id ?? "",
    })
    setState({ ...state, show: false })
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
      render: (name, object) => <>
        <a onClick={() => redirectToDetails(object.submerchant_id)}>{name?.full ?? ""}</a>
      </>
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (createdAt) => showDate(createdAt)
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      render: (phone) => `${phone.national_number}`
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <div>
          {status === "active" && <span className="badge bg-success-transparent text-success rounded-pill  p-2 px-3" style={{ textTransform: "capitalize", fontWeight: "500" }}>{status}</span>}
          {status === "suspended" && <span className="badge bg-warning-transparent text-warning rounded-pill  p-2 px-3" style={{ textTransform: "capitalize", fontWeight: "500" }}>{status}</span>}
        </div>
      )
    },

    {
      title: "Action",
      dataIndex: "submerchant_id",
      render: (submerchant_id, object) => (
        // <a onClick={()=>updateMerchant(object)}>
        //   <FormOutlined />
        // </a>
        // <a onClick={() => updateMerchant(object)}>
        //    Edit
        // </a>
        <div className='view_invoice'>
          <a onClick={() => updateMerchant(object)} className="det_view tooltip_edit text-warning">
            <p className="cust_edit_invoice" >
              Edit
            </p>
          </a>
        </div>
      )
    }
  ]
  const searchInput = (e) => {

    // setState(prevState => ({
    //   ...prevState,
    //   [e.target.name]: e.target.value
    // }))
    setFilter({ ...filter, searchInput: e.target.value })

  };

  const searchOption = (e) => {

    setFilter({ ...filter, searchOption: e })
  }

  const statusOnChange = (e) => {

    setFilter({ ...filter, status: e })
  };

  const handleOnToChange = (date, dateString, e) => {

    setFilter({ ...filter, to: date })

  };

  const handleOnFromChange = (date, dateString) => {
    setFilter({ ...filter, from: date })

  };

  const applyFilter = () => {
    handleTable();
    setPage(1)

  }

  const clearFilter = () => {
    // handleTable();

    setFilter(prevState => ({ ...prevState, from: "", to: "", searchInput: "", searchOption: "", status: "" }))
    setApply(false);


    setPage(1)
  }

  useEffect(() => {
    handleTable();
  }, [])
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

    <div>

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
                        <div className='col-xs-2 p-0'>
                          <button className="create_btn" style={{ margin: "10px 0 10px 15px", float: "right" }} onClick={submitMerchat}>
                            + Create Submerchant</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <TableField column={column} data={state.subMerchant} local={locale} current={currentPage} total={total} change={handlePageChange} />
                </div>
              </div>
            </div>

            <div>
              <Modal
                title={state.show ? "Create SubMerchant" : "Update SubMerchant"}
                centered
                visible={modal2Visible}
                onCancel={cancelPass}

                footer={[
                  <button
                    key="cancel"
                    type="primary"
                    onClick={cancelPass}
                    style={{ marginRight: 5 }}
                    className="cancel_btn btn btn-default"
                  >
                    Cancel
                  </button>,
                  <button
                    key="submit"
                    type="primary"
                    onClick={createSignup}
                    className="create_btn"

                  >
                    {state.show ? "Submit" : "Update"}
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
                      <Input name="name" placeholder="Name" value={merchant.name} onChange={handleChange} />
                    </Form.Item>
                    <Form.Item
                      label="Email"
                    >
                      {merchant.sub_id ?
                        (<Input name="email" placeholder="Email" value={merchant.email} onChange={handleChange} readOnly />)
                        :
                        (<Input name="email" placeholder="Email" value={merchant.email} onChange={handleChange} />)
                      }
                    </Form.Item>
                    <Form.Item
                      label="Phone"
                    >
                      {merchant.sub_id ?

                        (<Input name="phone" placeholder="phone" value={merchant.phone} onChange={handleChangeNumber} readOnly />)
                        :
                        (<Input name="phone" placeholder="phone" value={merchant.phone} onChange={handleChangeNumber} />)
                      }
                    </Form.Item>
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
      )}

    </div>
  );
}

export default Submerchant;