import React, { useState, useEffect } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useHistory } from "react-router-dom";
import {
  Button,
  Modal,
  Form,
  Input,
  Card,
  Space,
  Spin,
  Table,
  DatePicker,
  Select,
  Pagination,
} from "antd";
import {
  isInvalidName,
  showError,
  showDate,
  toastError,
  Toaster,
  getIsoString,
  returnAmount,
  toFixed,
  toastSuccess,
  isInvalidEmail,
} from "../../helpers/Utils";
import {
  invoiceList,
  invoiceDashboard,
  updateSendInvoice,
} from "../../store/actions/invoice";

import {
  LoadingOutlined,
  FormOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

import { createTransaction } from "../../store/actions/transaction";
import {
  BsQuestionCircle,
  BsPlusCircle,
  BsFillTrashFill,
} from "react-icons/bs";
import Filter from "../ui/filters";
import Spinner from "../ui/spinner";
import TableField from "../../components/ui/table";
import InvoiceDashboardField from "../../components/ui/invoiceDashboardField";
import { useSearchParams } from "react-router-dom";
const { Option } = Select;
const { TextArea } = Input;

function Invoice(props) {
  const searchInputQuery = new URLSearchParams(window.location.search).get(
    "searchInput"
  );
  const searchByQuery = new URLSearchParams(window.location.search).get(
    "searchOption"
  );
  const searchByName = new URLSearchParams(window.location.search).get("name");

  const errorMessage = "Please fill the Valid To Email Address";
  const errorEmailMessage = "Please enter the valid To Valid Email Address";

  let history = useHistory();
  const dispatch = useDispatch();

  let invoice = useSelector((state) => state.invoice_list.user);
  let invoices = invoice.invoices;

  const [statusData, setStatusData] = useState([
    { value: "Draft", key: "draft" },
    { value: "Sent", key: "sent" },
    { value: "PartiallyPaid", key: "partially_paid" },
    { value: "Paid", key: "paid" },
  ]);

  const [searchData, setSearchData] = useState([
    { value: "InvoiceId", key: "invoice_id" },
    { value: "CustomerId", key: searchByQuery },
    { value: "Invoice Type", key: "invoice_type" },
    { value: "Customer Name", key: "customer.name" },
    { value: "Customer Type", key: "customer.customer_type" },
    { value: "Customer Phone", key: "customer.phone.national_number" },
    { value: "Invoice Number", key: "invoice_no" },
  ]);

  const [state, setState] = useState({
    pageSize: 10,
    name: "",
    description: "",
    cost: "",
    currency: "",
    quantity: "",
    from: "",
    to: "",
    status: "",
    searchOption: "",
    searchInput: "",
    invoiceId: "",
    date: moment(new Date()),
    table: false,
    invoices: [],
    value: "",
  });
  const [id, setId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState();
  const [selectValue, setSelectValue] = useState();
  const [apply, setApply] = useState(true);
  const [finalAmount, setFinalAmount] = useState();

  const [payment, setPayment] = useState({
    date: moment(new Date()),
    amount: "",
    payMode: "cash",
    notes: "",
    final: "",
    due: "",
  });

  const [dashboard, setDashboard] = useState({
    draft: "",
    paid: "",
    partially_paid: "",
    totalAmount: "",
    paidAmount: "",
    dueAmount: "",
    total: "",
  });
  const [sendInvoices, setSendInvoices] = useState({
    from: "",
    to: "",
    message: "",
    subject: "",
    checkbox_1: false,
    checkbox_2: true,
  });

  const [toInvoice, setToInvoice] = useState([{ to: "" }]);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [modalPayment, setModalPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [recordId, setRecordId] = useState("");
  useEffect(() => {
    handleTable();
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (
      !apply &&
      state.searchInput === "" &&
      state.searchOption === "" &&
      state.status === "" &&
      state.to === "" &&
      state.from === ""
    ) {
      handleTable();
      // InvoicesDashboard();
    }
  }, [state]);

  // Record
  const handlePayment = () => {
    setModal2Visible(true);
  };

  const sendInvoice = () => {
    setInvoiceModal(true);
  };

  const cancelInvoiceModal = () => {
    setInvoiceModal(false);
    // setToInvoice({ ...toInvoice, to: "" })
    this.setState({
      value: "",
    });
  };

  const check_1Onchange = (event) => {
    setSendInvoices({ ...sendInvoices, checkbox_1: event.target.checked });
  };

  const check_2Onchange = (event) => {
    setSendInvoices({ ...sendInvoices, checkbox_2: event.target.checked });
  };
  const handleChangeInvoice = (e) => {
    setSendInvoices((prevSendInvoices) => ({
      ...prevSendInvoices,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddClick = () => {
    const notEmpty = checkEmptyProduct();

    if (!notEmpty) {
      setToInvoice([...toInvoice, { to: "" }]);
    } else {
      toastError(errorMessage);
    }
  };

  const checkEmptyProduct = () => {
    let result;

    let input = toInvoice;
    for (let i = 0; i < input.length; i++) {
      let inputItem = input[i];
      if (inputItem.to === "") {
        result = true;
      } else if (isInvalidEmail(inputItem.to)) {
        result = true;
      }
    }
    return result;
  };

  let items = [];
  for (let i = 0; i < toInvoice.length; i++) {
    let inputItem = toInvoice[i];
    let data = {
      sno: i + 1,
      to: inputItem.to,
    };
    items.push(data);
  }

  const cancelPayment = () => {
    setState({
      ...state,
      date: moment(new Date()),
      notes: "",
      invoiceId: "",
      amount: state.final - state.amountpaid,
      due: state.final - state.amountpaid,
    });

    setModalPayment(false);
  };

  const handleTable = () => {
    const { status, searchInput, searchOption, from, to } = state;

    var queryParams = "?page=" + currentPage + "&limit=" + pageSize;
    if (
      (searchInput !== "" && searchOption !== "") ||
      (searchInputQuery && searchByQuery)
    ) {
      queryParams += `&${searchByQuery ?? searchOption}=${searchInputQuery ?? searchInput
        }`;
      if (searchInputQuery) {
        setState({
          ...state,
          searchInput: searchInputQuery,
          searchOption: searchByQuery,
        });
        InvoicesDashboard();
      }
    }
    if (status !== "") queryParams += "&status=" + status;
    if (from !== "") queryParams += "&from_time=" + getIsoString(from);
    if (to !== "") queryParams += "&to_time=" + getIsoString(to);
    if (from > to) {
      showError("Select the valid date", 3);
    } else {
      getInvoices({ queryParams });
    }

    InvoicesDashboard();
  };

  const getInvoices = ({ queryParams }) => {
    // setTimeout(() => {
    //     setLoading(true);
    // },1000)

    dispatch(
      invoiceList(queryParams, (result) => {
        if (result) {
          let data = result.invoices;
          setLoading(true);
          setTotal(result.total);
          setFinalAmount(result.invoices.cost.final);
        } else {
          setLoading(false);
        }
      })
    );
  };

  const InvoicesDashboard = () => {
    const { status, searchInput, searchOption, from, to } = state;

    var queryParams = "?";
    if (
      (searchInput !== "" && searchOption !== "") ||
      (searchInputQuery && searchByQuery)
    ) {
      queryParams += `&${searchByQuery ?? searchOption}=${searchInputQuery ?? searchInput
        }`;
      if (searchInputQuery) {
        setState({
          ...state,
          searchInput: searchInputQuery,
          searchOption: searchByQuery,
        });
      }
    }
    if (status !== "") queryParams += "&status=" + status;
    if (from !== "") queryParams += "&from_time=" + getIsoString(from);
    if (to !== "") queryParams += "&to_time=" + getIsoString(to);
    else {
      dispatch(
        invoiceDashboard(queryParams, (result) => {
          if (result) {
            let data = result?.invoice_dashboard;
            dashBoardCalculation(
              data?.draft,
              data?.paid,
              data?.partially_paid,
              data?.sent
            );
          }
        })
      );
    }
  };

  const dashBoardCalculation = (draft, paid, partiallyPaid, sent) => {
    let paidAmount =
      returnAmount(paid?.paid) +
      returnAmount(partiallyPaid?.paid) +
      returnAmount(draft?.paid) +
      returnAmount(sent?.paid);
    let total =
      returnAmount(paid?.cost) +
      returnAmount(partiallyPaid?.cost) +
      returnAmount(draft?.cost) +
      returnAmount(sent?.cost);
    let dueAmt =
      returnAmount(draft?.balance) +
      returnAmount(partiallyPaid?.balance) +
      returnAmount(paid?.balance) +
      returnAmount(sent?.balance);

    setDashboard({
      totalAmount: toFixed(total),
      paidAmount: toFixed(paidAmount),
      dueAmount: toFixed(dueAmt),
      // total: (dashboard.paid === undefined ? 0 : dashboard.paid.count) +
      //     (dashboard.draft === undefined ? 0 : dashboard.draft.count) +
      //     (dashboard.partially_paid === undefined ? 0 : dashboard.partially_paid.count)
    });
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const redirectToDetails = (item_id) => {
    history.push("/invoices/details/" + item_id);
  };

  const addInvoice = () => {
    history.push("/invoices/add");
  };

  const updateInvoice = (id) => {
    history.push("/invoices/edit/" + id);
  };

  const changeSelectOption = (e, obj, index) => {
    var selectedVal = e.target.value;
    document.querySelectorAll('[name=action' + index + ']')[0].value = 'record';
    //setSelectValue(selectedVal);
    if (selectedVal == "view") {
      history.push("/invoices/details/" + obj.invoice_id);
    } else if (selectedVal == "edit") {
      history.push("/invoices/edit/" + obj.invoice_id);
    } else if (selectedVal === "record") {
      setModal2Visible(true);
      setRecordId(index);
      setState({ ...state, invoiceId: obj.invoice_id, value: "" });
      setPayment({
        ...payment,
        amount: obj.cost.final - obj.partial_payment.paid,
        due: obj.cost.final - obj.partial_payment.paid,
      });
    } else if (selectedVal === "send") {
      setId(obj.invoice_id);
      let message = `Dear ${obj?.customer?.name},\nThank you for your business.Your invoice can be viewed,printed and downloaded as PDF from the link below.You can also choose to pay it online\n\n${window.location.protocol}//pay.ippopay.com/${obj.link_url}`;

      setSendInvoices({
        ...sendInvoices,
        from: obj?.merchant?.email,
        message: message,
        subject:
          "Invoice " + "#" + obj.invoice_no + " from " + obj?.merchant?.name,
      });
      setInvoiceModal(true);
      setState({ ...state, value: "" });
    }
  };

  const sendOption = () => {
    setInvoiceModal(true);
  };

  const cancelTransaction = () => {
    setModal2Visible(false);
    // changeSelectOption("");
    //setSelectValue(...selectValue,"");
    document.querySelectorAll('[name=action' + recordId + ']')[0].value = '';
    setPayment({
      ...payment,
      date: moment(new Date()),
      notes: "",
    });
    setState({ ...state, invoiceId: "" });
    // history.push("/invoices");
    // window.location.reload();
  };
  const column = [
    {
      title: "S.No",
      dataIndex: "S.No",
      render: (value, item, index) => (
        <div style={{ paddingLeft: 10 }}>
          {(currentPage - 1) * 10 + (index + 1)}
        </div>
      ),
    },

    {
      title: "Invoice Number",
      dataIndex: "invoice_no",
      render: (invoice_no, object) => (
        <>
          <a onClick={() => redirectToDetails(object.invoice_id)}>
            {invoice_no}
          </a>
        </>
      ),
    },
    {
      title: "Customer Name",
      dataIndex: "customer",
      render: (customer) => (
        <>
          <span style={{ textTransform: "capitalize" }}>
            {customer.name && customer.name !== "" ? customer.name : "-"}
          </span>
        </>
      ),
    },
    {
      title: "Type",
      dataIndex: "invoice_type",
      key: "invoice_type",
      render: (key) => (
        <div>
          {key === "f2m" ? "Farmer" : ""}
          {key === "m2b" ? "Business" : ""}
        </div>
      ),
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      width: "130px",
      render: (createdAt) => showDate(`${createdAt}`),
    },
    {
      title: "Total",
      dataIndex: "cost",
      render: (cost) => (
        <p style={{ margin: 0 }}>&#x20B9; {toFixed(cost.final)}</p>
      ),
    },
    {
      title: "Paid",
      dataIndex: "partial_payment",
      render: (partial_payment) => (
        <p style={{ margin: 0 }}>
          &#x20B9; {toFixed(partial_payment?.paid ?? 0)}
        </p>
      ),
    },
    {
      title: "Due Amount",
      dataIndex: "cost",
      render: (cost, object) => (
        <p style={{ margin: 0 }}>
          &#x20B9; {toFixed(object.cost.final - object.partial_payment.paid)}
        </p>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (key, status, index) => (
        <div key={index} style={{ textTransform: "capitalize" }}>
          {key === "draft" && (
            <span
              className="text-primary "
              style={{ textTransform: "capitalize", fontWeight: "500" }}
            >
              {key}
            </span>
          )}
          {key === "partially_paid" && (
            <span
              className=" text-warning "
              style={{ textTransform: "capitalize", fontWeight: "500" }}
            >
              PartiallyPaid
            </span>
          )}
          {key === "paid" && (
            <span
              className=" text-success "
              style={{ textTransform: "capitalize", fontWeight: "500" }}
            >
              {key}
            </span>
          )}
          {key === "sent" && (
            <span
              className=" text-success "
              style={{ textTransform: "capitalize", fontWeight: "500" }}
            >
              {key}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "invoice_id",
      placeholder: "Select Action",
      key: "action",
      render: (invoice_id, object, index) => (
        <div className="select_bg_wrap">
          <i class="angle fe fe-chevron-down"></i>
          {/* <i class="bx bx-chevron-down"></i> */}
          <select
            placeholder="Select Action"
            onChange={(e) => changeSelectOption(e, object, index)}
            className="select_bg"
            name={"action" + index}
          //value={selectValue}
          //  defaultValue="Select Action"
          >
            <option value="">Select Action</option>
            <option value="view">View</option>
            {object?.status === "draft" && <option value="edit">Edit</option>}
            {object?.invoice_type === "m2b" &&
              (object?.status === "partially_paid" ||
                object?.status === "draft") ? (
              <option value="record">Record a payment</option>
            ) : (
              ""
            )}

            {object?.invoice_type === "m2b" && object?.status === "draft" ? (
              <option value="send">Send</option>
            ) : (
              ""
            )}

            {/* <Option value="export">Export as PDF</Option>
                    <Option value="print">Print</Option> */}
          </select>
        </div>
        // <a onClick={() => updateInvoice(invoice_id)}>
        //     <FormOutlined />
        // </a>
      ),
    },
  ];

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;

    const list = [...toInvoice];
    list[index][name] = value;
    setToInvoice(list);
  };

  const handleRemoveClick = (index) => {
    let input = toInvoice;
    input.splice(index, 1);
    setToInvoice([...input]);
  };

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );
  const searchInput = (e) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const searchOption = (e) => {
    setState({ ...state, searchOption: e });
  };

  const statusOnChange = (e) => {
    setState({ ...state, status: e });
  };
  const handleOnToChange = (date, dateString, e) => {
    setState({ ...state, to: date });
  };

  const handleOnFromChange = (date, dateString) => {
    setState({ ...state, from: date });
  };

  const handleOnPaydateChange = (date, dateString) => {
    setPayment({ ...payment, date: date });
  };
  const handleChangeNumbers = (e) => {
    let guidRegex = /^([0-9.])+$/;
    if (e.target.value === "" || guidRegex.test(e.target.value)) {
      setPayment((prevPayment) => ({
        ...prevPayment,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleChangePayment = (e) => {
    setPayment({ ...payment, payMode: e });
  };

  const notesOnchange = (e) => {
    setPayment((prevPayment) => ({
      ...prevPayment,
      [e.target.name]: e.target.value,
    }));
  };

  const createTransactions = (e) => {
    const { date, amount, payMode, notes, due } = payment;
    if (date === "" || date === null) {
      toastError("Please select the date");
    } else if (amount === "" || amount === null) {
      toastError("Please enter the amount");
    } else if (amount > due || amount <= 0) {
      toastError("Please enter valuable amount");
    } else if (payMode === "" || payMode === null) {
      toastError("Please select the paymode");
    } else {
      let data = {
        cost: amount,
        recorded_date: date,
        manual_payment_mode: payMode,
        notes: notes,
      };

      dispatch(
        createTransaction(data, state.invoiceId, (result) => {
          e.preventDefault();
          if (result) {
            setModal2Visible(false);
            setPayment({ ...payment, notes: "", date: moment(new Date()) });
            handleTable();
          }
        })
      );
    }
  };

  const createInvoiceModal = () => {
    const notEmpty = checkEmptyProduct();

    const { from, to, message, subject, checkbox_1, checkbox_2 } = sendInvoices;

    var toEmailIds = toInvoice.map(function (obj) {
      return obj.to;
    });

    if (from === "" || from === null || from === undefined) {
      toastError("Please enter the From Email Address");
    } else if (notEmpty) {
      toastError("Please enter the valid To Email Address");
    } else if (subject === "" || subject === null || subject === undefined) {
      toastError("Please enter the subject");
    } else if (message === "" || message === null || message === undefined) {
      toastError("Please enter the message");
    } else {
      let data = {
        from: from,
        to: toEmailIds,
        subject: subject,
        message: message,
        send_copy: checkbox_1,
        attach_pdf: checkbox_2,
      };

      if (!notEmpty) {
        dispatch(
          updateSendInvoice(id, data, (result) => {
            if (result) {
              setInvoiceModal(false);
              handleTable();
              setToInvoice({ ...toInvoice, to: "" });
            }
          })
        );
      }
    }
  };
  const applyFilter = () => {
    handleTable();
    // InvoicesDashboard();

    setCurrentPage(1);
  };
  const clearFilter = () => {
    setApply(false);
    setState({
      ...state,
      from: "",
      to: "",
      searchInput: "",
      searchOption: "",
      status: "",
    });
    // setApply(false)
    history.push("/invoices");
    setCurrentPage(1);
    getInvoices({
      queryParams: `?page=${1}&limit=${10}`,
    });
  };
  let locale = {
    emptyText: (
      <span className="empty_data">
        <p>Data not found</p>
      </span>
    ),
  };

  const { totalAmount, paidAmount, dueAmount } = dashboard;

  const symbol = (i) => (
    <>
      <span>
        {items.length !== 1 ? (
          <p style={{ margin: 0 }} onClick={() => handleRemoveClick(i)}>
            <MinusCircleOutlined
              style={{ marginTop: "5px", fontSize: "17px", color: "#808080" }}
              className="remove_input_btn"
            />
          </p>
        ) : (
          <p style={{ margin: 0 }}>
            <MinusCircleOutlined
              style={{ marginTop: "5px", fontSize: "17px", color: "#808080" }}
              className="remove_input_btns"
            />
          </p>
        )}{" "}
      </span>
      <span>To</span>
    </>
  );
  return (
    <>
      <Toaster />
      {loading ? (
        <>
          <div className="main-content app-content mt-0">
            <div className="side-app">
              <div className="container-fluid main-container p-0 ">
                <div className="container_top">
                  {searchByName && (
                    <div>
                      <p className="business_head">
                        Customer Name :{" "}
                        <span style={{ textTransform: "capitalize" }}>
                          {searchByName}
                        </span>
                      </p>
                    </div>
                  )}

                  <InvoiceDashboardField
                    totalAmount={totalAmount}
                    paidAmount={paidAmount}
                    dueAmount={dueAmount}
                    total={total}
                  />
                  <div className="farmer_header">
                    <div className="farmer_filter">
                      <div className="col-xs-12 p-0">
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
                          <button
                            className="create_btn"
                            style={{ margin: "10px 0 10px 15px", float: "right" }}
                            onClick={addInvoice}
                          >
                            + Create Invoice
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <TableField
                    column={column}
                    data={invoices}
                    local={locale}
                    current={currentPage}
                    total={total}
                    change={handlePageChange}
                  />
                </div>
                <div>
                  <Modal
                    title="Record a payment"
                    centered
                    visible={modal2Visible}
                    onCancel={cancelTransaction}
                    footer={[
                      <button
                        key="cancel"
                        type="primary"
                        onClick={cancelTransaction}
                        className="cancel_btn"
                        style={{ marginRight: "10px" }}
                      >
                        Cancel
                      </button>,
                      <button
                        key="submit"
                        type="primary"
                        className="create_btn "
                        onClick={createTransactions}
                      >
                        Submit
                      </button>,
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
                        <Form.Item label="Payment Date">
                          <DatePicker
                            dateFormat="MM-dd-yyyy"
                            placeholder="Paydate"
                            name="date"
                            id="date"
                            value={payment.date}
                            style={{
                              fontWeight: "500",
                              padding: "5px",
                              width: "60%",
                              margin: 0,
                            }}
                            showYearDropdown
                            showMonthDropdown
                            ariaDescribedBy="basic-addon2"
                            onChange={handleOnPaydateChange}
                          />
                        </Form.Item>
                        <Form.Item label="Amount(INR)">
                          <Input
                            name="amount"
                            placeholder="amount"
                            value={payment.amount}
                            onChange={handleChangeNumbers}
                          />
                        </Form.Item>
                        <Form.Item label="Payment Mode">
                          <Select
                            value={payment.payMode}
                            name="payMode"
                            onChange={handleChangePayment}
                            style={{ width: "100%" }}
                          >
                            <Option value="cash">Cash</Option>
                            <Option value="online">Online</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item label="Notes">
                          <Input
                            name="notes"
                            placeholder="Notes"
                            value={payment.notes}
                            onChange={notesOnchange}
                          />
                        </Form.Item>
                      </Form>
                    </div>
                  </Modal>
                </div>
                <div>
                  <Modal
                    title="Send this invoice"
                    centered
                    visible={invoiceModal}
                    width="45%"
                    onCancel={cancelInvoiceModal}
                    footer={[
                      <button
                        key="cancel"
                        type="primary"
                        className="cancel_btn"
                        style={{ marginRight: "10px" }}
                        onClick={cancelInvoiceModal}
                      >
                        Cancel
                      </button>,
                      <button
                        key="submit"
                        type="primary"
                        className="create_btn "
                        onClick={createInvoiceModal}
                      >
                        Submit
                      </button>,
                    ]}
                  >
                    <div>
                      <Form
                        name="basic"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 18 }}
                        initialValues={{ remember: true }}
                        autoComplete="off"
                      >
                        <Form.Item label="From">
                          <div className="send_invoice_input">
                            <Input
                              name="from"
                              placeholder="From"
                              className="invoice_width business_input"
                              value={sendInvoices.from}
                              readOnly
                            />
                            <BsQuestionCircle
                              style={{ color: "#808080" }}
                              className="invoice_input_icon"
                            />
                          </div>
                        </Form.Item>

                        {items && items.length !== 0
                          ? items &&
                          items.map((item, i) => (
                            <Form.Item label={symbol(i)}>
                              <div className="send_invoice_input">
                                <Input
                                  name="to"
                                  value={item.to}
                                  placeholder="To"
                                  autoComplete="off"
                                  className="to-input business_input"
                                  onChange={(e) => handleInputChange(e, i)}
                                />
                                <BsPlusCircle
                                  className="invoice_plus_icon"
                                  onClick={handleAddClick}
                                />
                              </div>
                              {/* <div style={{ width: "100%", marginBottom: "25px", marginTop: "25px" }}>

                                                        {items && items.length !== 0 ? items && items.map((item, i) => (
                                                            <table>
                                                                <tbody>
                                                                    <tr>
                                                                        <td >
                                                                            <div className="col-send">
                                                                                <span className="to-send">{items.length !== 1 ? (<p style={{ margin: 0 }} onClick={() => handleRemoveClick(i)}><MinusCircleOutlined className="remove_input_btn" /></p>) : (<p style={{ margin: 0 }} ><MinusCircleOutlined className="remove_input_btns" /></p>)} </span>
                                                                                <span style={{ marginRight: "28px" }}>To</span>
                                                                            </div>
                                                                        </td>

                                                                        <td >

                                                                            <Input
                                                                                name="to"
                                                                                value={item.to}
                                                                                placeholder="To"
                                                                                style={{ height: "35px" }}
                                                                                autoComplete="off"
                                                                                className="to-input"
                                                                                onChange={(e) => handleInputChange(e, i)}
                                                                            />

                                                                            <BsPlusCircle className="invoice_plus_icon" onClick={handleAddClick} />
                                                                        </td>

                                                                    </tr>

                                                                </tbody>
                                                            </table>
                                                        )) : null}

                                                    </div> */}
                            </Form.Item>
                          ))
                          : null}

                        <Form.Item label="Subject">
                          <Input
                            name="subject"
                            placeholder="Subject"
                            className="invoice_width business_input"
                            value={sendInvoices.subject}
                            onChange={handleChangeInvoice}
                          />
                        </Form.Item>

                        <Form.Item label="Message">
                          <TextArea
                            name="message"
                            style={{ borderRadius: "4px" }}
                            className="invoice_width "
                            rows={4}
                            placeholder="Message"
                            maxLength={6}
                            value={sendInvoices.message}
                            onChange={handleChangeInvoice}
                          />
                        </Form.Item>
                        <Form.Item label=" ">
                          <div className="send_invoice_checkbox">
                            <div
                              className="invoice_check1"
                              style={{ marginBottom: 20 }}
                            >
                              <div className="invoice_check_col_1"></div>
                              <div className="invoice_check_col_2">
                                <input
                                  type="checkbox"
                                  name="message"
                                  ckecked={sendInvoices.checkbox_1}
                                  style={{ marginRight: 10 }}
                                  onChange={check_1Onchange}
                                />{" "}
                                <span style={{ marginTop: 5, float: "left" }}>
                                  {" "}
                                  Send a copy to myself at{" "}
                                  <span
                                    style={{ color: "black", fontWeight: 500 }}
                                  >
                                    {sendInvoices.from}
                                  </span>
                                </span>
                              </div>
                            </div>

                            <div className="invoice_check1">
                              <div className="invoice_check_col_1"></div>
                              <div className="invoice_check_col_2">
                                <input
                                  type="checkbox"
                                  name="message"
                                  ckecked={sendInvoices.checkbox_2}
                                  style={{ marginRight: 10 }}
                                  onChange={check_2Onchange}
                                />{" "}
                                <span style={{ marginTop: 5, float: "left" }}>
                                  {" "}
                                  Attach the invoice as a PDF
                                </span>
                              </div>
                            </div>
                          </div>
                        </Form.Item>
                      </Form>
                    </div>
                  </Modal>
                </div>
                
              </div>
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

export default Invoice;
