import React, { useEffect, useRef, useMemo, useCallback, useState } from "react";
import ApiCall from "../../helpers/apicall";
import { useDispatch, useSelector } from "react-redux";
import { isInvalidEmail, isInvalidName, toastError, toastSuccess, Toaster, passwordValidations, showDate, getIsoString, showError, showSuccess } from '../../helpers/Utils';
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "rc-pagination/assets/index.css";
import { Button, Form, Input, Table, Select, Drawer, message } from 'antd';
import { contactsList, addContact, contactDetail, statusChange } from '../../store/actions/contactList';
import Spinner from "../ui/spinner";
import TableField from "../../components/ui/table";

const { Option } = Select;
const Contacts = () => {
  const { add_contact, header } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [modalBankAccount, setModalBankAccount] = useState(false);
  const [modalContactDetail, setModalContactDetail] = useState(false);

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState("");
  const [response, setResponse] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  const [create_contact, setCreateContact] = useState(false)
  const [payment, setPayment] = useState(false)
  const [showAddFundAccount, setShowAddFundAccount] = useState(true)
  const [bankRadio, setBankRadio] = useState("bank_account")
  const [bankCheck, setBankCheck] = useState(true)
  const [upiRadio, setUpiRadio] = useState("")
  const [upiCheck, setUpiCheck] = useState(false)
  const [verifyAccount, setVerifyAccount] = useState(true);
  const [contact, setContact] = useState("")
  const [verifyUpi, setVerifyUpi] = useState(false)
  const [verifyBank, setVerifyBank] = useState(false)
  const [bankAccount, setBankAccount] = useState(true)
  const [upiAccount, setUpiAccount] = useState(true)
  const [loading, setLoading] = useState(false);

  const [AddContact, setAddContact] = useState({
    name: "",
    contact_type: "",
    phone_number: "",
    email: "",
    pass_code: "",
    contact_id: "",

  })

  const [contactdetails, setContactDetails] = useState({
    name: "",
    contact_type: "",
    phone_number: "",
    email: "",
    id: '',

  })

  const [state, setState] = useState({
    name: "",
    contact_type: "",
    phone_number: "",
    email: "",
    pass_code: "",
    contact: [],
    beneficiaryList: [],
    beneficiaryUpiList: [],
    id: "",
    vpa: '',
    account_no: "",
    confirm_account_no: "",
    ifsc_no: "",
    beneficiary_name: "",
    account_phone_no: "",
    acc_ContactID: "",
    account: [],
    verify_success_msg: false,
    verify_failed_msg: false,
    verifyupi_success_msg: false,
    verifyupi_failed_msg: false,

  })

  const [bankAccountDetail, setBankAccountDetail] = useState({
    account_no: "",
    confirm_account_no: "",
    ifsc_no: "",
    beneficiary_name: "",
    account_phone_no: "",
    verify_success_msg: false,
    verify_failed_msg: false,
  })
  const [upiAccountDetail, setUpiAccountDetail] = useState({
    vpa: '',
    verifyupi_success_msg: false,
    verifyupi_failed_msg: false,
  })
  useEffect(() => {

    handleTable();

  }, [currentPage, payment, verifyAccount]);

  useEffect(() => {
  }, [state]);

  const createContact = () => {
    var eRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  };

  const handleTable = () => {
    // setTimeout(() => {
    //   setLoading(true);
    // }, 1000)
    var queryParams = "?page=" + currentPage + "&limit=" + pageSize;
    // let query = ;
    dispatch(contactsList(queryParams, (result) => {
      if (result) {
        setLoading(true)
        let data = result?.contacts ?? "";
        setState({ ...state, contact: data });
        setTotal(result.total)
      } else {
        setLoading(false)
      }
    }))
  }

  const contactDetails = (obj) => {
    setContact(obj)
    let query = "?contact_id=" + obj.contact_id;
    ApiCall.get('merchant/list-beneficiary/' + query, (response) => {
      if (response.success) {

        let beneficiaryData = response?.data?.beneficiary?.bank_account_beneficiaries ?? [];
        let upibeneficiarydata = response?.data?.beneficiary?.upi_beneficiaries ?? []
        setState({
          ...state,
          id: obj?.contact_id ?? "",
          beneficiaryList: beneficiaryData,
          beneficiaryUpiList: upibeneficiarydata,
        })
        setAddContact({ ...AddContact, contact_id: obj?.contact_id ?? "" })
        // setModalContactDetail(true);
        setModalBankAccount(true)
        contactAddress(obj?.contact_id ?? "");
      }
    })
  }

  const statusChanges = (id) => {
    let data = {};
    dispatch(statusChange(id, data, (result) => {
      contactDetails(contact);

    }))
  }

  const contactAddress = (id) => {
    dispatch(contactDetail(id, (result) => {
      if (result) {

        let data = result.contact

        setContactDetails({
          ...contactdetails,
          name: data?.name?.full ?? "",
          contact_type: data?.contact_type ?? "",
          phone_number: data?.phone?.national_number ?? "",
          email: data?.email ?? "",
          id: data?.contact_id ?? "",
          // beneficiaryList: beneficiaryData,
          // beneficiaryUpiList: upibeneficiarydata,
        })
      }
    }))
  }

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    handleTable();
  };

  const verify = () => {
    const { account_no, confirm_account_no, ifsc_no, beneficiary_name, account_phone_no } = bankAccountDetail;
    const { vpa } = upiAccountDetail;
    if (bankRadio === "bank_account" && (account_no === "" || account_no === null)) {
      toastError("Please enter the account number");
    } else if (bankRadio === "bank_account" && (confirm_account_no === "" || confirm_account_no === null)) {
      toastError("Please enter the confirm account number");
    } else if (bankRadio === "bank_account" && (account_no !== confirm_account_no)) {
      toastError("Account number should be same");
    } else if (bankRadio === "bank_account" && (ifsc_no === "" || ifsc_no === null)) {
      toastError("Please enter the IFSC number");

    } else if (bankRadio === "bank_account" && (account_phone_no === "" || account_phone_no === null)) {
      toastError("Please enter the phone number");
    } else if (bankRadio === "bank_account" && (account_phone_no.length > 10 || account_phone_no.length < 10)) {
      toastError("Please enter the phone number in 10 digits");
    } else if (bankRadio === "bank_account" && (beneficiary_name === "" || beneficiary_name === null)) {
      toastError("Please enter the beneficiary name");
    } else if (upiRadio === "upi_id" && (vpa === "" || vpa === null || vpa === undefined)) {
      toastError("Please enter the UPI number");

    } else {

      let data = {};
      if (bankRadio === "bank_account") {
        data = {
          acc_no: confirm_account_no,
          ifsc: ifsc_no,
          phone: {
            national_number: account_phone_no
          },
          name: {
            full: beneficiary_name
          }
        }
      } else if (upiRadio === "upi_id") {
        data = {
          vpa: vpa
        }
      }


      if (bankRadio === "bank_account") {
        setImageLoaded(true)
        ApiCall.post('merchant/bank/verify', data, (response) => {
          if (response.success) {     
              setTimeout(() => {
                setImageLoaded(false)
            toastSuccess(response.message)
            setBankAccountDetail({
              ...bankAccountDetail,
              // vpa: '',
              // account_no: "",
              // confirm_account_no: "",
              // ifsc_no: "",
              // beneficiary_name: "",
              // account_phone_no: "",
              verify_success_msg: bankRadio === "bank_account" && true,
              // verify_failed_msg: false,
              // verifyupi_success_msg: upiRadio === "upi_id" && true,
              // verifyupi_failed_msg: false,
            })
            // setState({ ...state, verify_success_msg: bankRadio === "bank_account" && true })
            if (bankRadio === "bank_account" && bankAccount === true) {
              setVerifyAccount(false)
            }
          },1000)
          } 
          else {
            setTimeout(() => {
              setImageLoaded(false)
            toastError(response.message)
            // setState({
            //   ...state,
            //   verify_failed_msg: bankRadio !== "bank_account" && response.success === false && false,
            // })
            setBankAccountDetail({
              ...bankAccountDetail,
              verify_failed_msg: response.success === false,
            })
          },800)
          }
        })
      }
      else if (upiRadio === "upi_id") {
        setImageLoaded(true)
        ApiCall.post('merchant/upi/verify', data, (response) => {

          if(response.data.upi_validate.valid_vpa === "yes") {
            setTimeout(() => {
              setImageLoaded(false)

            toastSuccess(response.message)
            setUpiAccountDetail({
              ...upiAccountDetail,
              // vpa: '',
              // account_no: "",
              // confirm_account_no: "",
              // ifsc_no: "",
              // beneficiary_name: "",
              // account_phone_no: "",
              // verify_success_msg: bankRadio === "bank_account" && true,
              // verify_failed_msg: false,
              verifyupi_success_msg: upiRadio === "upi_id" && true,
              // verifyupi_failed_msg: false,
            })
            // setState({ ...state, verifyupi_success_msg: upiRadio === "upi_id" && true })
            if (upiRadio === "upi_id" && upiAccount === true) {
              setVerifyAccount(false)
              // setUpiAccount(false)
            }
          },800)
          } 
          else {
            setTimeout(() => {
              setImageLoaded(false)
            setVerifyAccount(true)
            toastError("Invalid UPI Id")
            // setState({
            //   ...state,
            //   verifyupi_failed_msg:upiRadio !== "upi_id" && response.data.upi_validate.valid_vpa === "no"
            // })

            setUpiAccountDetail({
              ...upiAccountDetail,
              // vpa: '',
              // account_no: "",
              // confirm_account_no: "",
              // ifsc_no: "",
              // beneficiary_name: "",
              // account_phone_no: "",
              // verify_success_msg: bankRadio === "bank_account" && true,
              // verify_failed_msg: bankRadio !== "bank_account" && response.success === false && false,
              // verifyupi_success_msg: upiRadio === "upi_id" && true,
              verifyupi_failed_msg: response.data.upi_validate.valid_vpa === "no",
            })
          },1000)
          }
        })

      }
    }

  }

  const addFundAcnt = (info) => {
    const { account_no, confirm_account_no, ifsc_no, beneficiary_name, account_phone_no, id } = bankAccountDetail;
    const { vpa } = upiAccountDetail;
    if (bankRadio === "bank_account" && (account_no === "" || account_no === null)) {
      toastError("Please enter the account number");
    } else if (bankRadio === "bank_account" && (confirm_account_no === "" || confirm_account_no === null)) {
      toastError("Please enter the confirm account number");
    } else if (bankRadio === "bank_account" && (account_no !== confirm_account_no)) {
      toastError("Account number should be same");
    } else if (bankRadio === "bank_account" && (ifsc_no === "" || ifsc_no === null)) {
      toastError("Please enter the IFSC number");
    } else if (bankRadio === "bank_account" && (beneficiary_name === "" || beneficiary_name === null)) {
      toastError("Please enter the beneficiary name");
    } else if (bankRadio === "bank_account" && (account_phone_no === "" || account_phone_no === null)) {
      toastError("Please enter the phone number");
    } else if (bankRadio === "bank_account" && (account_phone_no.length > 10 || account_phone_no.length < 10)) {
      toastError("Please enter the phone number in 10 digits");
    } else if (upiRadio === "upi_id" && (vpa === "" || vpa === null || vpa === undefined)) {
      toastError("Please enter the UPI number");
    } else {
      let data = {};
      if (bankRadio === "bank_account") {
        data = {
          contact_id: id ? id : AddContact.contact_id,
          beneficiary_type: bankCheck ? bankRadio : upiRadio === "upi_id" ? "upi" : "",

          phone: {
            national_number: account_phone_no
          },
          bank_info: {
            account_number: confirm_account_no,
            ifsc: ifsc_no,
            name: beneficiary_name
          },

        }
      } else if (upiRadio === "upi_id") {
        data = {
          contact_id: id ? id : AddContact.contact_id,
          beneficiary_type: bankCheck ? bankRadio : upiRadio === "upi_id" ? "upi" : "",
          vpa: vpa,
        }
      }

      ApiCall.post('merchant/add-beneficiary', data, (response) => {

        if (response.success) {
          // setBankAccountDetail({...bankAccountDetail,
          //   vpa: '',
          //   account_no: "",
          //   confirm_account_no: "",
          //   ifsc_no: "",
          //   beneficiary_name: "",
          //   account_phone_no: "",
          //   verify_success_msg:false,
          //   verify_failed_msg: false,
          //   verifyupi_success_msg: false,
          //   verifyupi_failed_msg: false,
          // })
          // setState({ ...state, account_no: "", confirm_account_no: "", ifsc_no: "", beneficiary_name: "", account_phone_no: "", vpa: "" })

          toastSuccess(response.message)

          if (info === "single") {
            setShowAddFundAccount(true)
            setPayment(false)
            setBankAccount(false)
            setVerifyAccount(false);
            setUpiAccount(false)
            setModalContactDetail(false);
            setModalBankAccount(false)

            if (bankRadio === "bank_account" && bankAccount) {
              // setState({
              //   ...state, verify_success_msg: false,
              //   verify_failed_msg: false,

              // })
              setBankAccountDetail({
                ...bankAccountDetail,
                account_no: "",
                confirm_account_no: "",
                ifsc_no: "",
                beneficiary_name: "",
                account_phone_no: "",
                verify_success_msg: false,
                verify_failed_msg: false,

              })

            } else if (upiRadio === "upi_id" && upiAccount) {
              // setState({
              //   ...state, verifyupi_success_msg: false,
              //   verifyupi_failed_msg: false,
              // })
              setUpiAccountDetail({
                ...upiAccountDetail,
                vpa: '',
                verifyupi_success_msg: false,
                verifyupi_failed_msg: false,
              })

            }
          }
          if (info === "multiple") {
            // setState({ ...state, account_no: "", confirm_account_no: "", ifsc_no: "", beneficiary_name: "", account_phone_no: "", vpa: "" })
            // setBankAccountDetail({...bankAccountDetail,
            //   vpa: '',
            //   account_no: "",
            //   confirm_account_no: "",
            //   ifsc_no: "",
            //   beneficiary_name: "",
            //   account_phone_no: "",
            //   verify_success_msg:false,
            //   verify_failed_msg: false,
            //   verifyupi_success_msg: false,
            //   verifyupi_failed_msg: false,
            // })
            setBankAccount(true)
            setVerifyAccount(false);
            setUpiAccount(true)

            if (bankRadio === "bank_account" && bankAccount) {
              // setState({
              //   ...state, verify_success_msg: false,
              //   verify_failed_msg: false,
              //   account_no:"", confirm_account_no:"", ifsc_no:"", beneficiary_name:"", account_phone_no:""
              // })

              setBankAccountDetail({
                ...bankAccountDetail,

                account_no: "",
                confirm_account_no: "",
                ifsc_no: "",
                beneficiary_name: "",
                account_phone_no: "",
                verify_success_msg: false,
                verify_failed_msg: false,

              })


            } else if (upiRadio === "upi_id" && upiAccount) {

              // setState({
              //   ...state, verifyupi_success_msg: false,
              //   verifyupi_failed_msg: false, vpa:""
              // })

              setUpiAccountDetail({
                ...upiAccountDetail,
                vpa: '',
                verifyupi_success_msg: false,
                verifyupi_failed_msg: false,
              })
            }

            contactDetails(contact);

          }

        } else {
          toastError(response.message)
        }
      })

    }

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
      render: (name, object) => <span style={{ textTransform: "capitalize" }}>{name.full ?? "-"}</span>
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
      title: "Date",
      dataIndex: "createdAt",
      render: (createdAt) => showDate(createdAt)
    },
    {
      title: "Type",
      dataIndex: "contact_type",
      render: (contact_type) => <span style={{ textTransform: "capitalize" }}>{contact_type ?? "-"}</span>
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   render: (status) =>
    //     <div>
    //       {status === "active" && <span className="badge bg-success-transparent text-success rounded-pill  p-2 px-3" style={{ textTransform: "capitalize", fontWeight: "500" }}>{status}</span>}
    //       {status === "inactive" && <span className="badge bg-danger-transparent text-danger rounded-pill  p-2 px-3" style={{ textTransform: "capitalize", fontWeight: "500" }}>{status}</span>}
    //     </div>
    // },
    {
      title: "Bank Info",
      dataIndex: "contact_id",
      render: (contact_id, object) =>
        <a
          className="btn btn-xs btn-info"
          onClick={() => contactDetails(object)}
          style={{
            padding: "3px 8px"
          }}
        >
          Edit Bank
        </a>
    },

  ]

  // let locale = {
  //   emptyText: (
  //     <span className="empty_data">
  //       <p>
  //         Data not found
  //       </p>

  //     </span>
  //   )

  // };

  const cancelBankPass = () => {
    setModalBankAccount(false);
    setPayment(false)
    setShowAddFundAccount(true)
    setVerifyAccount(true)
    setState({
      ...state,
      name: "",
      contact_type: "",
      phone_number: "",
      email: "",
      pass_code: "",

    })

    setBankAccountDetail({
      ...bankAccountDetail,
      vpa: '',
      account_no: "",
      confirm_account_no: "",
      ifsc_no: "",
      beneficiary_name: "",
      account_phone_no: "",
      verify_success_msg: false,
      verify_failed_msg: false,
      verifyupi_success_msg: false,
      verifyupi_failed_msg: false,
    })

    setUpiAccountDetail({
      ...upiAccountDetail,
      vpa: '',
      verifyupi_success_msg: false,
      verifyupi_failed_msg: false,
    })

    setAddContact({
      ...AddContact,
      name: "",
      contact_type: "",
      phone_number: "",
      email: "",
      pass_code: "",
      contact_id: "",
    })
  }

  const cancelContactDetails = () => {
    setModalContactDetail(false);
    setPayment(false)
    setShowAddFundAccount(true)
    setVerifyAccount(true)
    setState({
      ...state,
      name: "",
      contact_type: "",
      phone_number: "",
      email: "",
      pass_code: "",

    })

    setBankAccountDetail({
      ...bankAccountDetail,
      vpa: '',
      account_no: "",
      confirm_account_no: "",
      ifsc_no: "",
      beneficiary_name: "",
      account_phone_no: "",
      verify_success_msg: false,
      verify_failed_msg: false,
      verifyupi_success_msg: false,
      verifyupi_failed_msg: false,
    })

  }

  const submitContact = () => {
    const { name, email, phone_number, contact_type, pass_code } = AddContact;
    if (name === "" || name === null) {
      toastError("Please enter the name");
    } else if (name.length < 3) {
      toastError("Please enter the name minimum 3 characters");
    } else if (isInvalidName(name)) {
      toastError("Please enter the name in alphabets only");
    } else if (contact_type === "" || contact_type === null) {
      toastError("Please select the contact_type");
    } else if (phone_number === "" || phone_number === null) {
      toastError("Please enter the phone number");
    } else if (phone_number.length > 10 || phone_number.length < 10) {
      toastError("Please enter the phone number in 10 digits");
    }
    // else if (email === "" || email === null) {
    //   toastError("Please enter the email address");
    // }
    else if (email !== "" && isInvalidEmail(email)) {
      toastError("Please enter the valid email address");
    }
    else if (pass_code === "" || pass_code === null) {
      toastError("Please enter the pass code");

    } else {
      let data = {
        name: {
          full: name
        },
        contact_type: contact_type,
        phone: {
          national_number: phone_number
        },
        email: email,
        passcode: pass_code
      }


      dispatch(addContact(data, (result) => {
        if (result) {


          // setModalBankAccount(false)
          setAddContact({
            ...AddContact,
            name: "",
            contact_type: "",
            phone_number: "",
            email: "",
            pass_code: "",
            contact_id: result?.contact?.contact_id ?? "",
          })
          contactDetails(result.contact)
          handleTable();
        }
      }))
    }
  }

  const handleChange = (e) => {
    setAddContact({
      ...AddContact,
      name: e.target.value
    });
  };

  const handleTypeChange = (e) => {
    setAddContact({ ...AddContact, contact_type: e })
  }
  const handlePassChange = (e) => {
    setAddContact({ ...AddContact, pass_code: e.target.value })
  }
  const handleEmailChange = (e) => {
    setAddContact({ ...AddContact, email: e.target.value })

  }
  const handleAccountChange = (e) => {
    setBankAccountDetail((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
      verify_success_msg: false,
      verify_failed_msg: false,
    }));

    setVerifyAccount(true);
    setBankAccount(true);
  }

  const handleUpiChange = (e) => {

    setUpiAccountDetail((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
      verifyupi_success_msg: false,
      verifyupi_failed_msg: false,
    }));

    setVerifyAccount(true);
    setUpiAccount(true);

  }
  const handleAccountNumberChange = (e) => {
    let REGEX = /^\d+$/;
    if (e.target.value === "" || REGEX.test(e.target.value)) {
      // setState((prevState) => ({
      //   ...prevState,
      //   [e.target.name]: e.target.value,
      //   verify_success_msg: false,
      //   verify_failed_msg: false,
      // }));
      setBankAccountDetail((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
        verify_success_msg: false,
        verify_failed_msg: false,
      }));
      setVerifyAccount(true);
      setBankAccount(true);
    }
  }

  const handleChangeNumber = (e) => {
    let REGEX = /^\d+$/;
    if (e.target.value === "" || REGEX.test(e.target.value)) {
      setAddContact((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const bank_acc_details = (<Form
    name="basic"
    layout="vertical"
    className=""
    initialValues={{ remember: true }}
    autoComplete="off"
  >
    <div className="flex select_ht_38" style={{ marginTop: 5 }} >

      <Form.Item
        className="business_form_input "
        label="Contact Name:"
      >
        <Input
          name="name"
          value={AddContact.name}
          autoComplete='off'
          className="business_input_bank ht-38"
          onChange={handleChange}
          placeholder="Enter Contact Name"
        />
      </Form.Item>
      <Form.Item
        className="business_form_input "
        label="Contact Type:"
      >
        <Select
          value={AddContact.contact_type}
          name="contact_type"
          onChange={handleTypeChange}
          optionFilterProp="children"
          showSearch
          filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
        >
          <Option value="">Select</Option>
          <Option value="customer">Customer</Option>
          <Option value="merchant">Merchant</Option>
          <Option value="employee">Employee</Option>
          <Option value="vendor">Vendor</Option>
          <Option value="supplier">Supplier</Option>
        </Select>
      </Form.Item>
    </div>

    <div className="flex" style={{ marginTop: 5 }}>

      <Form.Item
        className="business_form_input "
        label="Phone Number:"
      >
        <Input
          name="phone_number"
          value={AddContact.phone_number}
          autoComplete='off'
          className="business_input_bank ht-38"
          onChange={handleChangeNumber}
          placeholder="Enter Phone Number"
        />
      </Form.Item>
      <Form.Item
        className="business_form_input "
        label="Email:"
      >
        <Input
          name="email"
          value={AddContact.email}
          className="business_input_bank ht-38"
          onChange={handleEmailChange}
          autoComplete='off'
          placeholder="Enter Email"
        />
      </Form.Item>
    </div>

    <div className="flex" style={{ marginTop: 5 }}>

      <Form.Item
        className="business_form_input "
        label="Pass Code:"
      >
        <Input
          name="pass_code"
          type="password"
          value={AddContact.pass_code}
          autoComplete='off'
          className="business_input_bank ht-38"
          onChange={handlePassChange}
          placeholder="Enter Pass Code"
        />
      </Form.Item>
      <Form.Item
        className="business_form_input "
      >
      </Form.Item>
    </div>
    <div
      className="container-login100-form-btn p-r-20 "


    >
      <a
        className="login100-form-btn btn-primary"
        style={{ cursor: "pointer" }}
        onClick={submitContact}
      >
        Submit
      </a>
    </div>

  </Form>)

  const showFundAccount = () => {

    setBankAccountDetail({
      ...bankAccountDetail,
      verify_success_msg: false,
      verify_failed_msg: false,
      verifyupi_success_msg: false,
      verifyupi_failed_msg: false,
    })
    setUpiAccountDetail({
      ...upiAccountDetail,
      // verify_success_msg: false,
      // verify_failed_msg: false,
      verifyupi_success_msg: false,
      verifyupi_failed_msg: false,
    })
    setBankRadio("bank_account");
    setBankAccount(true)
    setUpiAccount(true)
    setBankCheck(true);
    setUpiRadio("");
    setUpiCheck(false);
    setShowAddFundAccount(false)
    setPayment(true)
    setVerifyAccount(true)
  }

  const upiChange = (event) => {
    setUpiRadio(event)
    setUpiCheck(true)
    setBankRadio("")
    setBankCheck(false);
    setVerifyAccount(upiAccountDetail.verifyupi_success_msg || upiAccountDetail.verifyupi_failed_msg ? false : true)
    // setState({
    //   ...state, verifyupi_success_msg: false,
    //   verify_failed_msg: false,
    // })
  }

  const bankChange = (event) => {
    setBankRadio(event)
    setBankCheck(true)
    setUpiRadio("")
    setUpiCheck(false)
    // setVerifyAccount(true)
    setVerifyAccount(bankAccountDetail.verify_success_msg || bankAccountDetail.verify_failed_msg ? false : true)


  }
  const backOnclick = () => {
    setShowAddFundAccount(true)
    setPayment(false)
  }

  const success = <svg className="checkmark check_success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle check_success" cx="26" cy="26" r="25" fill="none" /><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>;

  const failed = <svg className="checkmark m-r-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
    <circle className="checkmark__circle check_fail" cx="26" cy="26" r="25" fill="none" />
    <path className="checkmark__check" fill="none" d="M16 16 36 36 M36 16 16 36" /></svg>;

  

  return (
    <>
      <Toaster />
      {imageLoaded && (<>
        <div className="paynow-loaders-head">
          <div className="paynow-loader">

          </div>
        </div>
      </>)}
      {loading ? (
        <>

          <div className="main-content app-content mt-0" >
            <div className="side-app">
              <div className="container-fluid main-container p-0 ">
                <div className="business_top">
                  <div className="business_header">
                    <h4 className="business_head">Contact List</h4>
                    <button className="create_btn" onClick={() => setModalBankAccount(true)}>+ Add Contact</button>
                  </div>
                  {/* <div className="farmer_header">
                     <div className="farmer_filter" >
                       <div className="group_search">
 
                         <Input.Group
                           compact
                           style={{ width: "100%", display: "flex" }}
                         >
                           <select
                             className="status_select"
                             name="searchOption"
                             onChange={searchOption}
                             value={state.searchOption}
                           >
                             <option value="">Select</option>
                             <option value="business_id">Id</option>
                             <option value="name.full">Name</option>
                             <option value="city">City</option>
                             <option value="business.name">Business Name</option>
                             <option value="phone.national_number">Phone</option>
                             <option value="email">Email</option>
                           </select>
 
                           <Input
 
                             style={{ width: "70%", padding: "8px" }}
                             className="group_input"
                             placeholder="Search..."
                             name="searchInput"
                             value={state.searchInput}
                             onChange={searchInput}
                           />
                         </Input.Group>
                       </div>
 
                       <div>
 
                         <select
                           name="status"
                           value={state.status}
                           onChange={statusOnChange}
                           className="status_select">
                           <option value="">Select</option>
                           <option value="active">Active</option>
                           <option value="deactive">Deactive</option>
                         </select>
 
                       </div>
                       <div className="date-picker">
 
                         <DatePicker
                           selected={state.from}
                           dateFormat="MM-dd-yyyy"
                           placeholder="From"
                           name="from"
                           id="from"
 
                           value={state.from}
 
                           style={{ fontWeight: "500" }}
                           showYearDropdown
                           showMonthDropdown
                           ariaDescribedBy="basic-addon2"
                           onChange={handleOnFromChange}
                         />
                       </div>
                       <div className="date-picker">
 
 
                         <DatePicker
                           selected={state.to}
                           dateFormat="MM-dd-yyyy"
                           placeholder="To"
                           name="to"
                           id="to"
 
                           value={state.to}
 
                           style={{ fontWeight: "500" }}
                           showYearDropdown
                           showMonthDropdown
                           ariaDescribedBy="basic-addon2"
                           onChange={handleOnToChange}
                         />
                       </div>
 
                       <div className="filter_btn">
                         <button className="filter-button-color bg-teal" onClick={applyFilter}>Apply</button>
                         <button className="filter-button-color bg-yellow" style={{ marginLeft: "15px" }} onClick={clearFilter}>Clear</button>
                         <button className="create_btn" style={{ marginLeft: "15px" }} onClick={businessAdd} >Create</button>
                       </div>
                     </div>
                   </div> */}
                  {/* <div className="business_top">
                    <div className='agro_card_table'>
                      <div className='card'>
                        <div className='card-body'>
                          <Table
                            align="left"
                            className="gx-table-responsive agri_table"
                            columns={column}
                            locale={locale}
                            dataSource={state.contact}
                            size="middle"
                            pagination={{
                              pageSize: pageSize,
                              current: currentPage,
                              total: total,
                              onChange: handlePageChange,

                            }}
                          />
                        </div>
                      </div>
                    </div>


                  </div> */}
                  <TableField column={column} data={state.contact} current={currentPage} total={total} change={handlePageChange} />

                </div>
              </div>
            </div>
            <div>
              <Drawer
                title={AddContact.contact_id === "" ? "Create Contact" : `Contact Details - #${AddContact.contact_id}`}

                placement="right"
                className="payout_modal"
                visible={modalBankAccount}
                onClose={cancelBankPass}
                footer={false}
                width={600}

              >

                {AddContact.contact_id === "" ? (
                  <div className="card-body">
                    {bank_acc_details}
                  </div>
                ) : (
                  <div className="card-body col-xs-12">
                    <div id="contact_details" className=" payout_view_details">
                      <div className="sub_heading_new m-b-15">
                        Contact Details :
                      </div>
                      <div className="col-xs-12 p-0">
                        <div className="col-xs-12 col-md-7 p-0">
                          <div className="agro_view_title">Name</div>
                          <div className="agro_view_desc">
                            {contactdetails.name}
                          </div>
                        </div>
                        <div className="col-xs-12 col-md-5 p-0">
                          <div className="agro_view_title">Type</div>
                          <div className="agro_view_desc" style={{ textTransform: "capitalize" }}>
                            {contactdetails.contact_type}
                          </div>
                        </div>
                        <div className="col-xs-12 col-md-7 p-0">
                          <div className="agro_view_title">Email</div>
                          <div className="agro_view_desc">
                            {contactdetails.email}
                          </div>
                        </div>
                        <div className="col-xs-12 col-md-5 p-0">
                          <div className="agro_view_title">Phone</div>
                          <div className="agro_view_desc">
                            {contactdetails.phone_number}
                          </div>
                        </div>

                      </div>
                      <div className="sub_heading_new m-t-5 m-b-15">
                        Payment Methods
                        {showAddFundAccount && (
                          <div
                            className="contact_fund_accnt_add"
                            onClick={() => showFundAccount()}
                          >
                            Add a fund account
                          </div>
                        )}
                      </div>
                      {state.beneficiaryList &&
                        state.beneficiaryList.map((benefi_list, i) => {
                          return (
                            <div key={i} className="col-xs-12  payout_bank-adding_section">
                              <div className="col-xs-12 p-0">
                                <div className="d-flex m-b-10">
                                  <h5 className="beneficiary_info_title m-0">Bank</h5>
                                  {benefi_list.status === "active" && <button className='btn-xs btn btn-success status-btn' style={{ textTransform: "capitalize" }} onClick={() => statusChanges(benefi_list.beneficiary_id)} >Active</button>}
                                  {benefi_list.status === "suspended" && <button className='btn-xs btn btn-danger status-btn' style={{ textTransform: "capitalize" }} onClick={() => statusChanges(benefi_list.beneficiary_id)} >Inactive</button>}
                                </div>
                                <div className="col-xs-6 p-0">
                                  <div className="agro_view_title">Account Name</div>
                                  <div className="agro_view_desc">
                                    {benefi_list?.bank_info?.name ?? ""}
                                  </div>
                                </div>
                                <div className="col-xs-6 p-0" style={{ float: "right", textAlign: "right" }}>
                                  <div className="agro_view_title">Account Number</div>
                                  <div className="agro_view_desc">
                                    {benefi_list?.bank_info?.account_number ?? ""}
                                  </div>
                                </div>
                              </div>
                              {/* <div className="col-xs-12 p-0">
                             <h5 className="beneficiary_info_title">UPI ID</h5>
                             <div className="col-xs-6 p-0">
                               <div className="agro_view_title">Name</div>
                               <div className="agro_view_desc">
                                 {benefi_list?.bank_info?.name ?? {}}
                               </div>
                             </div>
                             <div className="col-xs-6 p-0">
                               <div className="agro_view_title">VPA ID</div>
                               <div className="agro_view_desc">
                                 9626681006@paytm
                               </div>
                             </div>
                           </div> */}
                            </div>
                          );
                        })}

                      {state.beneficiaryUpiList && state.beneficiaryUpiList.map((upilist, u) => (
                        <div key={u} className="col-xs-12 payout_bank-adding_section">

                          <div className="col-xs-12 p-0">
                            <div className="d-flex m-b-10">
                              <h5 className="beneficiary_info_title m-0">UPI ID</h5>
                              {upilist.status === "active" && <button className='btn-xs btn btn-success status-btn' style={{ textTransform: "capitalize" }} onClick={() => statusChanges(upilist.beneficiary_id)} >Active</button>}
                              {upilist.status === "suspended" && <button className='btn-xs btn btn-danger status-btn' style={{ textTransform: "capitalize" }} onClick={() => statusChanges(upilist.beneficiary_id)} >Inactive</button>}
                            </div>
                            <div className="col-xs-12 p-0">
                              <div className="agro_view_title">VPA ID</div>
                              <div className="agro_view_desc">
                                {upilist.vpa.upi}
                              </div>
                            </div>
                            {/* <div className="col-xs-6 p-0">
                           <div className="agro_view_title">VPA ID</div>
                           <div className="agro_view_desc">
                             9626681006@paytm
                           </div>
                         </div> */}
                          </div>
                        </div>
                      ))}
                      <div className="contact_add_popup_inner">
                        {payment && (
                          <>
                            <div className="col-xs-12 p-0">
                              <div className="form-group clearfix">
                                <label className="filter_label col-xs-12 p-l-0">
                                  Account Type
                                </label>
                                <div className="col-xs-12 m-b-10 p-l-0">
                                  <div className="col-xs-3 p-0 check-radio">
                                    <input
                                      className="radio-check_input "
                                      type="radio"
                                      id="upiRadio"
                                      name="upiRadio"
                                      value={upiRadio}
                                      checked={upiCheck}

                                      onChange={() =>
                                        upiChange("upi_id")
                                      }
                                    />
                                    <label
                                      className="radio-check_label agro_view_desc"
                                      for="upiRadio"
                                    >
                                      UPI ID
                                    </label>
                                  </div>
                                  <div className="col-xs-9 p-0 check-radio">
                                    <input
                                      className="radio-check_input"
                                      type="radio"
                                      id="f-option2"
                                      name="bankRadio"
                                      value={bankRadio}
                                      checked={
                                        bankCheck
                                      }
                                      onChange={() =>
                                        bankChange("bank_account")
                                      }
                                    />
                                    <label
                                      className="radio-check_label agro_view_desc"
                                      for="f-option2"
                                    >
                                      Bank Account
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {bankRadio === "bank_account" && bankAccount ? (
                              <>
                                <div className="clr col-xs-12 col-md-6 p-l-0">
                                  <div className="form-group clearfix">
                                    <label className="filter_label col-xs-12 p-l-0">
                                      Account Number
                                    </label>
                                    <div className="col-xs-12 p-0">
                                      <input
                                        className="fileter_form_input"
                                        type="text"
                                        name="account_no"
                                        autocomplete="off"
                                        value={bankAccountDetail.account_no || ""}
                                        onChange={handleAccountNumberChange}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-xs-12 col-md-6 p-l-0">
                                  <div className="form-group clearfix">
                                    <label className="filter_label col-xs-12 p-l-0">
                                      Confirm Account Number
                                    </label>
                                    <div className="col-xs-12 p-0">
                                      <input
                                        className="fileter_form_input"
                                        type="text"
                                        name="confirm_account_no"
                                        autocomplete="off"
                                        value={
                                          bankAccountDetail.confirm_account_no || ""
                                        }
                                        onChange={handleAccountNumberChange}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-xs-12 col-md-6 p-l-0">
                                  <div className="form-group clearfix">
                                    <label className="filter_label col-xs-12 p-l-0">
                                      IFSC
                                    </label>
                                    <div className="col-xs-12 p-0">
                                      <input
                                        className="fileter_form_input"
                                        type="text"
                                        name="ifsc_no"
                                        autocomplete="off"
                                        value={bankAccountDetail.ifsc_no || ""}
                                        onChange={handleAccountChange}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-xs-12 col-md-6 p-l-0">
                                  <div className="form-group clearfix">
                                    <label className="filter_label col-xs-12 p-l-0">
                                      Phone Number
                                    </label>
                                    <div className="col-xs-12 p-0">
                                      <input
                                        className="fileter_form_input"
                                        type="text"
                                        name="account_phone_no"
                                        autocomplete="off"
                                        value={bankAccountDetail.account_phone_no || ""}
                                        onChange={handleAccountNumberChange}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-xs-12 p-l-0">
                                  <div className="form-group clearfix">
                                    <label className="filter_label col-xs-12 p-l-0">
                                      Beneficiary Name
                                    </label>
                                    <div className="col-xs-12 p-0">
                                      <input
                                        className="fileter_form_input"
                                        type="text"
                                        name="beneficiary_name"
                                        autocomplete="off"
                                        value={bankAccountDetail.beneficiary_name || ""}
                                        onChange={handleAccountChange}
                                      />
                                    </div>
                                  </div>
                                  {verifyBank || bankAccountDetail.verify_success_msg && (<p>{success} Verified</p>)}
                                  {verifyBank || bankAccountDetail.verify_failed_msg && (<p>{failed} Not Verified</p>)}
                                </div>

                              </>
                            ) : (
                              <div className="col-xs-12 p-l-0 ">
                                <div className="form-group clearfix">
                                  <label className="filter_label col-xs-12 p-l-0">
                                    VPA (UPI ID)
                                  </label>
                                  <div className="col-xs-12 p-0">
                                    <input
                                      className="fileter_form_input"
                                      type="text"
                                      name="vpa"
                                      autocomplete="off"
                                      value={upiAccountDetail.vpa}
                                      onChange={handleUpiChange}
                                    />
                                  </div>
                                </div>
                                {verifyUpi || upiAccountDetail.verifyupi_success_msg && (<p>{success} Verified</p>)}
                                {verifyUpi || upiAccountDetail.verifyupi_failed_msg && (<p>{failed} Not Verified</p>)}
                              </div>
                            )}
                            <div className="contact_item_button">
                              {verifyAccount ? (

                                <>
                                  {bankRadio === "bank_account" && bankAccount && (
                                    <>
                                      {bankAccountDetail.verify_success_msg ? "" : (
                                        <div
                                          className="col-xs-12 m-b-15 p-l-0"
                                          onClick={verify}>
                                          <a
                                            className="btn btn_new btn-primary"
                                            style={{ cursor: "pointer" }} >
                                            Verify
                                          </a>
                                        </div>
                                      )}
                                    </>
                                  )}

                                  {upiRadio === "upi_id" && upiAccount && (
                                    <>
                                      {upiAccountDetail.verifyupi_success_msg ? "" : (
                                        <div
                                          className="col-xs-12 m-b-15 p-l-0"
                                          onClick={verify}>
                                          <a
                                            className="btn btn_new btn-primary"
                                            style={{ cursor: "pointer" }} >
                                            Verify
                                          </a>
                                        </div>
                                      )}
                                    </>
                                  )}

                                </>

                              ) : (
                                <>
                                  {/* <a
                                 className="btn btn_new btn-default"
                                 onClick={
                                   backOnclick
                                 }
                               >
                                 Back
                               </a> */}
                                  <a
                                    className="btn btn_new btn-secondary"
                                    onClick={() => addFundAcnt("single")}
                                  >
                                    Submit & Close
                                  </a>
                                  <a
                                    className="btn btn_new btn-primary"
                                    onClick={() => addFundAcnt("multiple")}
                                  >
                                    Submit & {bankRadio === "bank_account" && bankAccount ? "Add Another Account" : "Add Another UPI ID"}
                                  </a>
                                </>
                              )}

                            </div>
                          </>
                        )}
                      </div>

                    </div>

                  </div>
                )}

              </Drawer>
            </div>

            <div>
              <Drawer
                title={`Contact Details - #${contactdetails.id}`}
                placement="right"
                visible={modalContactDetail}
                className="payout_modal"
                onClose={cancelContactDetails}
                footer={false}
                width={650}
              >
              </Drawer>
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
};

export default Contacts;