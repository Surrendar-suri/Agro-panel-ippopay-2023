import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { imagePath } from "./../../assets/ImagePath";
import { Route, Link, Routes, useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { ToastProvider, useToasts } from "react-toast-notifications";
import ApiGateway from "./../../DataServices/DataServices";
import ApiCall from "../../helpers/apicall";
import { userConstants } from "./../../constants/ActionTypes";
import {
  validate,
  currencyFormatter,
  returnTimeZoneDate,
  returnZoneDate,
  manipulateString,
  textCapitalize,
} from "./../../DataServices/Utils";
import { isInvalidEmail, isInvalidName, number, showDateTime, specialChars, uppercase, lowercase, toastError, toastSuccess, Toaster, passwordValidations, showDate, getIsoString, showError, showSuccess, toFixed } from '../../helpers/Utils';
import Pagination from "rc-pagination";
// import Select from "react-select";
import { DateRange } from "react-date-range";
import moment from "moment";
import TransactionDetail from "./TransactionDetail";
import { Button, Modal, Form, Input, Card, Space, Spin, Table, Drawer, DatePicker, Tabs, Select, message } from 'antd';
import { statementsDetails, statementsList } from "../../store/actions/statements";
import { myprofile } from '../../store/actions/profile';
import { dashboardAccountBal, dashboardList } from "../../store/actions/dashboard";
import { AutoComplete } from 'antd';
import { contactsList, addContact } from '../../store/actions/contactList';
import "../../styles/muthu.css";
import { select } from "react-cookies";
import Filter from "../ui/filters";
import Spinner from "../ui/spinner";
import TableField from "../../components/ui/table";
import {
  SearchOutlined,
  ClearOutlined,
  DeleteOutlined
} from "@ant-design/icons";

const AccountStatement = () => {

  let dispatch = useDispatch();
  const params = useParams();
  let [loading, setLoading] = useState(false)
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState("");
  const [modalAccountStatementDetail, modalsetAccountStatementDetail] = useState(false);
  const [modalQuickTransfer, modalSetQuickTransfer] = useState(false);
  const [payment, setPayment] = useState(false);
  const [bankRadio, setBankRadio] = useState("bank_account")
  const [bankCheck, setBankCheck] = useState(true)
  const [upiRadio, setUpiRadio] = useState("")
  const [upiCheck, setUpiCheck] = useState(false)
  const [verifyAccount, setVerifyAccount] = useState(true)
  const [showAddFundAccount, setShowAddFundAccount] = useState(true)
  const [showPayoutScreen, setPayoutScreen] = useState(false);
  const [paymentType, setPaymentType] = useState("IMPS");
  const [upipaymentType, setUPIPaymentType] = useState("UPI");
  const [contactBeneId, setcontactBeneId] = useState("");
  const [contactId, setcontactId] = useState("");
  const [modalBankAccount, setModalBankAccount] = useState(false);
  const [addbeneShow, setaddbeneShow] = useState(false);
  const [selectedContactShow, showSelectedContactShow] = useState(false);
  const [selectedContact, showSelectedContact] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [errorMsg, showErorrMsg] = useState(false);

  const [state, setState] = useState({
    acc_transaction_id: "",
    acc_transaction_name: "",
    acc_transaction_time: "",
    acc_transaction_created: "",
    acc_transaction_source: "",
    acc_transaction_paymode: "",
    acc_transaction_amount: "",
    acc_transaction_status: "",
    acc_transaction_contactname: "",
    trans_utr_num: "",
    trans_id: "",
    trans_fee: "",
    trans_tax: "",
    acc_transaction_transamount: "",
    trans_feetax_total: "",
    statement: [],
    name: "",
    contact_type: "",
    phone_number: "",
    email: "",
    pass_code: "",
    contact: [],
    from: "",
    to: "",
    status: "",
    searchInput: "",
    searchOption: "",
    pay_amount: "",
    pay_purpose: "",
    account_no: "",
    confirm_account_no: "",
    ifsc_no: "",
    beneficiary_name: "",
    account_phone_no: "",
    vpa: "",
  });
  // const [bankAccountDetail, setBankAccountDetail] = useState({
  //   vpa: '',
  //   account_no: "",
  //   confirm_account_no: "",
  //   ifsc_no: "",
  //   beneficiary_name: "",
  //   account_phone_no: "",
  //   verify_success_msg: false,
  //   verify_failed_msg: false,
  //   verifyupi_success_msg: false,
  //   verifyupi_failed_msg: false,
  // })
  const [statusData, setStatusData] = useState([{ value: "Success", key: "success" }, { value: "Failed", key: "failed" }])
  const [searchData, setSearchData] = useState([{ value: "Conatct Name", key: "name" }, { value: "Transaction ID", key: "id" }])

  const [bankInfo, setbanInfo] = useState({
    payoutacc_name: "",
    payoutacc_ifsc: "",
    payoutacc_number: "",
  });

  const [filter, setFilter] = useState({
    status: "",
    to: "",
    searchInput: "",
    from: "",
    searchOption: "",
  })

  const [accountBal, setAccountBal] = useState({
    merchantAccountBal: "",
  })

  const [beneficaryList, handleBeneList] = useState([]);
  const [beneficaryUpiList, handleBeneUpiList] = useState([]);
  const [beneficaryListShow, handleBeneListShow] = useState(false);
  useEffect(() => {
    handleTable();
    profiles();
    handleContacts();
    //handleContacts();
  }, [beneficaryList, contactId, contactBeneId]);

  const [apply, setApply] = useState(true)

  const handleTable = () => {

    const { status, searchInput, searchOption, from, to } =
      filter;
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
      let query = "";
      dispatch(statementsList(queryParams, (result) => {
        if (result) {
          setLoading(true);

          let data = result?.transactions ?? "";
          console.log('172',typeof data)
          setState({ ...state, statement: data });
          // setTotal(data.length)
        } else {
          setLoading(false);

        }
      }))
    }
  }
  useEffect(() => {
    if (!apply && filter.searchInput === "" && filter.searchOption === "" && filter.status === "" && filter.to === "" && filter.from === "") {
      handleTable();
    }
  }, [filter])

  const applyFilter = () => {
    handleTable();
  }
  const clearFilter = () => {

    // setState({ ...state, from: "", to: "", searchInput: "", searchOption: "", status: "" })
    // handleTable();
    setFilter(prevState => ({ ...prevState, from: "", to: "", searchInput: "", searchOption: "", status: "" }))
    setApply(false);
    setCurrentPage(1)

  }

  console.log(total);
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

  //Account Transaction Details

  const accountStatementDetail = (id) => {
    // ApiCall.get(`merchant/transaction/detail/${id}`,(response)=>
    // {
    //   console.log(response);
    //   if(response.success){
    //     console.log(response);
    //   }
    // }
    // )
    dispatch(statementsDetails(id, (result) => {

      if (result) {
        let data = result?.transfer_details;
        let name = data?.beneficiary?.name?.full ?? '';
        setState({
          ...state,
          acc_transaction_name: name ?? "-",
          acc_transaction_id: data?.trans_id ?? "-",
          acc_transaction_paymode: data?.pay_mode ?? "-",
          acc_transaction_amount: data?.final_amount ?? "-",
          acc_transaction_transamount: data?.transaction_amount ?? "-",
          acc_transaction_status: data?.status ?? "-",
          trans_utr_num: data?.utr ?? "-",
          acc_transaction_created: data?.init_source ?? "-",
          trans_fee: data?.commission?.value ?? "-",
          trans_tax: data?.commission?.tax ?? "-",
          trans_feetax_total: data?.commission?.total ?? "-",
        })
        modalsetAccountStatementDetail(true)
      }
    }));
  }
  const openQuickTransfer = () => {
    modalSetQuickTransfer(true);
  }
  const cancelContactDetails = () => {
    modalsetAccountStatementDetail(false);
    modalSetQuickTransfer(false);
  }
  const profiles = () => {
    dispatch(myprofile((result) => {
      if (result) {
        let data = result?.merchant?.payout?.account ?? "";
        setbanInfo({
          ...bankInfo,
          payoutacc_name: data?.name ?? "-",
          payoutacc_ifsc: data?.ifsc ?? "-",
          payoutacc_number: data?.account_number ?? "-",
        })
      }
    }))
    dispatch(dashboardAccountBal((result) => {
      if (result) {

        let data = result?.account?.available_balance ?? "-";

        setAccountBal({
          ...accountBal,
          merchantAccountBal: data ?? "-",

        });
      }
    }));
  }
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    handleTable();
  };

  const column = [
    {
      title: "S.No",
      dataIndex: "S.No",
      width: "60px",
      render: (value, item, index) =>
        <div style={{ paddingLeft: 10 }}>
          {(currentPage - 1) * 10 + (index + 1)}
        </div>
    },

    {
      title: "Transaction ID",
      dataIndex: "trans_id",
      width: "190px",
      render: (trans_id, object) =>
        <a
          className=""
          onClick={() => accountStatementDetail(object.trans_ref)}
        >{object.trans_id} </a>
    },

    {
      title: "Transaction Time",
      dataIndex: "createdAt",
      width: "120px",
      render: (createdAt) => showDateTime(createdAt)
    },
    {
      title: "Payment Mode",
      dataIndex: "pay_mode",
      // width: "115px",
      render: (pay_mode, object) => `${pay_mode ?? "-"}`
    },
    {
      title: "Settlement Amount",
      dataIndex: "final_amount",
      // width: "145px",
      render: (final_amount) => <span>&#x20B9; {toFixed(final_amount)}</span>
    },
    {
      title: "Fees & GST",
      dataIndex: "commission",
      // width: "95px",
      render: (commission) => <span>&#x20B9; {toFixed(commission?.total ?? "0")}</span>
    },
    {
      title: "Transaction Amount",
      dataIndex: "transaction_amount",
      // width: "150px",
      render: (transaction_amount) => <span>&#x20B9; {toFixed(transaction_amount)}</span>
    },
    {
      title: "Closing Balance",
      dataIndex: "closing_balance",
      // width: "125px",
      render: (closing_balance) => <span>&#x20B9; {toFixed(closing_balance)}</span>
    },
    {
      title: "Source",
      dataIndex: "trans_type",
      // width: "70px",
      render: (trans_type, object) =>
        <div>
          {trans_type === "CREDIT" && <span className='text-success ' style={{ textTransform: "capitalize", fontWeight: "500" }}>{trans_type}</span>}
          {trans_type === "DEBIT" && <span className='text-danger ' style={{ textTransform: "capitalize", fontWeight: "500" }}>{trans_type}</span>}
        </div>

    },
    {
      title: "Contact",
      dataIndex: "beneficiary",
      // width: "140px",
      render: (beneficiary, object) => `${beneficiary?.name?.full ?? "-"}`
    },

    {
      title: "Status",
      dataIndex: "status",
      // width: "80px",
      render: (status) =>
        <div>
          {status === "success" && <span className="badge bg-success-transparent text-success rounded-pill  p-2 px-3" style={{ textTransform: "capitalize", fontWeight: "500" }}>{status}</span>}
          {status === "processing" && <span className="badge bg-warning-transparent text-warning rounded-pill  p-2 px-3" style={{ textTransform: "capitalize", fontWeight: "500" }}>{status}</span>}
          {status === "failed" && <span className="badge bg-danger-transparent text-danger rounded-pill  p-2 px-3" style={{ textTransform: "capitalize", fontWeight: "500" }}>{status}</span>}
        </div>

    },
    // {
    //   title: "Action",
    //   dataIndex: "trans_ref",
    //   width: "60px",
    //   render: (trans_ref, object) =>
    //     <a
    //       className="btn btn-xs btn-info"
    //       onClick={() => accountStatementDetail(trans_ref)}
    //     >View </a>
    // },
    // {
    //   title: "Action",
    // },

  ]

  let locale = {
    emptyText: (
      <span className="empty_data">
        <p>
          Data not found
        </p>

      </span>
    )

  };
  //const { Option } = AutoComplete;
  const { Option, OptGroup } = Select;
  const [result, setResult] = useState([]);

  const handleSearch = (value) => {

    /* if(value.length >= 1){
      handleContacts();
    } else{
      setResult([]);
    } */
  };
  const onChange = (e, value) => {

    setcontactId(value.key);
    showSelectedContact(value.key);
    //showSelectedContactShow(true);
    handleBeneficiaryList(value);
    setModalBankAccount(false);
    setPayment(false);
  };
  const onSelect = (e, value) => {

    setcontactId(value.key);
    handleBeneficiaryList(value);
  };
  const onBeneficiaryChange = (e, value) => {
    setPayoutScreen(true);
    setcontactBeneId(value.key)
    setPayment(false);
  };
  const handleBeneficiarySearch = (value) => {

    if (value.length >= 1) {
      //handleBeneficiaryList();
    } else {
      //setResult([]);
    }
  };
  const onBeneficiarySelect = (e, value) => {

    //handleBeneficiaryList(value);
    setPayoutScreen(true);
    setcontactBeneId(value.key)
  };
  const handleContacts = () => {
    let query = "";
    dispatch(contactsList(query, (result) => {
      if (result) {
        let data = result?.contacts ?? "";
        setResult(data);
      }
    }))
  }
  const handleSelectChange = (e) => {
    setState({
      ...state,
      contact_type: e
    });
  };
  const handleBeneficiaryList = (obj) => {
    let query = "?contact_id=" + obj.key;
    ApiCall.get('merchant/list-beneficiary' + query, (response) => {
      if (response.success) {

        let beneficiaryData = response?.data?.beneficiary.bank_account_beneficiaries ?? [];
        let beneficiaryUpiData = response?.data?.beneficiary.upi_beneficiaries ?? [];
        let checkbeneficiary = response?.data?.beneficiary ?? "";

        handleBeneList(beneficiaryData)
        handleBeneUpiList(beneficiaryUpiData)
        if (beneficiaryData.length >= 1) {
          handleBeneListShow(true);
        }
        else if (beneficiaryUpiData.length >= 1) {
          handleBeneListShow(true);
        }
        else {
          handleBeneListShow(false);
          setaddbeneShow(true)
        }
      } else {
        handleBeneListShow(false);
        setaddbeneShow(true)
      }
    })
  }
  const showFundAccount = () => {
    setPayment(true);
    setPayoutScreen(false);
    setcontactBeneId('');
  }
  const upiChange = (event) => {
    setUpiRadio(event)
    setUpiCheck(true)
    setBankRadio("")
    setBankCheck(false)
    setState({ ...state, verify_success_msg: "", verify_failed_msg: "" })
  }
  const handleUpiChange = (e) => {

    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
      verify_success_msg: false,
      verify_failed_msg: false,
    }));

    setVerifyAccount(true);
    // setUpiAccount(true);

  }
  const bankChange = (event) => {
    setBankRadio(event)
    setBankCheck(true)
    setUpiRadio("")
    setUpiCheck(false)
    setState({ ...state, verify_success_msg: "", verify_failed_msg: "" })
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
      setState((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
        verify_success_msg: false,
        verify_failed_msg: false,
      }));
      setVerifyAccount(true);
      // setBankAccount(true);
    }
  }
  const handleAccountChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
      verify_success_msg: false,
      verify_failed_msg: false,
    }));

    setVerifyAccount(true);
    // setBankAccount(true);
  }
  const backOnclick = () => {
    setShowAddFundAccount(true)
    setPayment(false)
  }
  const handleChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleChangeNumber = (e) => {
    // let REGEX = /^\d+$/;
    let re = /^([0-9.])+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      setState((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const verify = () => {
    const { account_no, confirm_account_no, ifsc_no, beneficiary_name, account_phone_no, vpa } = state;
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
    } else if (bankRadio === "bank_account" && (beneficiary_name === "" || beneficiary_name === null)) {
      toastError("Please enter the beneficiary name");
    } else if (bankRadio === "bank_account" && (account_phone_no.length > 10 || account_phone_no.length < 10)) {
      toastError("Please enter the phone number in 10 digits");
    } else if (bankRadio === "bank_account" && (beneficiary_name === "" || beneficiary_name === null)) {
      toastError("Please enter the beneficiary name");
    } else if (upiRadio === "upi_id" && vpa === "" || vpa === undefined || vpa === null) {
      toastError("Please enter the UPI Number")

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
      }
      else if (upiRadio === "upi_id") {
        data = {
          vpa: vpa
        }
      }
      // let data = {
      //   acc_no: confirm_account_no,
      //   ifsc: ifsc_no,
      //   phone: {
      //     national_number: account_phone_no
      //   },
      //   name: {
      //     full: beneficiary_name
      //   }
      // }
      if (bankRadio === "bank_account") {
        setImageLoaded(true)
        ApiCall.post('merchant/bank/verify', data, (response) => {
          if (response.success) {
            setTimeout(() => {
              setImageLoaded(false)
              setVerifyAccount(false)
              toastSuccess(response.message)
              // setState({ ...state, verify_success_msg: true, verify_failed_msg: false })
              setState({ ...state, verify_success_msg: bankRadio === "bank_account" && true })
            }, 1000)
          }
          // else {
          //   setState({ ...state, verify_success_msg: false, verify_failed_msg: true })

          // }
          else {
            setTimeout(() => {
              setImageLoaded(false)
              toastError(response.message)
              setState({
                ...state,
                verify_failed_msg: response.success === false,
              })
            }, 1000)
          }
        })
      }

      else if (upiRadio === "upi_id") {
        setImageLoaded(true)
        ApiCall.post('merchant/upi/verify', data, (response) => {
          if (response.data.upi_validate.valid_vpa === "yes") {
            setTimeout(() => {
              setImageLoaded(false)
              setVerifyAccount(false)
              toastSuccess(response.message)
              // setState({ ...state, verify_success_msg: true, verify_failed_msg: false })
              setState({ ...state, verify_success_msg: upiRadio === "upi_id" && true })
            }, 1000)
          }
          //  else {
          //   setState({ ...state, verify_success_msg: false, verify_failed_msg: true })

          // }
          else {
            setTimeout(() => {
              setImageLoaded(false)
              setVerifyAccount(true)
              toastError("Invalid UPI Id")
              setState({
                ...state,
                verify_failed_msg: response.data.upi_validate.valid_vpa === "no"
              })

            }, 1000)
          }
        })

      }
    }
  }

  const addFundAcnt = (info) => {
    const { account_no, confirm_account_no, ifsc_no, beneficiary_name, account_phone_no, vpa, merchant_id } = state;
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
    } else if (upiRadio === "upi_id" && vpa === "" || vpa === undefined || vpa === null) {
      toastError("Please enter the UPI Number")

    }
    else {
      // let data = {
      //   contact_id: contactId,
      //   beneficiary_type: bankCheck ? bankRadio : upiRadio,
      //   phone: {
      //     national_number: account_phone_no
      //   },
      //   bank_info: {
      //     account_number: confirm_account_no,
      //     ifsc: ifsc_no,
      //     name: beneficiary_name
      //   },

      // }
      let data = {};
      if (bankRadio === "bank_account") {
        data = {
          contact_id: contactId,
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
          merchant_id: merchant_id,
          contact_id: contactId,
          beneficiary_type: bankCheck ? bankRadio : upiRadio === "upi_id" ? "upi" : "",
          vpa: vpa,
        }
      }
      ApiCall.post('merchant/add-beneficiary', data, (response) => {

        if (response.success) {
          toastSuccess(response.message)
          setPayoutScreen(true);
          setPayment(false);
          setcontactBeneId(response.data.beneficiary.beneficiary_id);
        } else {
          toastError(response.message)
          setPayoutScreen(false);
          setPayment(true);
          setState({
            ...state,
            account_no: "",
            confirm_account_no: "",
            ifsc_no: "",
            beneficiary_name: "",
            account_phone_no: "",
            pass_code: "",
            verify_success_msg: false
          })
          setVerifyAccount(true)
        }
      })
    }
  }
  const proceedToPayout = () => {
    addFundAcnt('new');
  }
  const makePayout = () => {
    const { pay_amount, vpa, name, } = state;
    const { merchantAccountBal } = accountBal;
    if (pay_amount === "" || pay_amount === null) {
      toastError("Please enter the amount")
    } else if (merchantAccountBal < pay_amount) {
      toastError("Insufficient fund")
    }
    else {
      // var data = {
      //   "amount": state.pay_amount,
      //   "pay_mode": paymentType,
      //   "beneficiary_id": contactBeneId
      // }
      let data = {};
      if (bankRadio === "bank_account") {
        data = {
          "amount": state.pay_amount,
          "pay_mode": paymentType,
          "beneficiary_id": contactBeneId
        }
      } else if (upiRadio === "upi_id") {
        data = {
          "amount": state.pay_amount,
          "pay_mode": upipaymentType,
          "vpa": vpa,
          "name": {
            "full": name
          }
        }
      }
      setImageLoaded(true)

      ApiCall.post('merchant/transfer', data, (response) => {

        if (response.success) {
          setTimeout(() => {
            setImageLoaded(false)
            toastSuccess(response.message)
            modalsetAccountStatementDetail(false);
            modalSetQuickTransfer(false);
            handleBeneListShow(false);
            setPayoutScreen(false);
            setState({
              ...state,
              pay_amount: "",
              pay_purpose: ""
            });
            setcontactId("");
            setcontactBeneId("");
          }, 1500)
        } else {
          setTimeout(() => {
            setImageLoaded(false)
            toastError(response.message)
          }, 400)
        }
      })
    }
  }


  const submitContact = () => {
    const { name, email, phone_number, contact_type, pass_code } = state;
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
    } else if (email === "" || email === null) {
      toastError("Please enter the email address");
    }
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

          setModalBankAccount(false)
          setState({
            ...state,
            name: "",
            contact_type: "",
            phone_number: "",
            email: "",
            pass_code: "",
          })
          setcontactId(result.contact.contact_id);
          handleContacts();
          setaddbeneShow(true);
        }
      }))
    }
  }
  const addContactOpen = () => {
    setPayment(false);
    setPayoutScreen(false);
    setModalBankAccount(true);
    setaddbeneShow(false);
    handleBeneListShow(false);
    setcontactId('');
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
          {/*  */}
          <div className="main-content app-content mt-0" >
            <div className="side-app">
              <div className="container-fluid main-container p-0 ">
                <div className="business_top">
                  <div className="business_header">
                    <h4 className="business_head">Statement List</h4>
                    <div className="payout_buttons">
                      <button
                        className="create_btn"
                        onClick={() => openQuickTransfer()}
                      >
                        Quick Transfer
                      </button>
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

                  <TableField column={column} data={state.statement} local={locale} current={currentPage} total={state.statement.length} change={handlePageChange} />

                </div>
              </div>
            </div>
            <div>
              <Drawer
                title={`Transaction Details -  #${state.acc_transaction_id}`}
                placement="right"
                visible={modalAccountStatementDetail}
                className="payout_modal"
                onClose={cancelContactDetails}
                footer={false}
                width={580}
              >
                <div className="col-xs-12 m-b-15">
                  <span className="header_title">Amount : </span>
                  <span className="header_transamount">&#x20B9;{state.acc_transaction_transamount}</span>
                </div>
                <div className="col-xs-12">
                  <div className="sub_heading_new m-b-15">
                    Payment Information
                  </div>
                  <div id="contact_details" className=" payout_view_details">
                    <div className="col-xs-12 p-0">
                      <div className="col-xs-12 col-md-7 p-0">
                        <div className="agro_view_title">UTR Number</div>
                        <div className="agro_view_desc">
                          {state.trans_utr_num}
                        </div>
                      </div>
                      <div className="col-xs-12 col-md-5 p-0">
                        <div className="agro_view_title">Transfer Method</div>
                        <div className="agro_view_desc">
                          {state.acc_transaction_paymode}
                        </div>
                      </div>
                      <div className="col-xs-12 col-md-7 p-0">
                        <div className="agro_view_title">Reference ID</div>
                        <div className="agro_view_desc">
                          {state.acc_transaction_id}
                        </div>
                      </div>
                      <div className="col-xs-12 col-md-5 p-0">
                        <div className="agro_view_title">Created By</div>
                        <div className="agro_view_desc">
                          {state.acc_transaction_created === "" ? "-" : state.acc_transaction_created}
                        </div>
                      </div>
                      <div className="col-xs-12 col-md-7 p-0">
                        <div className="col-xs-12 col-md-6 p-0">
                          <div className="agro_view_title">Fees</div>
                          <div className="agro_view_desc">
                            &#x20B9;{state.trans_fee === "" ? "-" : state.trans_fee}
                          </div>
                        </div>
                        <div className="col-xs-12 col-md-6 p-0">
                          <div className="agro_view_title">GST</div>
                          <div className="agro_view_desc">
                            &#x20B9;{state.trans_tax === "" ? "-" : state.trans_tax}
                          </div>
                        </div>
                      </div>
                      <div className="col-xs-12 col-md-5 p-0">
                        <div className="agro_view_title">Fee + Taxes</div>
                        <div className="agro_view_desc">
                          &#x20B9;{state.trans_feetax_total}
                        </div>
                      </div>

                    </div>
                    <div className="col-xs-12 p-0 m-t-10">
                      <div className="col-xs-7 p-0">
                        <div className="sub_heading_new m-b-15">
                          Transaction Information
                        </div>
                        <div className="agro_view_title"> Amount</div>
                        <div className="agro_view_desc">
                          &#x20B9;{state.acc_transaction_amount}
                        </div>
                        <div className="agro_view_title">Transaction ID</div>
                        <div className="agro_view_desc">
                          {state.acc_transaction_id}
                        </div>
                        <div className="agro_view_title">Status</div>
                        <div>
                          {state.acc_transaction_status === "success" && <span className="badge bg-success-transparent text-success rounded-pill  p-2 px-3" style={{ textTransform: "capitalize", fontWeight: "500" }}>{state.acc_transaction_status}</span>}
                          {state.acc_transaction_status === "processing" && <span className="badge bg-warning-transparent text-warning rounded-pill  p-2 px-3" style={{ textTransform: "capitalize", fontWeight: "500" }}>{state.acc_transaction_status}</span>}
                          {state.acc_transaction_status === "failed" && <span className="badge bg-danger-transparent text-danger rounded-pill  p-2 px-3" style={{ textTransform: "capitalize", fontWeight: "500" }}>{state.acc_transaction_status}</span>}
                        </div>
                      </div>
                      <div className="col-xs-5 p-0">
                        <div className="sub_heading_new m-b-15">
                          Payout sent to...
                        </div>
                        <div className="agro_view_title">Name</div>
                        <div className="agro_view_desc">
                          {state.acc_transaction_name === "" ? "-" : state.acc_transaction_name}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Drawer>

              <Drawer
                title={`Quick Transfer`}
                placement="right"
                visible={modalQuickTransfer}
                className="payout_modal"
                onClose={cancelContactDetails}
                footer={false}
                width={580}
              >
                <div className="card_top">
                  <div className="card">
                    <div className="card-body">
                      <div className="bs-vertical-wizard">
                        <ul>
                          <li className="complete"><div className="step_wrap">Debit account details confirmed <span className="desc"> Debit from Virtual Account <span className="blue font-600"> {bankInfo.payoutacc_number} </span></span></div></li>
                          <li className="complete"><div className="step_wrap">Account Balance <span className="desc"><span className="blue font-600"> &#x20B9; {accountBal.merchantAccountBal} </span></span></div></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="bs-vertical-wizard">
                    <ul>
                      <li className="current">
                        <div className="step_wrap">Who do you want to send the payout to?</div>
                        <div className="col-xs-12 p-0">
                          <div className="form-group clearfix">
                            <label className="payout_adding_section_head">Select Contact</label>
                            <div className="col-xs-12 p-0">
                              {/* <AutoComplete
                              style={{
                                width: 300,
                              }}
                              onSearch={handleSearch}
                              onSelect={onSelect}
                              onChange={onChange}
                              //placeholder="Search Contact"
                            >
                              {result.map((contact,i) => (
                                <Option key={contact.contact_id} value={contact.name.full}>
                                  {contact.name.full}
                                </Option>
                              ))}
                            </AutoComplete> */}
                              <Select
                                showSearch
                                placeholder="Select Contact"
                                optionFilterProp="children"
                                removeIcon
                                onChange={onChange}
                                onSearch={handleSearch}
                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                style={{
                                  width: 300,
                                }}
                                allowClear
                                defaultValue={contactId || undefined}
                              >
                                {result.map((contact, i) => (
                                  <Option key={contact.contact_id} value={contact.contact_id}>
                                    {contact.name.full}
                                  </Option>
                                ))}
                              </Select>
                              <div className="contact_fund_accnt_add" onClick={addContactOpen}>Add a Contact</div>
                            </div>
                          </div>
                          {selectedContactShow &&
                            <div>
                              <div className="payout_added_section_list">
                                <div className="payout_added_section_list_inner"><i className="fa fa-user"></i>{selectedContact.key}</div>
                              </div>
                            </div>
                          }
                          {modalBankAccount &&
                            <>
                              <Form
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
                                      value={state.name}
                                      className="business_input_bank ht-38"
                                      onChange={handleChange}
                                      placeholder="Enter the name"
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    className="business_form_input "
                                    label="Contact Type:"
                                  >
                                    <Select
                                      value={state.contact_type}
                                      name="contact_type"
                                      onChange={handleSelectChange}
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
                                <div className="flex">

                                  <Form.Item
                                    className="business_form_input "
                                    label="Phone:"
                                  >
                                    <Input
                                      name="phone_number"
                                      value={state.phone_number}
                                      className="business_input_bank ht-38"
                                      onChange={handleChangeNumber}
                                      placeholder="Enter phone Number"
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    className="business_form_input "
                                    label="Email:"
                                  >
                                    <Input
                                      name="email"
                                      value={state.email}
                                      className="business_input_bank ht-38"
                                      onChange={handleChange}
                                      placeholder="Enter Email Id"
                                    />
                                  </Form.Item>
                                </div>

                                <div className="flex">

                                  <Form.Item
                                    className="business_form_input "
                                    label="Pass Code:"
                                  >
                                    <Input
                                      name="pass_code"
                                      value={state.pass_code}
                                      className="business_input_bank ht-38"
                                      onChange={handleChange}
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
                              </Form>
                            </>
                          }
                          {beneficaryListShow ?
                            <div className="form-group clearfix">
                              <label className="payout_adding_section_head">Choose Fund Account Or Add new Account</label>
                              <div className="col-xs-12 p-0">
                                <Select
                                  showSearch
                                  placeholder="Select Beneficiary"
                                  optionFilterProp="children"
                                  onChange={onBeneficiaryChange}
                                  onSearch={handleBeneficiarySearch}
                                  filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                  style={{
                                    width: 300,
                                  }}
                                  allowClear
                                  defaultValue={contactBeneId || undefined}
                                // value={state.name || undefined}
                                // value={}
                                >
                                  {beneficaryList.length >= 1 &&
                                    <OptGroup label="Bank Account">
                                      {beneficaryList?.map((benefi_list, i) => (
                                        <Option key={benefi_list.beneficiary_id} value={benefi_list?.beneficiary_id} accountType="bank">
                                          {benefi_list?.bank_info?.name ?? ""} - {benefi_list?.bank_info?.account_number}
                                        </Option>
                                      ))}
                                    </OptGroup>
                                  }
                                  {beneficaryUpiList.length >= 1 &&
                                    <OptGroup label="UPI Account">
                                      {beneficaryUpiList?.map((benefi_list, i) => (
                                        <Option key={benefi_list.beneficiary_id} name={benefi_list?.vpa?.upi} value={benefi_list?.beneficiary_id} accountType="upi">
                                          {benefi_list?.vpa?.name ?? ""} - {benefi_list?.vpa?.upi}
                                        </Option>
                                      ))}
                                    </OptGroup>
                                  }
                                </Select>
                                {/* <AutoComplete
                            style={{
                              width: 300,
                            }}
                            onChange={onBeneficiaryChange}
                            onSearch={handleBeneficiarySearch}
                            onSelect={onBeneficiarySelect}
                            placeholder="Select Fund Account"
                          >
                            {beneficaryList.map((benefi_list,i) => (
                              <Option key={benefi_list.beneficiary_id} name={benefi_list?.bank_info?.account_number} value={benefi_list?.bank_info?.name ?? ""}>
                                {benefi_list?.bank_info?.name ?? ""} - {benefi_list?.bank_info?.account_number}
                              </Option>
                            ))}
                          </AutoComplete> */}
                                <div className="contact_fund_accnt_add" onClick={() => showFundAccount()}>Add a fund account</div>
                              </div>
                            </div>
                            :
                            addbeneShow ?
                              <>
                                <div className="col-xs-12 p-0">
                                  <div className="payout_info_label">Click Add Fund Account to add beneficiary</div>
                                  <div className="contact_fund_accnt_add" onClick={() => showFundAccount()}>Add a fund account</div>
                                </div>
                              </>
                              :
                              null
                          }
                          <div className="form-group clearfix m-0">

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
                                          id="f-option1"
                                          name="upiRadio"
                                          value={upiRadio}
                                          checked={upiCheck}
                                          onChange={() =>
                                            upiChange("upi_id")
                                          }
                                        />
                                        <label
                                          className="radio-check_label "
                                          for="f-option1"
                                        >
                                          UPI Id
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
                                          className="radio-check_label "
                                          for="f-option2"
                                        >
                                          Bank Account
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {bankRadio === "bank_account" ? (
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
                                            value={state.account_no || ""}
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
                                            value={
                                              state.confirm_account_no || ""
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
                                            value={state.ifsc_no || ""}
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
                                            value={state.account_phone_no || ""}
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
                                            value={state.beneficiary_name || ""}
                                            onChange={handleAccountChange}
                                          />
                                        </div>
                                      </div>
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
                                          value={state.vpa || ""}
                                          onChange={handleUpiChange}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {state.verify_success_msg && (<div className="col-xs-12 p-0 m-b-15">{success} Verified</div>)}
                                {state.verify_failed_msg && (<div className="col-xs-12 p-0 m-b-15">{failed} Not Verified</div>)}
                                <div className="contact_item_button">
                                  {verifyAccount ? (
                                    <>
                                      {state.verify_success_msg ? "" : (
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
                                  ) :
                                    <div className="col-xs-12 p-l-0">
                                      <a
                                        className="btn btn_new btn-secondary"
                                        onClick={proceedToPayout}
                                      >
                                        Proceed to Add Payout
                                      </a>
                                    </div>
                                  }
                                </div>
                              </>
                            )}
                          </div>
                          {showPayoutScreen &&
                            <div className="col-xs-12 p-0 clearfix">
                              <label className="payout_adding_section_head">Add Payout</label>
                              <div className="clr col-xs-12 col-md-6 p-l-0">
                                <div className="form-group clearfix">
                                  <label className="filter_label col-xs-12 p-l-0">
                                    Payout Amount
                                  </label>
                                  <div className="col-xs-12 p-0">
                                    <input
                                      className="fileter_form_input"
                                      type="text"
                                      name="pay_amount"
                                      value={state.pay_amount}
                                      onChange={handleChangeNumber}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-xs-12 col-md-6 p-l-0">
                                <div className="form-group clearfix">
                                  <label className="filter_label col-xs-12 p-l-0">
                                    Payout Purpose
                                  </label>
                                  <div className="col-xs-12 p-0">
                                    <input
                                      className="fileter_form_input"
                                      type="text"
                                      name="pay_purpose"
                                      value={state.pay_purpose || ""}
                                      onChange={handleChange}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-xs-12 p-0">
                                <div className="form-group clearfix">
                                  <label className="filter_label col-xs-12 p-l-0">
                                    {" "}
                                    Payment Method{" "}
                                  </label>
                                  {bankRadio ===
                                    "bank_account" ? (

                                    <>
                                      <div className="col-xs-12 p-0">
                                        <button
                                          className={
                                            paymentType === "IMPS" && state.pay_amount <= 200000
                                              ? "payment_type active"
                                              : "payment_type"
                                          }
                                          disabled={state.pay_amount > 200000 ? true : false}
                                          onClick={() =>
                                            setPaymentType("IMPS")
                                          }
                                        >
                                          IMPS
                                        </button>
                                        <button
                                          className={
                                            paymentType === "NEFT" && state.pay_amount <= 200000
                                              ? "payment_type active"
                                              : "payment_type"
                                          }
                                          disabled={state.pay_amount > 200000 ? true : false}
                                          onClick={() =>
                                            setPaymentType("NEFT")
                                          }
                                        >
                                          NEFT
                                        </button>
                                        <button
                                          className={
                                            paymentType === "RTGS"
                                              ? "payment_type active"
                                              : "payment_type"
                                          }
                                          onClick={() =>
                                            setPaymentType("RTGS")
                                          }
                                        >
                                          RTGS
                                        </button>

                                      </div>
                                    </>
                                  ) : (
                                    <div className="col-xs-12 p-0">
                                      <div
                                        className={
                                          upipaymentType === "UPI"
                                            ? "payment_type active"
                                            : "payment_type"
                                        }
                                        onClick={() =>
                                          setUPIPaymentType("UPI")
                                        }
                                      >
                                        {" "}
                                        UPI{" "}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="col-xs-12 p-l-0">
                                <a
                                  className="btn btn_new btn-primary"
                                  onClick={makePayout}
                                >
                                  Pay Now
                                </a>
                              </div>
                            </div>
                          }
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
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

export default AccountStatement;
