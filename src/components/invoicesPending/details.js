import React, { useState, useEffect } from 'react';
import moment from "moment";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { invoiceDetails, invoiceDowload, updateSendInvoice } from '../../store/actions/invoice';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Divider, Table, Input, Select, Spin, Modal, Form, DatePicker, Tooltip, Popover } from 'antd';
import ApiCall from "../../helpers/apicall";

import { LoadingOutlined, FormOutlined, MinusCircleOutlined, PlusCircleFilled, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { transactionList, createTransaction, transactionDetails, transactionPopUp } from '../../store/actions/transaction';
import { showError, Toaster, toastError, number, showDate, showDateTime, getDateFormat, toFixed, toastSuccess, getCookies, isInvalidEmail } from '../../helpers/Utils';
import { FacebookIcon, FacebookShareButton, WhatsappShareButton, WhatsappIcon, TelegramIcon, TwitterIcon, TwitterShareButton, TelegramShareButton } from 'react-share';
import {
    MdContentCopy
} from "react-icons/md";
import { BsQuestionCircle, BsPlusCircle, BsFillTrashFill } from 'react-icons/bs'
import { farmerList, farmerDetail, farmerActiveList } from "../../store/actions/farmerList";
import PaidImg from '../../images/paid-img.png';
import Shop from "../../images/Shop.png";
import { dashboardAccountBal } from "../../store/actions/dashboard";
import urlLink from "../../helpers/globalVariables";
import Spinner from "../ui/spinner";

const saveAs = require("file-saver");

const { Option } = Select;
const { TextArea } = Input;
function InvoicependingDetails(props) {
    const history = useHistory()
    const dispatch = useDispatch();
    const params = useParams();
    let profile = useSelector(state => state.myprofile.user)
    const errorMessage = "Please fill the To Email Address";
    const errorEmailMessage = "Please enter the valid To Email Address";

    const [state, setState] = useState({
        actual: "",
        discount: "",
        final: "",
        transaction_Amount: "",
        tax: [],
        invoiceNumber: "",
        invoiceType: "",
        isGst: "",
        item: "",
        Totaltax: "",
        heading: "",
        status: "",
        summary: "",
        customerId: "",
        currentPage: 1,
        rate: "",
        priceType: "",
        customerName: "",
        customerType: "",
        customer_email: "",
        customer_phone: "",
        invoiceno: "",
        paid: [{}],
        amountpaid: '',
        amountdue: "",
        date: moment(new Date),
        payMode: "",
        notes: "",
        amount: "",
        invoiceId: "",
        due: "",
        invoiceDate: "",
        paymentDate: "",
        merchant: "",
        customer: "",
        address_bill_1: "",
        address_bill_2: "",
        address_ship_1: "",
        address_ship_2: "",
        address_bill_zipcode: "",
        address_bill_state: "",
        address_bill_city: "",
        address_ship_zipcode: "",
        address_ship_state: "",
        address_ship_city: "",
        address: "",
        partial_payment: "",
        create_gst: "",
        merchant_bill_1: "",
        merchant_bill_2: "",
        merchant_ship_1: "",
        merchant_ship_2: "",
        merchant_bill_zipcode: "",
        merchant_bill_state: "",
        merchant_bill_city: "",
        merchant_ship_zipcode: "",
        merchant_ship_state: "",
        merchant_ship_city: "",
        merchant_name: "",
        link_value: window.location.protocol + "//" + window.location.hostname + "/invoices/" + params.id,
        partialPayment_status: "",
        pay_amount: "",
        contact_id: '',
        beneficiaryList: [],
        account_type: "",
        banck_account: "bank_account",
        upi_account: "",
        // partial_payment: "",
        // link_value: window.location.href,
        terms: ""
    })

    const [sendInvoices, setSendInvoices] = useState({
        from: "",
        to: "",
        message: "",
        subject: "",
        checkbox_1: false,
        checkbox_2: false,


    })
    const [loading, setLoading] = useState(false);
    const [transaction, setTransaction] = useState();
    const [modal2Visible, setModal2Visible] = useState(false);
    const [modalPayment, setModalPayment] = useState(false);
    const [shareLink, setShareLink] = useState(false);
    const [linkValue, setLinkValue] = useState();
    const [invoiceModal, setInvoiceModal] = useState(false);
    const [toInvoice, setToInvoice] = useState([{ to: "" }]);
    const [neftCheck, setNeftCheck] = useState(false);
    const [impsCheck, setImpsCheck] = useState(false);
    const [rtgsCheck, setRtgsCheck] = useState(false);
    const [vpa, setVpa] = useState("");
    const [vpaName, setVpaName] = useState("");
    const [paynow, setPaynow] = useState(false);
    const [contactId, setContactId] = useState("")
    const [id, setId] = useState("")
    const [checkBneficiary, setCheckBneficiary] = useState("")
    const [vap, setVap] = useState("");
    const [imageLoaded, setImageLoaded] = useState(false);
    const [bankAccountCheck, setBankAccountCheck] = useState(true);
    const [bankAccount, setBankAccount] = useState("bank_account");
    const [upiAccount, setUpiAccount] = useState("");
    const [upiBeneficiaryList, setUpiBeneficiaryList] = useState("")
    const [bankBeneficiaryList, setBankBeneficiaryList] = useState("")
    const [accountType, setAccountType] = useState("")
    const [merchantImage, setMerchantImage] = useState("")
    const [upiCheck, setUpiCheck] = useState(false);
    const [merchantAccountBal, setmerchantAccountBal] = useState("")

    const [transPop, setTransPop] = useState({
        name: "",
        email: "",
        phone: "",
        paid: "",
        transDate: "",
        partial_payment: "",
        invoices: "",
        notes: "",
        transId: "",
        transpayMode: ""
    })

    useEffect(() => {


        if (id !== "") {
            farmerProfile();

        }

    }, [contactId, id]);

    useEffect(() => {
        if (params.id !== "") {
            handleTable();
            TransactionDetails();
        }

    }, [merchantImage])


    console.log(merchantImage)
    useEffect(() => {
        handleAccountBal()
    }, [merchantAccountBal])

    const handleTable = () => {
        // setTimeout(() => {
        //     setLoading(true);
        // }, 1000)

        dispatch(invoiceDetails(params.id, (result) => {

            if (result) {
                let data = result?.invoice;
                let address = data?.customer?.address;
                let merchant = data?.merchant?.address;
                setLoading(true);

                setMerchantImage(data?.image ?? "")
                setState({
                    ...state,
                    actual: data.cost.actual,
                    adjustment: data.cost.adjustment,
                    discount: data.cost.discount,
                    final: data.cost.final,
                    transaction_Amount: Number(data?.cost?.final),
                    Totaltax: data.cost.tax,
                    // invoiceNumber: data.invoice_no,
                    invoiceType: data?.invoice_type === "m2b" ? "Business" : "Farmer",
                    // invoiceType: data.invoice_type,

                    isGst: data?.is_gst ?? false,
                    item: data.items,
                    tax: data.tax,
                    heading: data.heading,
                    status: data.status,
                    summary: data.summary,
                    invoiceno: data.invoice_no,
                    customerId: data?.customer?.id ?? "",
                    customerName: data.customer.name,
                    customer_phone: data?.customer?.phone?.national_number ?? "",
                    customer_email: data?.customer?.email ?? "",
                    rate: data.discount.value,
                    priceType: data.discount.calculation === "rs" ? "rs" : "%",
                    customerType: data.customer.customer_type && data.customer.customer_type,
                    amountpaid: data.partial_payment.paid && data.partial_payment.paid,
                    invoiceId: data.invoice_id,
                    amount: ((data.cost.final && data.cost.final) - (data.partial_payment.paid && data.partial_payment.paid)),
                    due: ((data.cost.final && data.cost.final) - (data.partial_payment.paid && data.partial_payment.paid)),
                    invoiceDate: data.date ? data.date.issue : "N/A",
                    paymentDate: data.date ? data.date.due : "N/A",
                    merchant: data.merchant,
                    customer: data.customer,
                    address_bill_1: address?.billing?.line_1,
                    address_bill_2: address?.billing?.line_2,
                    address_ship_1: address?.shipping?.line_1,
                    address_ship_2: address?.shipping?.line_2,
                    address_bill_zipcode: address?.billing?.zipcode,
                    address_bill_state: address?.billing?.state?.name,
                    address_bill_city: address?.billing?.city?.name,
                    address_ship_zipcode: address?.shipping?.zipcode,
                    address_ship_state: address?.shipping?.state?.name,
                    address_ship_city: address?.shipping?.city?.name,
                    merchant_bill_1: merchant?.billing?.line_1,
                    merchant_bill_2: merchant?.billing?.line_2,
                    merchant_ship_1: merchant?.shipping?.line_1,
                    merchant_ship_2: merchant?.shipping?.line_2,
                    merchant_bill_zipcode: merchant?.billing?.zipcode,
                    merchant_bill_state: merchant?.billing?.state?.name,
                    merchant_bill_city: merchant?.billing?.city?.name,
                    merchant_ship_zipcode: merchant?.shipping?.zipcode,
                    merchant_ship_state: merchant?.shipping?.state?.name,
                    merchant_ship_city: merchant?.shipping?.city?.name,
                    merchant_name: data?.merchant?.name,
                    // merchant_gst:,
                    address: address,
                    partial_payment: data?.partial_payment?.is_allowed,
                    create_gst: data.is_gst,
                    partialPayment_status: data?.partial_payment || "",
                    terms: data?.terms ?? "-",
                });
                setSendInvoices({
                    ...sendInvoices,
                    from: data?.merchant?.email,
                    subject: "Invoice " + "#" + data.invoice_no + " from " + data?.merchant?.name,
                    message: `Dear ${data?.customer?.name},\nThank you for your business.Your invoice can be viewed,printed and downloaded as PDF from the link below.You can also choose to pay it online\n\n${window.location.protocol}//pay.ippopay.com/${data.link_url}`,
                    checkbox_1: false,
                    checkbox_2: false,
                })

                setLinkValue(window.location.protocol + "//pay.ippopay.com" + data.link_url)
                setId(data?.customer?.id ?? "")

            } else {
                setLoading(false)
            }
        }))
    }

    const handleAddClick = () => {
        const notEmpty = checkEmptyProduct();

        if (!notEmpty) {
            setToInvoice([...toInvoice, { to: "" }]);
        } else {
            toastError(errorMessage);
        }
    };

    const handleChangePaymentInvoice = (e) => {

        let re = /^([0-9.])+$/;
        // let guidRegex = /^([0-9.])+$/          
        if (e.target.value === "" || re.test(e.target.value)) {
            setState((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }));
        }

    }
    const farmerProfile = () => {


        dispatch(farmerDetail(id, (result) => {

            if (result) {

                let data = result?.farmer;
                setContactId(data?.contact_id ?? "")
            }
        }))
    }

    const beneficiaryOnchange = (item) => {

        setCheckBneficiary(item?.beneficiary_id ?? "")
        setVpa(item?.vpa?.upi ?? "")
        setVpaName(item?.vpa?.name ?? "")

    }

    const contactDetails = () => {
        const { contact_id } = state;

        let query = "?contact_id=" + contactId;

        ApiCall.get('merchant/list-beneficiary/' + query, (response) => {
            if (response.success) {

                let beneficiaryData = response?.data?.beneficiary ?? "";
                setUpiBeneficiaryList(beneficiaryData?.upi_beneficiaries ?? "")
                setBankBeneficiaryList(beneficiaryData?.bank_account_beneficiaries ?? "")
            }
        })
    }

    const handleOimpsRadioChange = (event) => {
        setState({ ...state, account_type: event })
        setAccountType(event)
        setNeftCheck(false);
        setImpsCheck(true)
        setRtgsCheck(false)

    }

    const handlebankAccountRadioChange = (event) => {

        setCheckBneficiary("")
        setBankAccount(event)
        setBankAccountCheck(true)
        setUpiCheck(false)
        setUpiAccount("")
        setAccountType("")
    }

    const handleUpiRadioChange = (event) => {
        setNeftCheck(false);
        setImpsCheck(false);
        setRtgsCheck(false);
        setUpiAccount(event)
        setAccountType("")
        setBankAccountCheck(false)
        setUpiCheck(true)
        setBankAccount("")
        setCheckBneficiary("")

    }

    const handleOrtgsRadioChange = (event) => {
        setState({ ...state, account_type: event })
        setAccountType(event)
        setNeftCheck(false);
        setImpsCheck(false)
        setRtgsCheck(true)

    }

    const handleNeftRadioChange = (event) => {

        setState({ ...state, account_type: event })
        setAccountType(event)
        setNeftCheck(true);
        setImpsCheck(false)
        setRtgsCheck(false)

    }

    const cancelPaynow = () => {
        setPaynow(false)
        setUpiAccount("")
        setCheckBneficiary("")
        setUpiCheck(false)
        setAccountType()
        setBankAccount("bank_account")
    }
    const createpayNow = () => {
        // document.body.style.backgroundColor = "red";
        // document.body.style.width = "100%";
        // document.body.style.height = "100vh";
        // document.body.style.zIndex = 1000

        setUpiCheck(false)
        setBankAccountCheck(true)
        setAccountType("")
        setPaynow(true)
        contactDetails();

    }

    const handleAccountBal = () => {
        dispatch(dashboardAccountBal((result) => {
            if (result) {
                let data = result?.account?.available_balance ?? "-";
                setmerchantAccountBal(data)
            }
        }));
    }

    const submitPayment = (item) => {
        const { transaction_Amount } = state;
        if (checkBneficiary === "" || checkBneficiary === null || checkBneficiary === undefined) {
            toastError("Please select the account")
        } else if (transaction_Amount === "" || transaction_Amount === undefined || transaction_Amount === null) {
            toastError("Please enter the amount")
        } else if (item !== "upi" && (accountType === "" || accountType === null || accountType === undefined)) {
            toastError("Please select the payment mode")
        }
        else if (transaction_Amount < 1) {
            toastError("Transaction amount should be greater than 1 rupees")
        } else if (transaction_Amount > merchantAccountBal) {
            toastError("Insufficient fund")
        }

        else {

            let data;

            if (item === "bank") {
                data = {
                    amount: transaction_Amount,
                    pay_mode: accountType,
                    beneficiary_id: checkBneficiary,
                    invoice_id: params.id,
                }
            } else if (item === "upi") {
                data = {
                    amount: transaction_Amount,
                    pay_mode: upiAccount,
                    vpa: vpa,
                    name: {
                        full: vpaName,
                    },
                }
            }

            setImageLoaded(true)
            ApiCall.post('merchant/transfer', data, (response) => {
                if (response.success) {
                    setTimeout(() => {
                        setImageLoaded(false)
                        setPaynow(false)
                        setUpiAccount("")
                        setCheckBneficiary("")
                        setAccountType("")
                        setUpiCheck(false)
                        handleTable();
                        setBankAccountCheck(true)
                        setBankAccount("bank_account")
                        toastSuccess(response.message)
                    }, 1500)

                }
                else {
                    setTimeout(() => {
                        setImageLoaded(false)
                        setPaynow(true)
                        toastError(response.message)
                    }, 400)
                }
            })
        }
    }

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
    const handleTrans = (id) => {
        setModal2Visible(true)

        dispatch(transactionPopUp(id, (result) => {
            if (result) {

                let data = result.transaction;
                setTransPop({
                    ...transPop,
                    name: data?.customer?.name ?? "",
                    email: data?.customer?.email ?? "",
                    phone: data.customer && data.customer.phone && data.customer.phone.national_number && data.customer.phone.national_number,
                    paid: data.cost && data.cost.paid && data.cost.paid,
                    transDate: data.createdAt,
                    partial_payment: data.partial_payment,
                    invoices: data.invoice && data.invoice,
                    notes: data?.notes ?? "-",
                    transId: data?.trans_id ?? "-",
                    transpayMode: data?.manual_payment_mode ?? "-",

                })
            }
        }))
    }

    const TransactionDetails = () => {
        let id = params.id;
        dispatch(transactionDetails(id, (result) => {
            if (result) {

                let data = result.transaction;
                setTransaction(data)
            }
        }))
    }
    const cancelTransaction = () => {
        setModal2Visible(false)
        setState({
            ...state,
            date: moment(new Date),
            notes: "",
        })

    }

    const sendInvoice = () => {
        setInvoiceModal(true)
    }

    const cancelInvoiceModal = () => {
        setInvoiceModal(false)
        // setToInvoice({ ...toInvoice, to: "" })


    }
    const handlePayment = () => {
        setModalPayment(true)

    }
    const cancelPayment = () => {

        setState({
            ...state,
            date: moment(new Date),
            notes: "", invoiceId: "", amount: (state.final - state.amountpaid), due: (state.final - state.amountpaid)
        })

        setModalPayment(false)
    }
    const handleOnPaydateChange = (date, dateString) => {
        setState({ ...state, date: date })
    }
    const handleChangeNumbers = (e) => {

        let guidRegex = /^([0-9.])+$/


        if (e.target.value === "" || guidRegex.test(e.target.value)) {
            setState(prevState => ({
                ...prevState,
                [e.target.name]: e.target.value
            }))
        }
    }

    const handleChangePayment = (e) => {
        setState({ ...state, payMode: e })
    }

    const notesOnchange = (e) => {
        setState(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const handleChangeInvoice = (e) => {
        setSendInvoices(prevSendInvoices => ({
            ...prevSendInvoices,
            [e.target.name]: e.target.value
        }))
    }
    const createTransactions = () => {
        const { date, amount, payMode, notes, due } = state;
        if (date === "" || date === null) {
            toastError("Please select the date")
        } else if (amount === "" || amount === null) {
            toastError("Please enter the amount")
        } else if (amount > due || amount <= 0) {
            toastError("Please enter valuable amount")
        } else if (payMode === "" || payMode === null) {
            toastError("Please select the paymode")
        } else {
            let data = {
                cost: amount,
                recorded_date: date,
                is_manual_record: true,
                manual_payment_mode: payMode,
                notes: notes,
            }

            dispatch(createTransaction(data, state.invoiceId, (result) => {
                if (result) {
                    setModalPayment(false)
                    setState({ ...state, notes: "", date: moment(new Date) })
                    handleTable();
                    TransactionDetails();

                }
            }))
        }
    }


    const createInvoiceModal = () => {

        const notEmpty = checkEmptyProduct();

        const { from, to, message, subject, checkbox_1, checkbox_2 } = sendInvoices;

        var toEmailIds = toInvoice.map(function (obj) {
            return obj.to;
        });

        if (from === "" || from === null || from === undefined) {
            toastError("Please enter the From Email Address")
        } else if (notEmpty) {
            toastError("Please enter the valid To Email Address")
        } else if (subject === "" || subject === null || subject === undefined) {
            toastError("Please enter the subject")
        } else if (message === "" || message === null || message === undefined) {
            toastError("Please enter the message")
        } else {

            let data = {
                "from": from,
                "to":
                    toEmailIds
                ,
                "subject": subject,
                "message": message,
                "send_copy": checkbox_1,
                "attach_pdf": checkbox_2
            }

            if (!notEmpty) {

                dispatch(updateSendInvoice(params.id, data, (result) => {
                    if (result) {
                        setInvoiceModal(false)
                        handleTable()
                        setToInvoice({ ...toInvoice, to: "" })
                    }
                }))
            }
        }

    }



    const back = () => {
        history.push('/invoices-pending')
    }

    const Linkshare = () => {
        setShareLink(true)
    }

    const downloadPdf = () => {

        fetch(urlLink.BASE_URL + 'invoice/open/view/pdf/' + params.id, {
            method: 'GET',
            headers: {

                'Content-Type': 'application/json',
            },

        })
            .then(response => {
                response.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = `Invoice_${params.id}_${showDate(new Date())} - Invoice.pdf`;
                    a.click();
                })
            });


    }

    const cancelShareLink = () => {
        setShareLink(false)

    }
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...toInvoice];
        list[index][name] = value;
        setToInvoice(list);
    };

    const handleRemoveClick = (index) => {

        let input = toInvoice;
        input.splice(index, 1);
        setToInvoice([...input])

    };


    const { item, tax, actual, rate, discount } = state
    const antIcon = (
        <LoadingOutlined
            style={{
                fontSize: 24,
            }}
            spin
        />
    );

    const check_1Onchange = (event) => {
        setSendInvoices({ ...sendInvoices, checkbox_1: event.target.checked })
    }

    const check_2Onchange = (event) => {
        setSendInvoices({ ...sendInvoices, checkbox_2: event.target.checked })
    }

    function handleChange(i, event) {
        const values = [...toInvoice];
        values[i].to = event.target.value;
        setToInvoice(values);
    }

    function handleAdd() {
        const values = [...toInvoice];
        values.push({ to: null });
        setToInvoice(values);
    }

    function handleRemove(i) {
        const values = [...toInvoice];
        values.splice(i, 1);
        setToInvoice(values);
    }

    const { merchant_bill_zipcode, merchant_bill_city, address_bill_city, address_bill_zipcode, address_ship_zipcode, address_ship_city, merchant_ship_zipcode, merchant_ship_city } = state
    const merchantBillingAddress = (
        <span className="bill_add_deatils">
            {merchant_bill_city !== "" && merchant_bill_zipcode !== ""
                ? merchant_bill_city + " - " + merchant_bill_zipcode
                : merchant_bill_city !== ""
                    ? merchant_bill_city
                    : merchant_bill_zipcode}
        </span>
    );

    const merchantShippingAddress = (
        <span className="bill_add_deatils">
            {merchant_ship_city !== "" && merchant_ship_zipcode !== ""
                ? merchant_ship_city + " - " + merchant_ship_zipcode
                : merchant_ship_city !== ""
                    ? merchant_ship_city
                    : merchant_ship_zipcode}
        </span>
    );

    const customerShippingAddress = (
        <span className="bill_add_deatils">
            {address_ship_city !== "" && address_ship_zipcode !== ""
                ? address_ship_city + " - " + address_ship_zipcode
                : address_ship_city !== ""
                    ? address_ship_city
                    : address_ship_zipcode}
        </span>
    )

    const customerBillingAddress = (
        <span className="bill_add_deatils">
            {address_bill_city !== "" && address_bill_zipcode !== ""
                ? address_bill_city + " - " + address_bill_zipcode
                : address_bill_city !== ""
                    ? address_bill_city
                    : address_bill_zipcode}
        </span>
    )
    const editPage = () => {
        history.push("/invoices-pending/edit/" + params.id);
    }

    const symbol = (i) => (
        <>
            <span>{items.length !== 1 ? (<p style={{ margin: 0 }} onClick={() => handleRemoveClick(i)}><MinusCircleOutlined style={{ marginTop: "5px", fontSize: "17px", color: "#808080" }} className="remove_input_btn" /></p>) : (<p style={{ margin: 0 }} ><MinusCircleOutlined style={{ marginTop: "5px", fontSize: "17px", color: "#808080" }} className="remove_input_btns" /></p>)} </span>
            <span>To</span>
        </>
    )

    const address = (
        <>

            <div className="bill_left">

                <span className="bill_add_deatils address">
                    {/* {state.merchant?.address?.is_same_billing ? ("Address") : ("Bill to")} */}
                    {state.customerType === "farmer" ? "Bill to" : "Address"}
                </span>

                <span className="companydetail_name">
                    {state.merchant_name}
                </span>
                {state.merchant?.address?.billing && (
                    <>
                        <span className="bill_add_deatils">
                            {state.merchant_bill_1}
                        </span>

                        <span className="bill_add_deatils">

                            {merchantBillingAddress}
                        </span>
                        <span className="bill_add_deatils">
                            {state.merchant_bill_state}
                        </span>
                    </>
                )}
                {!state.merchant?.address?.is_same_billing && (
                    <>
                        <span className="bill_add_deatils address" style={{ marginTop: 15 }}>
                            Ship to
                        </span>

                        <span className="bill_add_deatils">
                            {state.merchant_ship_1}
                        </span>

                        <span className="bill_add_deatils">

                            {merchantShippingAddress}
                        </span>
                        <span className="bill_add_deatils">
                            {state.merchant_ship_state}
                        </span>
                    </>
                )}
                {state.isGst && (
                    <span>{profile?.merchant?.business?.gst !== "" && "GST - "} {profile?.merchant?.business?.gst ?? ""}</span>

                )}
            </div>
        </>
    )

    const addressCustomer = (
        <>
            <div className="bill_left">
                {state.customerName && (<>
                    <span className="bill_add_deatils address">
                        {state.customerType === "farmer" ? "Address" : "Bill to"}
                    </span>
                </>)}

                <span className="companydetail_name">
                    {state.customerName}
                </span>
                {state.address?.billing && (
                    <>
                        <div className="bill_left">

                            <span className="bill_add_deatils">
                                {state.address_bill_1}
                            </span>

                            <span className="bill_add_deatils">

                                {customerBillingAddress}
                            </span>
                            <span className="bill_add_deatils">
                                {state.address_bill_state}
                            </span>
                        </div>
                    </>
                )}
                {state.address?.is_same_billing ? ("") : (
                    <>
                        <div className='col-xs-12 p-0'>
                            <div className="bill_left" style={{ marginTop: 15 }}>
                                {state.customerName && (
                                    <>
                                        <span className="bill_add_deatils address">
                                            Ship to
                                        </span>
                                    </>
                                )}
                                <span className="bill_add_name">
                                    {state.customerName}
                                </span>
                                <span className="bill_add_deatils">
                                    {state.customer_phone}
                                </span>
                                <span className="bill_add_deatils">
                                    {state.customer_email}
                                </span>
                                {state.address?.shipping && (
                                    <>
                                        <span className="bill_add_deatils">
                                            {state.address_ship_1}
                                        </span>

                                        <span className="bill_add_deatils">

                                            {customerShippingAddress}
                                        </span>
                                        <span className="bill_add_deatils">
                                            {state.address_ship_state}
                                        </span>
                                    </>
                                )}

                            </div>
                        </div>

                    </>
                )}


            </div>
        </>
    )
    return (

        <div>
            <Toaster />

            <div className="main-content app-content mt-0" style={{ position: "relative" }}>
                <div className="side-app">
                    <div className="container-fluid main-container p-0 ">
                        {imageLoaded && (<>
                            <div className="paynow-loaders-head">
                                <div className="paynow-loader">

                                </div>
                            </div>
                        </>)}

                        {loading ? (
                            <div>
                                <div className="business_top">
                                    <div className="business_header">
                                        <h4 className="business_head"></h4>
                                        <div>
                                            {state.status === "draft" && (
                                                <button className="create_btn" style={{ marginRight: "15px" }} onClick={() => editPage()}>Edit</button>
                                            )}
                                            <button className="create_btn" onClick={() => back()}>Back</button>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ width: '100%', display: 'flex', marginBottom: "30px" }}>

                                    <div className="container_top " style={{ width: "66%" }}>
                                        <div className="card invoice_card" style={{ marginTop: '0px', padding: "20px 0 30px 0" }}>
                                            <>

                                                <div style={{ width: "100%", padding: "0px 15px 10px 15px", display: "flex" }}>
                                                    <div style={{ width: '70%' }}>
                                                        <div className=" add_input">
                                                            <p className="invoice_heading">{state.heading}</p>

                                                        </div>

                                                        <div className="add_input">
                                                            <p className="invoice_summary">{state.summary}</p>
                                                        </div>


                                                        <>
                                                            {state.customerType === "farmer" ? (<div className='col-xs-7 p-0'>{addressCustomer}</div>) : (<div className='col-xs-7 p-0'>{address}</div>)}

                                                        </>
                                                    </div>
                                                    {/* <div className="col-xs-5" >

                                                        {merchantImage === "" || merchantImage === undefined || merchantImage === null ? (
                                                            <div style={{ cursor: "none" }} className="logo_upload">
                                                                <img src={Shop}
                                                                    className="pop-body-vi" />
                                                            </div>
                                                        ) : <div className="logo_upload">
                                                            <img src={merchantImage}
                                                                className="pop-body-vi" />
                                                        </div>}


                                                    </div> */}

                                                    {(merchantImage !== "" || merchantImage !== undefined || merchantImage !== null) ? (
                                                        <div className="col-xs-5" >

                                                            <div className={merchantImage === "" ? "" : "logo_upload"}>
                                                                <img src={merchantImage}
                                                                    className={merchantImage === "" ? "" : "pop-body-vi"} />
                                                            </div>
                                                        </div>
                                                    ) : null}

                                                </div>
                                                <hr />
                                                <div style={{ marginTop: -15 }}>
                                                    {state.status === "partially_paid" &&
                                                        state.partialPayment_status.paid !== 0 &&
                                                        state.partialPayment_status.is_allowed
                                                        ?
                                                        (
                                                            <div className="col-jr-12 p-0">
                                                                <div className="brd_top" />
                                                                <div className="due_tab">You have made a partial payment of &#x20B9;{toFixed(state.partialPayment_status.paid)} on this invoice.
                                                                    <span className="amt_blanc">Your amount due is <span>&#x20B9; {toFixed((state.final) - state.partialPayment_status.paid)}</span></span>
                                                                </div>
                                                            </div>
                                                        )
                                                        :
                                                        ("")
                                                    }
                                                </div>
                                                <div className="bill" style={{ width: "100%", padding: "0px 15px 10px 15px", position: "relative" }}>

                                                    {state.customerType === "farmer" ? (<div className='col-xs-6 p-0'>{address}</div>) : (<div className='col-xs-6 p-0'> {addressCustomer}</div>)}

                                                    <div className='col-xs-6 p-0'>
                                                        <div className="bill_right">


                                                            <table className="bill-table invoice_info_table">
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="table-align">Invoice Number</td>
                                                                        <td>:</td>
                                                                        <td>{state.invoiceno}</td>

                                                                    </tr>
                                                                    <tr>
                                                                        <td className="table-align">Invoice Date</td>
                                                                        <td>:</td>
                                                                        <td>{showDate(state.invoiceDate)}</td>

                                                                    </tr>
                                                                    <tr>
                                                                        <td className="table-align">Payment Due</td>
                                                                        <td>:</td>
                                                                        <td>{showDate(state.paymentDate)}</td>

                                                                    </tr>
                                                                    <tr>
                                                                        <td className="table-align">Amount Due (INR)</td>
                                                                        <td>:</td>
                                                                        <td>&#x20B9; {toFixed((state.final) - state.amountpaid)}</td>

                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            {state.status === "paid" && (
                                                                <div className="paid-image">
                                                                    <img src={PaidImg} />
                                                                </div>
                                                            )}

                                                        </div>

                                                    </div>

                                                </div>

                                                <div className="col-jr-12 p-0 table_m_view">
                                                    <table className="ref_table invoice_item_table">
                                                        <thead>
                                                            <tr className="table_head_blk detail_ivc">
                                                                <th>
                                                                    <p className="just_lft">Item Name</p>
                                                                </th>
                                                                <th>
                                                                    <p>Rate/item</p>
                                                                </th>
                                                                <th>
                                                                    <p>Quantity</p>
                                                                </th>
                                                                <th>
                                                                    <p>Gst</p>
                                                                </th>
                                                                <th>
                                                                    <p>Amount</p>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {state.item.length > 0 ? (
                                                                state.item.map((item, ind) =>
                                                                (
                                                                    <>
                                                                        <tr key={ind} className="child_align">
                                                                            <td>
                                                                                <p className="tab_bld" style={{ textTransform: "capitalize" }}>{item.name}</p>
                                                                                <p className="tab_lig" />
                                                                            </td>
                                                                            <td>
                                                                                <p className="table_value u-right-align">&#x20B9;{item.cost} </p>
                                                                            </td>
                                                                            <td>
                                                                                <p className="table_value">{item.qty}</p>
                                                                            </td>
                                                                            <td>{item.gst !== 0 ?
                                                                                (<p className="table_value">
                                                                                    {item.gst}%
                                                                                </p>)
                                                                                :
                                                                                <p className="table_value">-</p>
                                                                            }
                                                                            </td>
                                                                            <td>
                                                                                <p className="table_value ">&#x20B9;{toFixed(state.actual)}</p>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td colSpan={5}>
                                                                                <p className="table_brd" />
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                )
                                                                )
                                                            )
                                                                :
                                                                (
                                                                    <>
                                                                        <tr>
                                                                            <td colSpan={6} className="table_value text-center">No Data Found</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td colSpan={5}>
                                                                                <p className="table_brd" />
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                )}


                                                            <tr>
                                                                <td colSpan={4} className="txt-rig">
                                                                    <p className="table_value">Subtotal</p>
                                                                </td>
                                                                <td>
                                                                    <p className="table_value u-right-align">&#x20B9; {toFixed(state.actual)}</p>
                                                                </td>
                                                            </tr>
                                                            {state.discount !== 0 ? (

                                                                <tr>
                                                                    <td colSpan={4} className="txt-rig">
                                                                        <p className="table_value">Discount ({state.rate} {state.priceType})</p>
                                                                    </td>
                                                                    <td>
                                                                        <p className="table_value u-right-align">&#x20B9; {toFixed(state.discount)}</p>
                                                                    </td>
                                                                </tr>
                                                            )
                                                                :
                                                                ("")
                                                            }

                                                            {state.tax && state.tax.length > 0 && state.tax.map((item, m) => (

                                                                <tr key={m}>
                                                                    {item.is_checked && (<td colSpan={4} className="txt-rig">
                                                                        <p className="table_value">{item.name} {"(" + item.percentage + "%)"}</p>
                                                                    </td>)}
                                                                    {item.is_checked && (
                                                                        <td>
                                                                            <p className="table_value u-right-align">&#x20B9; {toFixed(item.value)}</p>
                                                                        </td>
                                                                    )}
                                                                </tr>
                                                            ))}
                                                            {state.adjustment !== 0 ? (

                                                                <tr>
                                                                    <td colSpan={4} className="txt-rig">
                                                                        <p className="table_value">Adjustment</p>
                                                                    </td>
                                                                    <td>
                                                                        <p className="table_value u-right-align">&#x20B9; {toFixed(state.adjustment)}</p>
                                                                    </td>
                                                                </tr>
                                                            )
                                                                :
                                                                ("")
                                                            }
                                                            {state.partialPayment_status.is_allowed
                                                                ?
                                                                (
                                                                    <>
                                                                        <tr>
                                                                            <td colSpan={5}>
                                                                                <p className="table_brd" />
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td colSpan={4} className="txt-rig">
                                                                                <p className="table_value fnt_align">Total (INR) </p>
                                                                            </td>
                                                                            <td>
                                                                                <p className="table_value fnt_align u-right-align">&#x20B9; {toFixed(state.final)}</p>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td colSpan={5} />
                                                                        </tr>
                                                                        <tr >
                                                                            <td colSpan={4} className="txt-rig ">
                                                                                <p className="table_value fnt_align text-success" style={{ color: 'rgb(39, 194, 76)' }}>Amount Paid (INR) </p>
                                                                            </td>
                                                                            <td>
                                                                                <p className="table_value fnt_align u-right-align text-success" style={{ color: 'rgb(39, 194, 76)' }}>&#x20B9; {toFixed(state.amountpaid)}</p>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td colSpan={5} />
                                                                        </tr>
                                                                        <tr>
                                                                            <td colSpan={4} className="txt-rig">
                                                                                <p className="table_value fnt_align text-danger">Amount Due (INR) </p>
                                                                            </td>
                                                                            <td>
                                                                                <p className="table_value fnt_align text-danger  u-right-align">&#x20B9; {toFixed((state.final) - state.amountpaid)}</p>
                                                                            </td>
                                                                        </tr>


                                                                    </>

                                                                )
                                                                :
                                                                (
                                                                    <>
                                                                        <tr>
                                                                            <td colSpan={5}>
                                                                                <p className="table_brd" />
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td colSpan={4} className="txt-rig">
                                                                                <p className="table_value fnt_align">Total (INR) </p>
                                                                            </td>
                                                                            <td>
                                                                                <p className="table_value fnt_align u-right-align">&#x20B9; {toFixed(state.final)}</p>
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                )}
                                                        </tbody>
                                                    </table>
                                                    <hr />
                                                    <div className="notes_condition">
                                                        <div>
                                                            <span className="bill_add_deatils address">Terms & Conditions</span>
                                                            <p style={{ margin: 0 }}>{state.terms !== "" ? state.terms : "-"}</p>
                                                        </div>
                                                        <div>

                                                        </div>

                                                    </div>

                                                </div>

                                                <div>

                                                </div>
                                            </>
                                        </div>
                                    </div>

                                    <div className="invoice_right " style={{ width: "34%", margin: "0px 0 0 20px" }}>
                                        {state.invoiceType === "Farmer" ? ("") : (
                                            <div>
                                                {state.create_gst === true && (
                                                    <Card className="invoice_card agro_card" style={{ margin: "15px 0 0 0px" }}>
                                                        <div className="invoice_card_1">
                                                            <div>
                                                                <h4 className="tab_head" style={{ margin: 0 }}>Create GST Enabled Invoices</h4>

                                                            </div>
                                                            <div>
                                                                <input
                                                                    type="checkbox"
                                                                    name="rememberCheckbox"
                                                                    checked={state.create_gst}

                                                                    style={{ marginLeft: 5 }}
                                                                    readOnly
                                                                    disabled
                                                                />
                                                            </div>
                                                        </div>
                                                    </Card>
                                                )}

                                                {state.partial_payment === true && (
                                                    <Card className="invoice_card" style={{ marginTop: (state.create_gst === true ? "3px" : "16px") }}>
                                                        <div className="invoice_card_1">
                                                            <div>
                                                                <h4 className="tab_head" style={{ marginBottom: '15px', marginTop: "5px" }}>Enable Partial Payments</h4>
                                                                <h5 className="tab_des">Allow accepting multiple payments</h5>
                                                            </div>
                                                            <div>
                                                                <input
                                                                    type="checkbox"
                                                                    name="rememberCheckbox"
                                                                    checked={state.partial_payment}

                                                                    style={{ marginLeft: 5 }}
                                                                    readOnly
                                                                    disabled
                                                                />
                                                            </div>
                                                        </div>
                                                    </Card>
                                                )}


                                            </div>
                                        )}

                                        <Card className={state.invoiceType === "Farmer" ? "invoice_card_far" : "invoice_card"} style={{ marginTop: (state.create_gst === false && state.partial_payment === false ? "16px" : "20px") }}>
                                            <div className="invoice_card_3">

                                                <h4> <i className="fa fa-send" style={{ fontSize: "20px", marginRight: "15px" }}></i> Send Invoice</h4>
                                            </div>
                                            <div className="send-invoice">
                                                {/* <h5>Last Sent:Never-</h5>
                                                <h5 style={{ marginBottom: '15px' }}><span style={{ color: "#2e72b9" }}>Mark as sent </span>to set up reminder</h5> */}
                                                <div className="invoice_card_3">
                                                    {(state.invoiceType === "Farmer" && state.status === "paid") || state.status === "sent" ? "" : (
                                                        <button className="creates_btn" onClick={state.invoiceType === "Farmer" && state.status !== "paid" ? createpayNow : sendInvoice}>{state.invoiceType === "Farmer" && state.status !== "paid" ? "Pay Now" : "Send"}</button>
                                                    )}
                                                    <button className="create_share" onClick={Linkshare}>Get Share Link</button>
                                                    <button className="creates_btn" onClick={downloadPdf}>Download</button>

                                                </div>
                                            </div>
                                        </Card>

                                        {state.status !== "paid" && state.invoiceType?.toString().toLowerCase() === "business" ? (
                                            <Card className="invoice_card">
                                                <div className="invoice_card_3">

                                                    <h4> <i className="fa fa-inbox" style={{ fontSize: "20px", marginRight: "15px" }}></i>Get Paid</h4>
                                                </div>
                                                <h5 style={{ marginTop: "10px" }}>Amount Due &#x20B9; {toFixed((state.final) - state.amountpaid)}</h5>
                                                <button className="create_record" onClick={handlePayment}>Record Payment</button>

                                            </Card>
                                        )
                                            :
                                            ("")
                                        }
                                        {transaction && transaction.length > 0 && (


                                            <Card className="invoice_card" style={{
                                                width: '100%',
                                                overflowY: "auto"
                                            }}>


                                                <div style={{
                                                    width: '100%'
                                                }}>
                                                    <div>
                                                        {state.partialPayment_status.is_allowed &&
                                                            <h4 style={{ marginBottom: '15px' }}>Invoice Partially Paid</h4>
                                                        }
                                                        <h5>Payments</h5>
                                                    </div>

                                                    <div style={{ width: '100%' }}>
                                                        {transaction && transaction.length > 0 && transaction.map((item, j) => (
                                                            <div key={j} onClick={() => handleTrans(item.trans_id)} style={{ cursor: "pointer" }}>
                                                                <div className="invoice_payment">
                                                                    <div>
                                                                        <p className="invoice_id">{item.trans_id}</p>
                                                                        <p className="invoice_date">{showDateTime(item.createdAt)}</p>

                                                                        {item.status === "success" && <div className="badge bg-success-transparent text-success rounded-pill  p-2 px-3">{item.status}</div>}
                                                                        {/* {(item.status === "success" && item?.invoice?.invoice_type === "f2m") && <div className="badge bg-success-transparent text-success rounded-pill  p-2 px-3">Paid</div>} */}
                                                                        {item.status === "initiated" && <div className="badge bg-primary-transparent text-primary rounded-pill  p-2 px-3">{item.status}</div>}
                                                                        {item.status === "failed" && <div className="badge bg-danger-transparent text-danger rounded-pill  p-2 px-3">{item.status}</div>}

                                                                    </div>
                                                                    <div>
                                                                        <p className="invoice_amount">&#x20B9; {item.cost.paid}</p>
                                                                    </div>
                                                                </div>
                                                                <p className="invoice_type">{item.status === "paid" && <span className="invoice_paid">{item.status}</span>}
                                                                    {item.status === "failed" && <span className="invoice_failed">{item.status}</span>}
                                                                    {item.status === "pending" && <span className="invoice_pending">{item.status}</span>}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </Card>
                                        )}
                                    </div>
                                </div>
                                {transPop && (
                                    <div>
                                        <Modal
                                            title="Transaction details"
                                            centered
                                            visible={modal2Visible}
                                            width="50%"
                                            onCancel={cancelTransaction}

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
                                                    <div style={{ marginTop: 25 }}>
                                                        <div className="trans_detail" style={{ marginBottom: '15px' }}>

                                                            <div className="trans_card">
                                                                <div className="trans_card_1">
                                                                    <div>
                                                                        <p>Customer Name</p>
                                                                        <p className="trans_cards">{transPop && transPop.name}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p>Phone</p>
                                                                        <p className="trans_cards">{transPop && transPop.phone}</p>
                                                                    </div>

                                                                </div>
                                                                {/* <div>
                                                                    <div className="trans_margin">
                                                                        <p style={{ margin: 0 }}>Email</p>
                                                                        <p className="trans_cards" style={{ margin: 0 }}>{transPop && transPop.email}</p>
                                                                    </div>
                                                                </div> */}

                                                            </div>

                                                            <div className="trans_card">
                                                                <div className="trans_card_1">
                                                                    <div>
                                                                        <p>{transPop && transPop.invoices !== undefined &&
                                                                            transPop.invoices.partial_payment && transPop.invoices.partial_payment.is_allowed
                                                                            ? "Total Paid Amount"
                                                                            : "Payments"}</p>
                                                                        <p className="trans_cards">&#x20B9; {transPop && transPop.paid}</p>
                                                                    </div>

                                                                </div>

                                                            </div>

                                                        </div>
                                                        {/* <div className="trans_detail">
                                                            {transPop && transPop.invoices !== undefined && transPop.invoices.partial_payment !== undefined && transPop.invoices.partial_payment.is_allowed ? null : (
                                                                <>
                                                                    <div className="trans_card">
                                                                        {transPop && transPop.invoices !== undefined ? (
                                                                            <div className="trans_card_1">
                                                                                {transPop && transPop.invoices.discount !== undefined &&
                                                                                    transPop.invoices.discount.value !== 0 ? (
                                                                                    <>
                                                                                        <div>
                                                                                            Discount{" "}
                                                                                            {transPop && transPop.invoices.discount.calculation ===
                                                                                                "rs"
                                                                                                ? "(" +
                                                                                                transPop && transPop.invoices.discount.value +
                                                                                                "rs" +
                                                                                                ")" : "(" + transPop && transPop.invoices.discount.value + "%" + ")"}
                                                                                            <p className="trans_cards">&#x20B9; {Math.round(
                                                                                                transPop && transPop.invoices.cost.discount * 100
                                                                                            ) / 100}</p>
                                                                                        </div>

                                                                                    </>
                                                                                ) : null}
                                                                            </div>) : null}
                                                                        <div></div>
                                                                    </div>
                                                                    <div className="trans_card">
                                                                        {transPop && transPop.invoices !== undefined ? (
                                                                            <div className="trans_card_1">
                                                                                {transPop && transPop.invoices.tax !== undefined &&
                                                                                    transPop.invoices.tax.length !== 0 ? transPop.invoices.tax.map((tax, t) => (
                                                                                        <> {tax.is_checked && (
                                                                                            <div key={t}>
                                                                                                {tax.name} ({tax.percentage}%)
                                                                                                <p className="trans_cards">&#x20B9; {Math.round(
                                                                                                    Math.round(tax.value * 100) / 100)}</p>
                                                                                            </div>
                                                                                        )}


                                                                                        </>
                                                                                    )
                                                                                    ) : null}
                                                                            </div>) : null}
                                                                        <div></div>
                                                                    </div>
                                                                </>

                                                            )}

                                                        </div> */}

                                                        <div className="trans_detail">
                                                            <div className="trans_card">
                                                                <div className="trans_card_1">
                                                                    <div>
                                                                        <p>Description</p>
                                                                        <p className="trans_cards">{transPop && transPop.notes} Payment</p>
                                                                    </div>
                                                                    <div>
                                                                        <p>Transacted On</p>
                                                                        <p className="trans_cards">{showDateTime(transPop && transPop.transDate)}</p>
                                                                    </div>

                                                                </div>
                                                                <div>
                                                                    <div className="trans_margin">
                                                                        <p style={{ margin: 0 }}>Transaction ID</p>
                                                                        <p className="trans_cards" style={{ margin: 0 }}>{transPop && transPop.transId}</p>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="trans_card">
                                                                <div className="trans_card_1">
                                                                    <div>
                                                                        <p>Payment Mode</p>
                                                                        <p className="trans_cards">{transPop.transpayMode === "" ? "-" : transPop.transpayMode}</p>
                                                                    </div>



                                                                </div>
                                                                <div className="trans_card_1">
                                                                    <div>
                                                                        <p>Notes</p>
                                                                        <p className="trans_cards">{transPop.notes === "" ? "-" : transPop.notes}</p>
                                                                    </div>
                                                                </div>

                                                            </div>

                                                        </div>

                                                    </div>

                                                </Form>
                                            </div>
                                        </Modal>
                                    </div>
                                )}


                                <div>
                                    <Modal
                                        title="Record a payment"
                                        centered
                                        visible={modalPayment}

                                        onCancel={cancelPayment}

                                        footer={[
                                            <button
                                                key="cancel"
                                                type="primary"
                                                onClick={cancelPayment}
                                                style={{ marginRight: "12px" }}
                                                className="cancel_btn "
                                            >
                                                Cancel
                                            </button>, <button
                                                key="submit"
                                                type="primary"
                                                onClick={createTransactions}
                                                className="create_btn"

                                            >
                                                Submit
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
                                                    label="Payment Date"
                                                >
                                                    <DatePicker
                                                        dateFormat="MM-dd-yyyy"
                                                        placeholder="Paydate"
                                                        name="date"
                                                        id="date"

                                                        value={state.date}

                                                        style={{ fontWeight: "500", padding: "5px", width: "60%", margin: 0 }}
                                                        showYearDropdown
                                                        showMonthDropdown
                                                        ariaDescribedBy="basic-addon2"
                                                        onChange={handleOnPaydateChange}
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Amount(INR)"
                                                >
                                                    <Input name="amount" placeholder="amount"
                                                        value={state.amount} onChange={handleChangeNumbers}
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Payment Mode"
                                                >
                                                    <Select
                                                        value={state.payMode}
                                                        name="payMode"
                                                        onChange={handleChangePayment}
                                                        style={{ width: '100%' }}
                                                    >

                                                        <Option value="cash">Cash</Option>
                                                        <Option value="online">Online</Option>

                                                    </Select>
                                                </Form.Item>
                                                <Form.Item
                                                    label="Notes"
                                                >
                                                    <Input name="notes" placeholder="Notes"
                                                        value={state.notes} onChange={notesOnchange}
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
                                            </button>, <button
                                                key="submit"
                                                type="primary"
                                                className="create_btn "
                                                onClick={createInvoiceModal}
                                            >
                                                Submit
                                            </button>


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
                                                <Form.Item
                                                    label="From"
                                                >
                                                    <div className="send_invoice_input">
                                                        <Input name="from" className="invoice_width business_input"
                                                            value={sendInvoices.from} readOnly
                                                        />
                                                        <BsQuestionCircle style={{ color: "#808080" }} className="invoice_input_icon" />
                                                    </div>
                                                </Form.Item>
                                                {items && items.length !== 0 ? items && items.map((item, i) => (
                                                    <Form.Item
                                                        label={symbol(i)}
                                                    >
                                                        <div className="send_invoice_input">
                                                            <Input
                                                                name="to"
                                                                value={item.to}
                                                                placeholder="To"
                                                                autoComplete="off"
                                                                className="to-input business_input"
                                                                onChange={(e) => handleInputChange(e, i)}
                                                            />
                                                            <BsPlusCircle className="invoice_plus_icon" onClick={handleAddClick} />
                                                        </div>


                                                    </Form.Item>
                                                )) : null}


                                                {/* <div style={{ width: "100%", marginBottom: "25px", marginTop: "25px" }}>

                                                    {items && items.length !== 0 ? items && items.map((item, i) => (
                                                        <table>
                                                            <tbody>
                                                                <tr key={i}>
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

                                                <Form.Item
                                                    label="Subject"
                                                >
                                                    <Input name="subject" placeholder="Subject" className="invoice_width business_input"
                                                        value={sendInvoices.subject} onChange={handleChangeInvoice}
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Message"
                                                >
                                                    <TextArea name="message" style={{ borderRadius: "4px" }} className="invoice_width business_input" rows={4} placeholder="Message" maxLength={6}
                                                        value={sendInvoices.message} onChange={handleChangeInvoice}
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label="  "
                                                >
                                                    <div className='send_invoice_checkbox'>
                                                        <div className="invoice_check1" style={{ marginBottom: 20 }}>
                                                            <div className="invoice_check_col_1"></div>
                                                            <div className="invoice_check_col_2">
                                                                <input type="checkbox" name="message" ckecked={sendInvoices.checkbox_1}
                                                                    style={{ marginRight: 10 }}

                                                                    onChange={check_1Onchange}
                                                                /> <span style={{ marginTop: 5, float: 'left' }}> Send a copy to myself at <span style={{ color: "black", fontWeight: 500 }}>{sendInvoices.checkbox_1 ? sendInvoices.from : ""}</span></span>
                                                            </div>
                                                        </div>

                                                        <div className="invoice_check1">
                                                            <div className="invoice_check_col_1"></div>
                                                            <div className="invoice_check_col_2">
                                                                <input type="checkbox" name="message" ckecked={sendInvoices.checkbox_2}
                                                                    style={{ marginRight: 10 }}

                                                                    onChange={check_2Onchange}
                                                                /> <span style={{ marginTop: 5, float: 'left' }}> Attach the invoice as a PDF</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </Form.Item>
                                            </Form>
                                        </div>
                                    </Modal>
                                </div>

                                <div>
                                    <Modal
                                        title="Invoice Link"
                                        centered
                                        visible={shareLink}

                                        onCancel={cancelShareLink}

                                        footer={[

                                            <WhatsappShareButton url={linkValue} style={{ marginRight: '10px' }}>
                                                <WhatsappIcon size={40} round={true} />
                                            </WhatsappShareButton>,
                                            <TelegramShareButton url={linkValue}>
                                                <TelegramIcon size={40} round={true} />
                                            </TelegramShareButton>,


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

                                                <div className="social_media" title="copy">
                                                    <input type="text" name="link_value" className="social_media_input" value={linkValue} />
                                                    <CopyToClipboard text={linkValue} style={{ cursor: 'pointer' }}>
                                                        <span><Popover content="Copied"
                                                            trigger="click"><MdContentCopy style={{ fontSize: 20 }} /></Popover></span>
                                                    </CopyToClipboard>
                                                </div>

                                            </Form>
                                        </div>
                                    </Modal>
                                </div>

                                <div>
                                    <Modal
                                        title="Pay Now"
                                        visible={paynow}
                                        onCancel={cancelPaynow}
                                        className="payNow-modal"
                                        footer={[
                                            <button
                                                type="primary"
                                                className="cancel_btn btn btn-default"
                                                style={{ marginRight: "10px" }}
                                                onClick={cancelPaynow}
                                            >
                                                Cancel
                                            </button>

                                        ]}
                                    >
                                        <div>
                                            <div style={{ marginBottom: '15px' }}>
                                                <input
                                                    type="radio"
                                                    name="upi_account"
                                                    // value={accountType}
                                                    value={upiAccount}

                                                    id="upi"
                                                    checked={upiCheck}
                                                    onChange={() => handleUpiRadioChange("UPI")}

                                                />
                                                <label className="label_margin ivc_type_name" for="upi">
                                                    UPI
                                                </label>
                                                <input
                                                    type="radio"
                                                    name="bank_account"
                                                    value={bankAccount}
                                                    id="bank_account"
                                                    checked={bankAccountCheck}
                                                    onChange={() =>
                                                        handlebankAccountRadioChange("bank_account")
                                                    }
                                                />
                                                <label className="label_margin ivc_type_name" for="bank_account">
                                                    Bank Account
                                                </label>
                                            </div>
                                            <div>

                                                {upiAccount === "UPI" && (
                                                    <div>
                                                        {upiBeneficiaryList && upiBeneficiaryList != 0 ? (
                                                            <>
                                                                <div className='payNow_label'>Select VPA</div>
                                                                {upiBeneficiaryList && upiBeneficiaryList.map((item, n) => (
                                                                    <ul key={n} >
                                                                        <div className='payNow_card' style={{ marginBottom: '15px' }}>
                                                                            <li>
                                                                                <input type="radio" className='select_acc' value={item.beneficiary_id} checked={item.beneficiary_id === checkBneficiary} onChange={() => beneficiaryOnchange(item)} style={{ marginRight: 10 }} />

                                                                                <div className='payNow_accinfo'>
                                                                                    <div className='payNow_accname'>{item?.vpa.upi ?? "-"}</div>
                                                                                </div>
                                                                            </li>
                                                                        </div>
                                                                    </ul>
                                                                ))}
                                                            </>

                                                        ) : (
                                                            <>
                                                                <div style={{ marginTop: -15 }}>

                                                                    <div className="col-jr-12 p-0">
                                                                        <div className="brd_top" />
                                                                        <div className="due_tab" style={{ textAlign: "center" }}>There is no UPI ID</div>
                                                                    </div>

                                                                </div>
                                                            </>
                                                        )}

                                                        <div className="paynow_amount">
                                                            <div className='payNow_label'>Amount to be paid</div>

                                                            <div className='payNow_accname' style={{ marginBottom: "8px" }}>&#x20B9; {toFixed(state.transaction_Amount || "")}</div>

                                                            <div className='payNow_card'>
                                                                <div className='payNow_bal'>Your Current Balance : <span>&#x20B9; {merchantAccountBal}</span></div>
                                                            </div>
                                                        </div>
                                                        <div className='col-xs-12 p-0 text-center' style={{ marginTop: "35px" }}>
                                                            <button
                                                                type="primary"
                                                                className="create_btn payNow_btn"
                                                                onClick={() => submitPayment("upi")}
                                                            >
                                                                Pay Now
                                                            </button>
                                                        </div>

                                                    </div>
                                                )}

                                                {bankAccount === "bank_account" && (
                                                    <div>
                                                        {bankBeneficiaryList && bankBeneficiaryList != 0 ? (
                                                            <>
                                                                <div className='payNow_label'>Select Account</div>
                                                                {bankBeneficiaryList && bankBeneficiaryList.map((item, n) => (
                                                                    <ul key={n} >
                                                                        <li>
                                                                            <div className='payNow_card' style={{ marginBottom: '15px' }}>

                                                                                <div className='col-xs-6 p-0'>
                                                                                    <input type="radio" className='select_acc' value={item.beneficiary_id} checked={item.beneficiary_id === checkBneficiary} onChange={() => beneficiaryOnchange(item)} style={{ marginRight: 10 }} />
                                                                                    <div className='payNow_accinfo'>
                                                                                        <div className='payNow_accname'>{item?.bank_info?.name ?? ""}</div>
                                                                                        <div className='payNow_accdesc'>{item?.bank_info?.account_number ?? ""} </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='col-xs-6 p-0'>
                                                                                    <div className='payNow_bankname'>Bank Name</div>
                                                                                    <div className='payNow_accdesc'>{item?.bank_info?.bank ?? ""}</div>
                                                                                </div>

                                                                            </div>

                                                                        </li>
                                                                    </ul>
                                                                ))}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div style={{ marginTop: -15 }}>

                                                                    <div className="col-jr-12 p-0">
                                                                        <div className="brd_top" />
                                                                        <div className="due_tab" style={{ textAlign: "center" }}>There is no Account Number</div>
                                                                    </div>

                                                                </div>
                                                            </>
                                                        )}


                                                        <div className="paynow_amount">
                                                            <div className='payNow_label'>Amount to be paid</div>

                                                            <div className='payNow_accname' style={{ marginBottom: "8px" }}>&#x20B9; {toFixed(state.transaction_Amount || "")}</div>

                                                            <div className='payNow_card'>
                                                                <div className='payNow_bal'>Your Current Balance : <span>&#x20B9; {toFixed(merchantAccountBal)}</span></div>
                                                            </div>
                                                        </div>

                                                        <div className="payment_group">
                                                            <div className='payNow_label'>Select Payment Mode</div>
                                                            <div>
                                                                {state.transaction_Amount <= "200000" ? (
                                                                    <>
                                                                        <input
                                                                            type="radio"
                                                                            name="accountType"
                                                                            value={accountType}
                                                                            id="Neft"
                                                                            checked={neftCheck}
                                                                            onChange={() => handleNeftRadioChange("NEFT")}

                                                                        />
                                                                        <label className="label_margin ivc_type_name" for="Neft">
                                                                            NEFT
                                                                        </label>
                                                                        <input
                                                                            type="radio"
                                                                            name="accountType"
                                                                            value={accountType}
                                                                            id="imps"
                                                                            checked={impsCheck}
                                                                            onChange={() =>
                                                                                handleOimpsRadioChange("IMPS")
                                                                            }
                                                                        />
                                                                        <label className="label_margin ivc_type_name" for="imps">
                                                                            IMPS
                                                                        </label>
                                                                        <input
                                                                            type="radio"
                                                                            name="accountType"
                                                                            value={accountType}
                                                                            id="rtgs"
                                                                            checked={rtgsCheck}
                                                                            onChange={() =>
                                                                                handleOrtgsRadioChange("RTGS")
                                                                            }
                                                                        />
                                                                        <label className="label_margin ivc_type_name" for="rtgs">
                                                                            RTGS
                                                                        </label>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <input
                                                                            type="radio"
                                                                            name="accountType"
                                                                            value={accountType}
                                                                            id="rtgs"
                                                                            checked={rtgsCheck}
                                                                            onChange={() =>
                                                                                handleOrtgsRadioChange("RTGS")
                                                                            }
                                                                        />
                                                                        <label className="label_margin ivc_type_name" for="rtgs">
                                                                            RTGS
                                                                        </label>
                                                                    </>
                                                                )}

                                                            </div>
                                                        </div>
                                                        <div className='col-xs-12 p-0 text-center' style={{ marginTop: "35px" }}>
                                                            <button
                                                                type="primary"
                                                                className="create_btn payNow_btn"
                                                                onClick={() => submitPayment("bank")}
                                                            >
                                                                Pay Now
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    </Modal>
                                </div>
                            </div>
                        ) : (
                            <div className="business_top">
                                <div className="business_header page_header" style={{ display: 'flex', justifyContent: 'center', marginTop: 150 }}>

                                    <div className="page-loaders"></div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

        </div >

    )
}

export default InvoicependingDetails;


