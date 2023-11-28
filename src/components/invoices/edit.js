import React, { useState, useEffect, useRef } from "react";
import uploadImage from "../../images/cloud.png";
import uploadMerchant_logo from "../../images/agri_logo_img.jpg";
import { Card, Input, Select, DatePicker, Modal, Form } from "antd";
import {
    PlusCircleOutlined,
    LoadingOutlined,
    PlusCircleFilled,
    DeleteOutlined,
    MinusCircleOutlined
} from "@ant-design/icons";
import urlLink from "../../helpers/globalVariables";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BsQuestionCircle, BsPlusCircle, BsFillTrashFill } from 'react-icons/bs'
import {
    showError,
    Toaster,
    toastError,
    number,
    showDate,
    returnFixed,
    toFixed,
    getIsoString,
    isInvalidEmail,
    isInvalidName,
} from "../../helpers/Utils";
import { textCapitalize } from "../../helpers/Utils";
import {
    createInvoice,
    updateInvoice,
    invoiceDetails,
    updateSendInvoice,
} from "../../store/actions/invoice";
import { myprofile, UploadProfile } from "../../store/actions/profile";
import {
    farmerList,
    farmerDetail,
    farmerActiveList,
} from "../../store/actions/farmerList";
import {
    businessList,
    bussinessDetails,
    businessActiveList,
} from "../../store/actions/businessList";
import {
    createTransaction,
    transactionList,
} from "../../store/actions/transaction";
import { taxList, createTax, updateTax } from "../../store/actions/tax";
import moment from "moment";
// import { myprofile } from '../../store/actions/profile';
import {
    invoiceItemList,
    invoiceItemDetails,
    updateItem,
    createInvoiceItem,
} from "../../store/actions/invoiceItem";
import { INVOICE_TYPES } from "../../helpers/enums/invoice";
import { textAlign } from "@mui/system";

const { Option } = Select;

function AddEdit(props) {
    const errorMessage = "Please create the item";
    const params = useParams();
    const dispatch = useDispatch();
    const items = useSelector((state) => state.business_list.user.business);
    const farmers = useSelector((state) => state.farmer_list.user.farmers);
    const handleInput = useRef(null);
    const inputRef = useRef(true);
    const { TextArea } = Input;

    // const taxList = useSelector(state => state.tax_list.user.tax_list)
    const [inputList, setInputList] = useState([
        { name: "", desc: "", qty: 1, cost: 0, amount: "", gst: 0 },
    ]);
    const [inputIndex, setInputIndex] = useState("");
    const [inputEvent, setInputEvent] = useState("");
    const [state, setState] = useState({
        type: "",
        gst_type: "",
        heading: "Invoice",
        summary: "",
        id: params.id,
        farmer: "",
        business: "",
        role: "",
        invoiceno: "",
        invoicedate: moment(new Date()),
        paymentdue: moment(new Date()),
        farmer_f2m: "f2m",
        business_m2b: "",
        farmer_check: true,
        business_check: false,
        checkedItems: new Map(),
        farmer_id: "",
        selected_farmer_id: "",
        selected_business_id: "",
        payment_select: "",
        business_id: "",
        farmer_name: "",
        business_name: "",
        is_samebusiness_billing: false,
        terms_condition: "",
        is_same_business_billing: false,
        farmer_address: "",
        futures_condition: false,
        farmer_list: [],
        customerAddress: params.id ? true : false,
        select_farmer_dash: true,
        select_business_dash: true,
        pay_amount: "",
        invoiceType: "",

    });
    const [isOpenItemList, setIsOpenItemList] = useState(false);
    const [modalItem, setmodalItem] = useState({
        name: "",
        description: "",
        cost: "",
        gst: "",
        item_id: "",
        currency: "",
        quantity: "",
    });

    const [merchantAddress, setMerchantAddress] = useState({
        merchant_name: "",
        merchant_shipping_add_line1: "",
        merchant_shipping_state: "",
        merchant_shipping_city: "",
        merchant_shipping_zipcode: "",
        merchant_billing_add_line1: "",
        merchant_billing_state: "",
        merchant_billing_city: "",
        merchant_billing_zipcode: "",
        is_same_merchant_billing: false,
        gst_number: "",
    });
    const [role, setRole] = useState("");
    const [modal2Visible, setModal2Visible] = useState(false);
    const [customerAddress, setCustomerAddress] = useState(
        params.id ? true : false
    );
    const [farmer_f2m, setFarmer_f2m] = useState("f2m");
    const [business_m2b, setBusiness_m2b] = useState("");
    const [businessArray, setBusinessArray] = useState();
    const [data, setData] = useState(taxList);
    const [farmerCheck, setFarmerCheck] = useState(true);
    const [businessCheck, setBusinessCheck] = useState(false);
    const [neftCheck, setNeftCheck] = useState(true);
    const [oimpsCheck, setOimpsCheck] = useState(false);
    const [ortgsCheck, setOrtgsCheck] = useState(false);
    const [neft, setNeft] = useState("neft");
    const [oimps, setOimps] = useState("");
    const [ortgs, setOrtgs] = useState("");
    const [merchantImage, setMerchantImage] = useState("");
    const [invoiceModal, setInvoiceModal] = useState(false);
    const [merchant_Image, setMerchant_Image] = useState("");
    const [invoiceProfileImage, setInvoiceProfileImage] = useState("");

    const [query, setQuery] = useState("");
    const [farmer_list, setFarmer_List] = useState([]);
    const [arr, setArray] = useState([]);
    const [customer, setCustomer] = useState(INVOICE_TYPES.customer);
    const [discount, setDiscount] = useState("rs");
    const [subTotal, setSubTotal] = useState(0);
    const [discountPrice, setDiscountPrice] = useState(0.0);
    const [adjustmentPrice, setadjustmentprice] = useState(0.0);
    const [gstpercent, setGstpercent] = useState(0.0);
    const [rate, setRate] = useState(0.0);
    const [adjustmentrate, setAdjustmentRate] = useState(0.0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [farmername, setFarmerName] = useState("");
    const [farmer, setFarmer] = useState(INVOICE_TYPES.farmer);
    const [checked, setChecked] = useState(false);
    const [checkFuture, setCheckFuture] = useState(false);
    const [checkedPartial, setcheckedPartial] = useState(false);
    const [gstChecked, setGstChecked] = useState(false);
    const [tax, setTax] = useState(0);
    const [openGst, setOpenGst] = useState(false);
    const [name, setName] = useState("");
    const [percent, setPercent] = useState(0);

    const [loading, setLoading] = useState(false);
    const [merchant, setMerchantId] = useState("");
    const [customerId, setCustomerId] = useState("");
    const [businessAddName, setBusinessAddName] = useState("");
    const [business_bill_add_1, setbusiness_bill_add_1] = useState("");
    const [business_bill_add_2, setbusiness_bill_add_2] = useState("");
    const [business_bill_city, setbusiness_bill_city] = useState("");
    const [business_bill_state, setbusiness_bill_state] = useState("");
    const [business_bill_zipcode, setbusiness_bill_zipcode] = useState("");
    const [businessAddress, setbusinessAddress] = useState("");
    const [business_ship_add_1, setbusiness_ship_add_1] = useState("");
    const [business_ship_add_2, setbusiness_ship_add_2] = useState("");
    const [business_ship_city, setbusiness_ship_city] = useState("");
    const [business_ship_state, setbusiness_ship_state] = useState("");
    const [business_ship_zipcode, setbusiness_ship_zipcode] = useState("");
    const [business_same_billing, setbusiness_same_billing] = useState("");
    const [farmerAddName, setFarmerAddName] = useState("");
    const [farmer_bill_add_1, setfarmer_bill_add_1] = useState("");
    const [farmer_bill_add_2, setfarmer_bill_add_2] = useState("");
    const [farmer_bill_city, setfarmer_bill_city] = useState("");
    const [farmer_bill_state, setfarmer_bill_state] = useState("");
    const [farmer_bill_zipcode, setfarmer_bill_zipcode] = useState("");
    const [farmerAddress, setfarmerAddress] = useState("");
    const [imageLoaded, setImageLoaded] = useState(false);

    const [businessName, setBusinessName] = useState("");
    const [farmerId, setFarmerId] = useState("");
    const [businessId, setBusinessId] = useState("");
    const [isGst, setIsGst] = useState();
    const [products, setProducts] = useState([]);
    const [taxArray, setTaxArray] = useState([]);
    const [businessess, setBusinessess] = useState([]);
    const [taxLists, setTaxLists] = useState([]);
    const [farmersList, setFarmersList] = useState([]);
    const [paynow, setPaynow] = useState(false);
    const [itemList, setItemList] = useState([]);
    const [itemName, setItemName] = useState("");
    const [itemSelect, setItemSelect] = useState(false);
    const history = useHistory();
    const [toInvoice, setToInvoice] = useState([{ to: "" }]);
    const [sendInvoices, setSendInvoices] = useState({
        from: "",
        to: "",
        message: "",
        subject: "",
        checkbox_1: false,
        checkbox_2: false,


    })

    useEffect(() => {
        farmerLIST2();
    }, []);

    useEffect(() => {
        farmerLIST3();
    }, []);

    useEffect(() => {
        farmerLIST4();
    }, []);

    useEffect(() => {
        ItemList();
    }, [modalItem]);

    useEffect(() => {
        taxarray();
    }, []);

    useEffect(() => {
        if (params.id) {
            handleTable();
        }
    }, []);

    useEffect(() => {
        if (customerId !== "") {
            businessNameChange(customerId);
            farmerNameChange(customerId);
        }
    }, []);

    useEffect(() => {
        if (state.farmer_id !== "") {
            farmerNameChange();
        }
    }, []);

    useEffect(() => {
        if (params.id === undefined) {
            farmerLIST();
        }
    }, []);

    const taxarray = () => {
        let data = {
            value: 0,
            is_checked: false,
        };
        let arrTax = taxLists && taxLists.filter((x) => x.is_enabled);
        if (arrTax?.length > 0) {
            let updateTaxes = arrTax.map((x) => ({ ...x, ...data }));
            setTaxArray(updateTaxes);
            setTaxLists(updateTaxes);
        }
    };

    const onChange = (event) => {
        setChecked(event.target.checked);
    };

    const onChangeFuture = (event) => {
        setCheckFuture(event.target.checked);
    };

    const onChangePartial = (event) => {
        setcheckedPartial(event.target.checked);
        if (event.target.checked === false) {
            setState({ ...state, payment_select: undefined });
        }
    };

    const farmerLIST = () => {
        // if(params.id === ""){
        dispatch(
            myprofile((result) => {
                if (result) {
                    let data = result.merchant;
                    let address = data?.address;

                    setMerchantAddress({
                        ...merchantAddress,
                        merchant_name: data?.name?.full ?? "",
                        merchant_billing_add_line1: address?.billing?.line_1 ?? "",
                        merchant_billing_state: address?.billing?.state?.name ?? "",
                        merchant_billing_city: address?.billing?.city?.name ?? "",
                        merchant_billing_zipcode: address?.billing?.zipcode ?? "",
                        merchant_shipping_add_line1: address?.shipping?.line_1 ?? "",
                        merchant_shipping_state: address?.shipping?.state?.name ?? "",
                        merchant_shipping_city: address?.shipping?.city?.name ?? "",
                        merchant_shipping_zipcode: address?.shipping?.zipcode ?? "",
                        is_same_merchant_billing: address?.is_same_billing ?? "",
                        gst_number: data?.business?.gst ?? "",
                    });

                    setState({
                        ...state,
                        terms_condition: data?.settings?.invoice?.terms ?? "",
                    });

                    setCheckFuture(data?.settings?.invoice?.use_for_future ?? false);

                    setMerchantImage(data?.image ?? "");
                    setMerchantId(data?.merchant_id ?? "");
                }
            })
        );
        // }
    };
    const farmerLIST2 = () => {
        dispatch(
            farmerActiveList((result) => {
                if (result) {
                    setFarmersList(result.farmers);
                }
            })
        );
    };

    const farmerLIST3 = () => {
        dispatch(
            businessActiveList((result) => {
                if (result) {
                    setBusinessess(result.business);
                }
            })
        );
    };

    const farmerLIST4 = () => {
        dispatch(
            taxList(query, (result) => {
                if (result) {
                    setTaxLists(result.tax_list);
                }
            })
        );
    };

    const ItemList = () => {
        let query = "";
        dispatch(
            invoiceItemList(query, (result) => {
                if (result) {
                    setItemList(result?.items ?? "");
                }
            })
        );
    };

    let defaultRole = "";
    // try {
    //     defaultRole = JSON.parse(state.role);
    // } catch (error) { }
    try {
        defaultRole = JSON.parse(role);
    } catch (error) { }

    // const myProfile = () => {
    //     dispatch(
    //         myprofile((result) => {
    //             if (result) {
    //                 let data = result.merchant;

    //                 setMerchantId(data.merchant_id);
    //             }
    //         })
    //     );
    // };

    const handleTable = () => {
        dispatch(
            invoiceDetails(params.id, (result) => {
                if (result) {
                    let data = result.invoice;
                    let input = data?.items ?? "";
                    let address = data?.merchant?.address ?? "";
                    let customer = data?.customer?.address ?? "";
                    let farmer = data?.invoice_type === "f2m";
                    let business = data?.invoice_type === "m2b";
                    let input_item = [];

                    if (data.status !== "draft") {
                        history.push("/invoices");
                    }
                    for (let i = 0; i < input.length; i++) {
                        let item = input[i];
                        let data = {
                            name: item.name,
                            desc: item.desc,
                            cost: item.cost,
                            gst: item.gst,
                            qty: item.qty,
                        };
                        input_item.push(data);
                    }
                    setCustomerId(data?.customer?.id);
                    setBusinessArray(data);
                    setState({
                        ...state,
                        summary: data?.summary,
                        type: data?.invoice_type,
                        role: JSON.stringify({
                            name: data?.customer?.name,
                            id: data?.customer?.id,
                        }),

                        invoiceno: data.invoice_no,
                        invoicedate: moment(data?.date?.issue ?? ""),
                        paymentdue: moment(data?.date?.due ?? ""),
                        invoiceType: data?.invoice_type === "m2b" ? "Business" : "Farmer",
                        farmer_f2m:
                            data.invoice_type === "f2m"
                                ? data.invoice_type
                                : setFarmerCheck(false),
                        business_m2b:
                            data.invoice_type === "m2b"
                                ? data.invoice_type
                                : setBusinessCheck(false),

                        terms_condition: data?.terms,
                    });
                    setSendInvoices({
                        ...sendInvoices,
                        from: data?.merchant?.email,
                        subject: "Invoice " + "#" + data.invoice_no + " from " + data?.merchant?.name,
                        message: `Dear ${data?.customer?.name},\nThank you for your business.Your invoice can be viewed,printed and downloaded as PDF from the link below.You can also choose to pay it online\n\n${window.location.protocol}//pay.ippopay.com/${data.link_url}`,
                        checkbox_1: false,
                        checkbox_2: false,
                    })
                    setRole(
                        JSON.stringify({
                            name: data?.customer?.name,
                            id: data?.customer?.id,
                        })
                    );

                    setMerchantAddress({
                        ...merchantAddress,
                        merchant_name: data?.merchant?.name ?? "",
                        merchant_shipping_add_line1: address?.shipping?.line_1 ?? "",
                        merchant_shipping_state: address?.shipping?.state?.name ?? "",
                        merchant_shipping_city: address?.shipping?.city?.name ?? "",
                        merchant_shipping_zipcode: address?.shipping?.zipcode ?? "",
                        merchant_billing_add_line1: address?.billing?.line_1 ?? "",
                        merchant_billing_state: address?.billing?.state?.name ?? "",
                        merchant_billing_city: address?.billing?.city?.name ?? "",
                        merchant_billing_zipcode: address?.billing?.zipcode ?? "",
                        is_same_merchant_billing: address?.is_same_billing ?? "",
                        gst_number: data?.merchant?.business?.gst ?? "",
                    });
                    setFarmer_f2m(
                        data.invoice_type === "f2m"
                            ? data.invoice_type
                            : setFarmerCheck(false)
                    );
                    setBusiness_m2b(
                        data.invoice_type === "m2b"
                            ? data.invoice_type
                            : setBusinessCheck(false)
                    );
                    setBusinessAddName(business ? data?.customer?.name ?? "" : "");
                    setbusiness_bill_add_1(
                        business ? customer?.billing?.line_1 ?? "" : ""
                    );
                    setbusiness_bill_add_2(
                        business ? customer?.billing?.line_2 ?? "" : ""
                    );
                    setbusiness_bill_city(
                        business ? customer?.billing?.city?.name ?? "" : ""
                    );
                    setbusiness_bill_state(
                        business ? customer?.billing?.state?.name ?? "" : ""
                    );
                    setbusiness_bill_zipcode(
                        business ? customer?.billing?.zipcode ?? "" : ""
                    );
                    setbusinessAddress(business ? customer : "");
                    setbusiness_ship_add_1(
                        business ? customer?.shipping?.line_1 ?? "" : ""
                    );
                    setbusiness_ship_add_2(
                        business ? customer?.shipping?.line_2 ?? "" : ""
                    );
                    setbusiness_ship_city(
                        business ? customer?.shipping?.city?.name ?? "" : ""
                    );
                    setbusiness_ship_state(
                        business ? customer?.shipping?.state?.name ?? "" : ""
                    );
                    setbusiness_ship_zipcode(
                        business ? customer?.shipping?.zipcode ?? "" : ""
                    );
                    setbusiness_same_billing(
                        business ? customer?.is_same_billing ?? "" : ""
                    );
                    setFarmerAddName(farmer ? data?.customer?.name ?? "" : "");
                    setfarmer_bill_add_1(farmer ? customer?.billing?.line_1 ?? "" : "");
                    setfarmer_bill_add_2(farmer ? customer?.billing?.line_2 ?? "" : "");
                    setfarmer_bill_city(
                        farmer ? customer?.billing?.city?.name ?? "" : ""
                    );
                    setfarmer_bill_state(
                        farmer ? customer?.billing?.state?.name ?? "" : ""
                    );
                    setfarmer_bill_zipcode(
                        farmer ? customer?.billing?.zipcode ?? "" : ""
                    );
                    setfarmerAddress(farmer ? customer : "");
                    setFarmerCheck(farmer ? true : false);
                    setBusinessCheck(business ? true : false);
                    setCustomer(
                        data?.customer?.customer_type === "Business"
                            ? data?.customer?.name ?? ""
                            : ""
                    );
                    setFarmer(
                        data?.customer?.customer_type === "Farmer"
                            ? data?.customer?.name ?? ""
                            : ""
                    );

                    setInputList(input_item);
                    setSubTotal(data?.cost?.actual ?? "");
                    setadjustmentprice(data?.cost?.adjustment ?? "");
                    setTotalAmount(data?.cost?.final ?? "");
                    setRate(data?.cost?.discount ?? "");
                    setDiscountPrice(data?.discount?.value ?? "");
                    setDiscount(data?.discount?.calculation ?? "");
                    setChecked(data?.is_gst ?? "");
                    setArray(data?.tax ?? "");
                    setLoading(true);
                    setTaxLists(data?.tax ?? "");
                    setcheckedPartial(data?.partial_payment?.is_allowed ?? "");
                    setCheckFuture(data?.use_for_future);
                    setMerchantImage(data?.image);
                    setMerchant_Image(data?.image);
                }
            })
        );
    };

    const handleTypeChange = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        if (name !== "business_m2b") {
            // setArray([]);

            setFarmer(INVOICE_TYPES.farmer);
        }
        if (name !== "farmer_f2m") {
            setCustomer(INVOICE_TYPES.customer);
        }
    };

    const handleRadioChange = (event) => {
        setState({
            ...state,
            farmer_f2m: event,
            business_m2b: "",
            farmer_check: true,
            business_check: false,
            customerAddress: false,
            // role: "",
            payment_select: "",
        });

        // setRole("")
        setCustomerAddress(farmer_bill_add_1 !== "" ? true : false);
        setBusiness_m2b("");
        setFarmer_f2m(event);
        setBusinessCheck(false);
        setFarmerCheck(true);
        setChecked(false);
        setcheckedPartial(false);
    };

    const handleBUsinessRadioChange = (event) => {
        setState({
            ...state,
            business_m2b: event,
            farmer_f2m: "",
            business_check: true,
            customerAddress: false,
            farmer_check: false,
            // role: "",
        });
        // setRole("")
        setCustomerAddress(business_bill_add_1 !== "" ? true : false);
        setBusiness_m2b(event);
        setFarmer_f2m("");
        setFarmerCheck(false);
        setBusinessCheck(true);
    };

    const handleOimpsRadioChange = (event) => {
        setOimps(event);
        setOrtgs("");
        setNeft("");
        setNeftCheck(false);
        setOimpsCheck(true);
        setOrtgsCheck(false);
    };

    const handleOrtgsRadioChange = (event) => {
        setOimps("");
        setOrtgs(event);
        setNeft("");
        setNeftCheck(false);
        setOimpsCheck(false);
        setOrtgsCheck(true);
    };

    const handleNeftRadioChange = (event) => {
        setOimps("");
        setOrtgs("");
        setNeft(event);
        setNeftCheck(true);
        setOimpsCheck(false);
        setOrtgsCheck(false);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        // getsubTotal();
    };

    // Item modal
    const handleItemChangeNumber = (e) => {
        const re = /^\d+\.?\d*$/;
        if (e.target.value === "" || re.test(e.target.value)) {
            setmodalItem((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }));
        }
    };
    const handleItemChange = (e) => {
        let REGEX = /^([a-zA-Z0-9]+\s?)*$/;
        if (e.target.value === "" || REGEX.test(e.target.value)) {
            setmodalItem((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }));
        }
        // getsubTotal();
    };
    const cancelPass = () => {
        setmodalItem({
            ...modalItem,
            name: "",
            description: "",
            cost: "",
            currency: "",
            quantity: "",
            item_id: "",
            gst: "",
        });
        setModal2Visible(false);
    };
    const createSignup = () => {
        const { name, description, cost, currency, quantity, gst } = modalItem;

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
        else if (description === "" || description === null) {
            toastError("Please enter the description");
        } else if (cost === "" || cost === null) {
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
                gst: gst,
                currency: currency,
            };
            if (modalItem.item_id) {
                dispatch(
                    updateItem(data, modalItem.item_id, (result) => {
                        if (result) {
                            setModal2Visible(false);
                            setmodalItem({
                                ...modalItem,
                                item_id: "",
                                name: "",
                                description: "",
                                cost: "",
                                currency: "",
                                quantity: "",
                                gst: "",
                            });
                            ItemList();
                        }
                    })
                );
            } else {
                dispatch(
                    createInvoiceItem(data, (result) => {
                        if (result) {
                            setModal2Visible(false);
                            setmodalItem({
                                ...modalItem,
                                name: "",
                                description: "",
                                cost: "",
                                currency: "",
                                quantity: "",
                                gst: "",
                            });
                        }
                    })
                );
            }
        }
    };

    const payment_drop = (e) => {
        setState({
            ...state,
            payment_select: e,
        });
    };

    const handleDiscountChange = (e) => {
        const { name, value } = e.target;
        setDiscount(value);
        getsubTotal();
    };

    const handleInputChange = (e, index) => {
        setInputIndex(index);
        setInputEvent(e);
        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = value;
        setItemSelect(true);
        setInputList(list);
        setIsOpenItemList(false)
        getsubTotal();
    };

    const handleInputsearch = (e, index) => {
        setInputIndex(index);
        setInputEvent(e);
        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = value;
        setItemSelect(false);
        setInputList(list);
        // getsubTotal();
    };

    const handleOnSearchChange = (e) => {
        var name = e.target.name;
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            function () {
                if (name === "customerSearchTerm") {
                    this.getCustomerList(this.state.customerSearchTerm);
                } else if (name === "itemSearchTerm") {
                    this.getItemList(this.state.itemSearchTerm);
                }
            }
        );
    }


    useEffect(() => {
        getsubTotal();
    }, [inputList]);

    const handleInputDesChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = value;
        setInputList(list);
    };
    const handlePriceChange = (e, index) => {
        let re = /^\d+$/;
        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] =
            isNaN(value) || value < 0 || value === "" ? "" : parseInt(value);
        setInputList(list);
        getsubTotal();
    };
    const handlecostChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = returnFixed(value);
        setInputList(list);
        getsubTotal();
    };

    const handlegstChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = returnFixed(value);
        setInputList(list);
        getsubTotal();
    };

    const invoiceNumber = (e) => {
        setState((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const getsubTotal = () => {
        let subtotal = 0;

        inputList.forEach((item) => {
            let total =
                item.cost * item.qty + (item.cost * item.qty * item.gst) / 100;
            subtotal += total;
        });

        setSubTotal(subtotal);
        discountRate(subtotal);
    };

    const handleRemoveClick = (index) => {
        let input = inputList;
        input.splice(index, 1);
        setInputList([...input]);
        getsubTotal();
    };

    const handleAddClick = () => {
        setInputList([
            ...inputList,
            { name: "", desc: "", qty: 1, cost: 0, amount: "", gst: 0 },
        ]);

    };

    const checkEmptyProduct = () => {
        let result;

        let input = inputList;
        for (let i = 0; i < input.length; i++) {
            let inputItem = input[i];
            if (inputItem.name === "") {
                result = true;
            } else if (
                inputItem.qty === "" ||
                inputItem.qty <= 0 ||
                number(inputItem.qty)
            ) {
                result = true;
            } else if (
                inputItem.cost === "" ||
                inputItem.cost == 0
                // ||
                // number(inputItem.cost) dot
            ) {
                result = true;
                console.log(740, inputItem.cost);
            }
            console.log(742, inputItem.cost);
        }

        return result;
    };

    const discountChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        const re = /^\d+\.?\d*$/;

        let discountValue = e.target.value;
        if (value === "" || re.test(value)) {
            setDiscountPrice(value);
        }
    };

    const handleadjustmentChange = (e) => {
        const regEx = /^-?\d+\.?\d*$/;
        // var guidRegex = new RegExp("^[-]?[0-9]{0,900}(?:\.[0-9]{0,900})?$")
        const { name, value } = e.target;
        if (e.target.value === "" || regEx.test(value)) {
            setadjustmentprice(value);
        }
    };

    const handleCheckboxes = (id) => {
        setTaxLists((prev) => {
            return prev.map((item) => {
                if (item.tax_id === id) {
                    return {
                        ...item,
                        is_checked: !item.is_checked,
                        value: 0,
                    };
                } else {
                    return { ...item, value: 0 };
                }
            });
        });
    };

    useEffect(() => {
        let price = subTotal - (subTotal * discountPrice) / 100;
        let setPrice = subTotal - discountPrice;
        let check = !checked;

        let taxes = 0;
        if (business_m2b === "m2b") {
            for (let i = 0; i < taxLists.length; i++) {
                let item = taxLists[i];
                let percent = item.percentage;
                let totalPrice = discount === INVOICE_TYPES.CURRENCY ? setPrice : price;
                let value = (totalPrice * percent) / 100;
                if (item.is_checked) {
                    taxes += value;
                    item["value"] = value;
                }
            }
        }
        setTax(taxes);

        if (discount === INVOICE_TYPES.CURRENCY) {
            setRate(discountPrice);
            setAdjustmentRate(adjustmentPrice);
            console.log(typeof adjustmentPrice);
            setTotalAmount(
                subTotal - discountPrice + taxes + Number(adjustmentPrice)
            );
        } else {
            setRate((subTotal * discountPrice) / 100);
            setAdjustmentRate(adjustmentPrice);
            setTotalAmount(
                subTotal -
                (subTotal * discountPrice) / 100 +
                taxes +
                Number(adjustmentPrice)
            );
        }
    }, [
        itemList,
        discountPrice,
        adjustmentPrice,
        discount,
        state,
        inputList,
        arr,
        checked,
        data,
        tax,
        merchant,
        farmerId,
        businessId,
        businessName,
        taxLists,
        farmer,
        customer,
        farmerCheck,
        businessCheck,
        subTotal,
    ]);

    const discountRate = (subtotal) => {
        if (discount === "rs") {
            setRate(discountPrice);
        } else {
            setRate((subtotal * discountPrice) / 100);
        }
    };

    const showGst = () => {
        setOpenGst(true);
    };

    const cancelTax = () => {
        setOpenGst(false);
    };

    let item = [];
    for (let i = 0; i < inputList.length; i++) {
        let inputItem = inputList[i];
        let data = {
            sno: i + 1,
            name: inputItem.name,
            desc: inputItem.desc,
            cost: inputItem.cost,
            qty: inputItem.qty,
            gst: inputItem.gst,
            amount: inputItem.amount,
        };
        item.push(data);
    }

    const createInvoiceItems = (item) => {
        const { gst } = modalItem;

        let create = item;
        const notEmpty = checkEmptyProduct();

        const {
            heading,
            summary,
            customer,
            business_id,
            farmer_id,
            business_name,
            farmer_name,
            role,
            payment_select,
        } = state;
        if (heading === "" || heading === null) {
            toastError("Please enter the heading");
        } else if (
            business_m2b === "m2b" &&
            (role === "" || role === null || role === undefined)
        ) {
            toastError("Please select the business owner name");
        } else if (
            farmer_f2m === "f2m" &&
            (role === "" || role === null || role === undefined)
        ) {
            toastError("Please select the farmer name");
        } else if (state.invoicedate === "" || state.invoicedate === null) {
            toastError("Please select the invoice date");
        } else if (state.paymentdue === "" || state.paymentdue === null) {
            toastError("Please select the paymentdue date");
        } else if (notEmpty) {
            toastError("Please fill the items field");
        } else if (
            business_m2b === "m2b" &&
            checkedPartial &&
            (payment_select === "" ||
                payment_select === null ||
                payment_select === undefined)
        ) {
            toastError("Please select the partial counts");
        } else if (discountPrice >= subTotal) {
            toastError("Discount should not exceed Total");
        }else if (totalAmount < 0.999) {
            toastError("Total amount should not be less than 1 rupee");
        }
        // else if (totalAmount < 0.9) {
        //     toastError("Total amount should not be in Negative Balance or zero");
        // } 
        else {
            let selectedBusiness = businessess.find(
                (roles) => roles.business_id === JSON.parse(role).id
            );

            let selectedFarmer = farmersList.find(
                (roles) => roles.farmer_id === JSON.parse(role).id
            );

            let item = [];
            let taxes = [];

            for (let i = 0; i < inputList.length; i++) {
                let inputItem = inputList[i];
                let data = {
                    name: textCapitalize(inputItem.name),
                    desc: textCapitalize(inputItem.desc),
                    cost: Number(inputItem.cost).toFixed(2),
                    gst: parseInt(inputItem.gst),
                    // &#x20B9;{Number(item.cost).toFixed(2)}
                    qty: parseInt(inputItem.qty),
                    currency: "INR",
                };
                item.push(data);
            }

            for (let i = 0; i < taxLists.length; i++) {
                let taxesItem = taxLists[i];
                let data = {
                    name: textCapitalize(taxesItem.name),
                    percentage: taxesItem.percentage,
                    tax_id: taxesItem.tax_id,
                    is_checked: taxesItem.is_checked,
                    value: taxesItem.value,
                    is_enabled: taxesItem.is_enabled,
                };
                taxes.push(data);
            }

            let Tax = taxes.filter((x) => x.is_checked === true);

            let data = {
                invoice_no: state.invoiceno,
                heading: textCapitalize(heading),
                summary: textCapitalize(summary),
                image: merchantImage,
                // image: params.id === "" ? merchantImage : merchant_Image,
                is_gst: checked,

                invoice_type: businessCheck === true ? "m2b" : "f2m",

                discount: {
                    value: Number(discountPrice).toFixed(2),
                    calculation: discount,
                },

                cost: {
                    final: Number(totalAmount).toFixed(2),
                    actual: subTotal,
                    tax: tax,
                    discount: Number(rate).toFixed(2),
                    adjustment: Number(adjustmentPrice),
                },
                items: item,
                gst: Number(gst),
                tax: Tax,
                customer: {
                    id:
                        business_m2b === "m2b"
                            ? selectedBusiness.business_id
                            : selectedFarmer.farmer_id,
                    customer_type: business_m2b === "m2b" ? "business" : "farmer",
                    name:
                        business_m2b === "m2b"
                            ? selectedBusiness?.name?.full
                            : selectedFarmer?.name?.full,
                },
                merchant: {
                    id: merchant,
                },
                date: {
                    issue: state.invoicedate,
                    due: state.paymentdue,
                },
                partial_payment: {
                    is_allowed: checkedPartial,
                    transaction_limits: payment_select,
                },
                use_for_future: checkFuture,
                terms: textCapitalize(state.terms_condition),
            };

            console.log(965, data);

            if (state.id) {
                dispatch(
                    updateInvoice(data, state.id, (result) => {
                        if (result) {
                            history.push("/invoices");
                            if (create === "preview") {
                                history.push("/invoices/details/" + state.id);
                            } else if (create === "draft") {
                                history.push("/invoices/edit/" + state.id);
                            }
                        }
                    })
                );
            } else {
                dispatch(
                    createInvoice(data, (result) => {
                        if (result) {
                            let id = result.invoice.invoice_id;
                            setState({ ...state, summary: "" });
                            setInputList([
                                ...inputList,
                                { name: "", desc: "", cost: "", qty: "", amount: "", gst: "" },
                            ]);
                            if (create === "preview") {
                                history.push("details/" + id);
                            } else if (create === "draft") {
                                history.push("edit/" + id);
                            }
                        }
                    })
                );
            }
        }
    };

    const antIcon = (
        <LoadingOutlined
            style={{
                fontSize: 24,
            }}
            spin
        />
    );

    const handleOnInvoicedateChange = (date, dateString, e) => {
        setState({ ...state, invoicedate: date });
    };

    const handleOnPaymentdateChange = (date, dateString, e) => {
        setState({ ...state, paymentdue: date });
    };

    const {
        merchant_billing_zipcode,
        merchant_billing_city,
        merchant_shipping_city,
        merchant_shipping_zipcode,
        business_shipping_zipcode,
        business_shipping_city,
        business_billing_zipcode,
        business_billing_city,
        farmer_zipcode,
        farmer_city,
        merchant_billing_add_line1,
        merchant_billing_add_line2,
    } = merchantAddress;

    const merchantBillingAddress = (
        <span className="bill_add_deatils">
            {merchant_billing_city !== "" && merchant_billing_zipcode !== ""
                ? merchant_billing_city + " - " + merchant_billing_zipcode
                : merchant_billing_city !== ""
                    ? merchant_billing_city
                        ? merchant_billing_city
                        : ""
                    : merchant_billing_zipcode
                        ? merchant_billing_zipcode
                        : ""}
        </span>
    );

    // const merchantFlat = (
    //     <span className="bill_add_deatils">
    //         {merchant_billing_add_line1 !== "" ?
    //             ? merchant_billing_add_line1 + " , " + merchant_billing_add_line2
    //             : merchant_billing_add_line1 !== ""
    //                 ? merchant_billing_add_line1
    //                 : merchant_billing_add_line2}
    //     </span>
    // );

    const farmerFlat = (
        <span className="bill_add_deatils">
            {farmer_bill_add_1 !== "" && farmer_bill_add_2 !== ""
                ? farmer_bill_add_1 + " , " + farmer_bill_add_2
                : farmer_bill_add_1 !== ""
                    ? farmer_bill_add_1
                        ? farmer_bill_add_1
                        : ""
                    : farmer_bill_add_2
                        ? farmer_bill_add_2
                        : ""}
        </span>
    );

    const businessBillingFlat = (
        <span className="bill_add_deatils">
            {business_bill_add_1 !== "" && business_bill_add_2 !== ""
                ? business_bill_add_1 + " , " + business_bill_add_2
                : business_bill_add_1 !== ""
                    ? business_bill_add_1
                        ? business_bill_add_1
                        : ""
                    : business_bill_add_2
                        ? business_bill_add_2
                        : ""}
        </span>
    );

    const businessShippingFlat = (
        <span className="bill_add_deatils">
            {business_ship_add_1 !== "" && business_ship_add_2 !== ""
                ? business_ship_add_1 + " , " + business_ship_add_2
                : business_ship_add_1 !== ""
                    ? business_ship_add_1
                        ? business_ship_add_1
                        : ""
                    : business_ship_add_2
                        ? business_ship_add_2
                        : ""}
        </span>
    );

    const merchantShippingAddress = (
        <span className="bill_add_deatils">
            {merchant_shipping_city !== "" && merchant_shipping_zipcode !== ""
                ? merchant_shipping_city + " - " + merchant_shipping_zipcode
                : merchant_shipping_city !== ""
                    ? merchant_shipping_city
                    : merchant_shipping_zipcode}
        </span>
    );

    const businessShippingAddress = (
        <span className="bill_add_deatils">
            {business_ship_city !== "" && business_ship_zipcode !== ""
                ? business_ship_city + " - " + business_ship_zipcode
                : business_ship_city !== ""
                    ? business_ship_city
                        ? business_ship_city
                        : ""
                    : business_ship_zipcode
                        ? business_ship_zipcode
                        : ""}
        </span>
    );

    const businessBillingAddress = (
        <span className="bill_add_deatils">
            {business_bill_city !== "" && business_bill_zipcode !== ""
                ? business_bill_city + " - " + business_bill_zipcode
                : business_bill_city !== ""
                    ? business_bill_city
                        ? business_bill_city
                        : ""
                    : business_bill_zipcode
                        ? business_bill_zipcode
                        : ""}
        </span>
    );

    const farmerBillingAddress = (
        <span className="bill_add_deatils">
            {farmer_bill_city !== "" && farmer_bill_zipcode !== ""
                ? farmer_bill_city + " - " + farmer_bill_zipcode
                : farmer_bill_city !== ""
                    ? farmer_bill_city
                    : farmer_bill_zipcode}
        </span>
    );

    const customerToggle = (event) => {
        // setState({ ...state, customerAddress: params.id ? true : false,
        //     role: ""
        //  })
        setCustomerAddress((s) => !s);

        if (farmer_f2m === "f2m") {
            setState({ ...state, select_farmer_dash: false });
        } else if (business_m2b === "m2b") {
            setState({ ...state, select_business_dash: false });
        }
    };

    const farmerNameChange = (id) => {
        dispatch(
            farmerDetail(id, (result) => {
                if (result) {
                    let address = result?.farmer?.address;
                    let name = result?.farmer?.name?.full;

                    setFarmerAddName(name);
                    setfarmer_bill_add_1(address?.billing?.line_1 ?? "");
                    setfarmer_bill_add_2(address?.billing?.line_2 ?? "");
                    setfarmer_bill_city(address?.billing?.city?.name ?? "");
                    setfarmer_bill_state(address?.billing?.state?.name ?? "");
                    setfarmer_bill_zipcode(address?.billing?.zipcode ?? "");
                    setfarmerAddress(address);
                }
            })
        );
    };

    const businessNameChange = (id) => {
        dispatch(
            bussinessDetails(id, (result) => {
                if (result) {
                    let address = result?.business?.address;
                    let name = result?.business?.name?.full;
                    setBusinessAddName(name);
                    setbusiness_bill_add_1(address?.billing?.line_1 ?? "");
                    setbusiness_bill_add_2(address?.billing?.line_2 ?? "");
                    setbusiness_bill_city(address?.billing?.city?.name ?? "");
                    setbusiness_bill_state(address?.billing?.state?.name ?? "");
                    setbusiness_bill_zipcode(address?.billing?.zipcode ?? "");
                    setbusiness_same_billing(address?.is_same_billing ?? "");
                    setbusiness_ship_add_1(address?.shipping?.line_1 ?? "");
                    setbusiness_ship_add_2(address?.shipping?.line_2 ?? "");
                    setbusiness_ship_city(address?.shipping?.city?.name ?? "");
                    setbusiness_ship_state(address?.shipping?.state?.name ?? "");
                    setbusiness_ship_zipcode(address?.shipping?.zipcode ?? "");
                    setbusinessAddress(address);
                }
            })
        );
    };

    const back = () => {
        history.push("/invoices");
    };


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
    const sendInvoice = () => {
        setInvoiceModal(true)
    }

    const cancelInvoiceModal = () => {
        setInvoiceModal(false)
        // setToInvoice({ ...toInvoice, to: "" })
    }
    const createInvoiceModal = () => {
        const notSendEmpty = checkSendEmptyProduct();

        const { from, to, message, subject, checkbox_1, checkbox_2 } = sendInvoices;

        var toEmailIds = toInvoice.map(function (obj) {
            return obj.to;
        });

        if (from === "" || from === null || from === undefined) {
            toastError("Please enter the From Email Address")
        } else if (notSendEmpty) {
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

            if (!notSendEmpty) {

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
    const checkSendEmptyProduct = () => {
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

    const handleSendAddClick = () => {
        const notEmpty = checkEmptyProduct();

        if (!notEmpty) {
            setToInvoice([...toInvoice, { to: "" }]);
        } else {
            toastError(errorMessage);
        }
    };
    const handleSendRemoveClick = (index) => {

        let input = toInvoice;
        input.splice(index, 1);
        setToInvoice([...input])

    };
    const handleSendInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...toInvoice];
        list[index][name] = value;
        setToInvoice(list);
    };

    let senditems = [];
    for (let i = 0; i < toInvoice.length; i++) {
        let inputItem = toInvoice[i];
        let data = {
            sno: i + 1,
            to: inputItem.to,
        };
        senditems.push(data);
    }
    const symbol = (i) => (
        <>
            <span>{senditems.length !== 1 ? (<p style={{ margin: 0 }} onClick={() => handleSendRemoveClick(i)}><MinusCircleOutlined style={{ marginTop: "5px", fontSize: "17px", color: "#808080" }} className="remove_input_btn" /></p>) : (<p style={{ margin: 0 }} ><MinusCircleOutlined style={{ marginTop: "5px", fontSize: "17px", color: "#808080" }} className="remove_input_btns" /></p>)} </span>
            <span>To</span>
        </>
    )
    const handleChangeInvoice = (e) => {
        setSendInvoices(prevSendInvoices => ({
            ...prevSendInvoices,
            [e.target.name]: e.target.value
        }))
    }
    const check_1Onchange = (event) => {
        setSendInvoices({ ...sendInvoices, checkbox_1: event.target.checked })
    }

    const check_2Onchange = (event) => {
        setSendInvoices({ ...sendInvoices, checkbox_2: event.target.checked })
    }
    const handleChangePayment = (e) => {
        let re = /^\d+$/;
        // let guidRegex = /^([0-9.])+$/
        if (e.target.value === "" || re.test(e.target.value)) {
            setState((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }));
        }
    };

    const uploadImages = async (event) => {
        setImageLoaded(true);
        const file = event.target.files[0];

        if (
            file.type === "image/png" ||
            file.type === "image/jpg" ||
            file.type === "image/jpeg"
        ) {
            if (file.size > 5e6) {
                toastError("Please upload a file smaller than 5 MB");
                setImageLoaded(false);
            } else {
                let upload = "invoice";
                let formData = new FormData();
                formData.append("uploadFile", file);

                dispatch(
                    UploadProfile(merchant, upload, formData, (result) => {
                        if (result) {
                            setTimeout(() => {
                                setImageLoaded(false);

                                setMerchantImage(
                                    "https://ippo-agritech.s3.amazonaws.com/" + result.data.url
                                );
                            }, 3000);
                        }
                    })
                );
            }
        } else {
            toastError("File does not support.You must use .png ,.jpg and .jpeg");
            setImageLoaded(false);
        }
    };

    const removeImage = () => {
        setMerchantImage("");
    };

    const listOnclick = (value) => {
        const list = [...inputList];
        list[inputIndex] = {
            ...list[inputIndex],
            name: value.name,
            cost: value.cost,
            desc: value.description,
            gst: value.gst,
        };
        setInputList(list);
        setItemSelect(false);
        setIsOpenItemList(false)
        setInputIndex("");
        // handleInputChange(inputEvent, inputIndex)
        // handleInputsearch(inputEvent, inputIndex)
        getsubTotal();
    };

    const handleListClick = () => {
        const notEmpty = checkEmptyName();

        if (!notEmpty) {
            setInputList([...inputList, { name: "" }]);
        } else {
            showError(errorMessage);
        }
    };

    const checkEmptyName = () => {
        let result;
        let input = inputList;
        for (let i = 0; i < input.length; i++) {
            let inputItem = input[i];
            if (inputItem.name === "") {
                result = true;
            }

            return result;
        }
    };

    const list = [...inputList];
    const searchTerm = list[inputIndex];

    const merchantProfile = (
        <span className="remove_icon" onClick={removeImage}>
            <i
                aria-label="icon: delete"
                className="anticon anticon-delete align-icon"
            >
                <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    className
                    data-icon="delete"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z" />
                </svg>
            </i>
            Remove
        </span>
    );

    const openItemList = () => {
        setIsOpenItemList(true);
        setInputList(list);

    };
    //   const selectCustomer=()=> {
    //     this.setState({ selectCustomer: true }, function() {
    //       this.getCustomerList();
    //     });
    //   }
    //   const closeListToggle=() => {
    //     if (this.state.isOpenItemList) {
    //       this.setState({
    //         isOpenItemList: false
    //       });
    //     } else if (this.state.isOpenTabItemList) {
    //       this.setState({
    //         isOpenTabItemList: false
    //       });
    //     } else if (this.state.selectCustomer) {
    //       this.setState({
    //         selectCustomer: false
    //       });
    //     }
    //   }
    const [searchFilter, setSearchFilter] = useState("")

    const ItemListdata = itemList.filter((val) => {
        if (searchFilter === "") {
            return val;
        }
        else if (
            val.name.toLowerCase().includes(searchFilter.toLowerCase())
        ) {
            return val
        }
    })
    // const ItemListdata = itemList.filter((val)=>{
    //     if(searchFilter === ""){
    //                 return val;
    //             }
    //             else if(
    //                 val.name.toLowerCase().includes(searchFilter.toLowerCase())
    //             ){
    //                 return val
    //             }
    //     const list = [
    //         ...inputList,
    //     ];
    //     const searchTerm =
    //         list[
    //             inputIndex
    //         ].name.toLowerCase();
    //     const item_name =
    //         val.name.toLowerCase();

    //     return (
    //         searchTerm &&
    //         item_name.startsWith(
    //             searchTerm
    //         ) &&
    //         item_name !== searchTerm
    //     );
    // })
    return (
        <>
            <Toaster />

            <>
                <div className="main-content app-content mt-0">
                    <div className="side-app">
                        <div className="container-fluid main-container p-0 ">
                            <>
                                <div className="container_top">
                                    <div className="container_header">
                                        <h4 className="container_head">
                                            {state.id ? "Update Invoice" : "Create Invoice"}
                                        </h4>
                                        <button
                                            className="create_btn"
                                            type="primary"
                                            onClick={() => back()}
                                        >
                                            Back
                                        </button>
                                    </div>
                                </div>
                                <div className="invoice_card_2 agro_card">
                                    <div
                                        className="container_top"
                                        style={{ width: "68%", margin: "0" }}
                                    >
                                        <div
                                            className="card invoice_card"
                                            style={{ marginTop: "0px", padding: "20px 0 30px 0" }}
                                        >
                                            <>
                                                <div
                                                    className="col-xs-12 ant-row"
                                                    style={{
                                                        width: "100%",
                                                        padding: "0px 0px 10px 0px",
                                                    }}
                                                >
                                                    <div
                                                        className="col-xs-12  brd_bottom"
                                                        style={{ padding: "0px 0px 20px 0" }}
                                                    >
                                                        <div className="col-xs-7 ">
                                                            <div className=" add_input m-b-15 ">
                                                                <Input
                                                                    placeholder="Invoice"
                                                                    name="heading"
                                                                    onChange={handleChange}
                                                                    value={state.heading}
                                                                    className="bld_place"
                                                                    autoComplete="off"
                                                                />
                                                            </div>

                                                            <div className="add_input ">
                                                                <Input
                                                                    value={state.summary}
                                                                    placeholder="summary"
                                                                    name="summary"
                                                                    onChange={handleChange}
                                                                    className="dec_align"
                                                                    autoComplete="off"
                                                                />
                                                            </div>

                                                            <div>
                                                                <div className="bill_left">
                                                                    <span className="bill_add_deatils addr_title">
                                                                        {/* {merchantAddress.is_same_merchant_billing ? "Bill to " : "Address"} */}
                                                                        {farmerCheck ? "Bill to " : "Address"}
                                                                    </span>

                                                                    <span className="bill_add_name">
                                                                        {merchantAddress?.merchant_name ?? ""}
                                                                    </span>

                                                                    {merchantAddress?.merchant_billing_add_line1 ??
                                                                        ""}
                                                                    {merchantBillingAddress &&
                                                                        merchantBillingAddress}
                                                                    <span className="bill_add_deatils">
                                                                        {merchantAddress?.merchant_billing_state ??
                                                                            ""}
                                                                    </span>
                                                                    {merchantAddress.is_same_merchant_billing ===
                                                                        false && (
                                                                            <>
                                                                                <span
                                                                                    className="bill_add_deatils"
                                                                                    style={{
                                                                                        fontWeight: "bold",
                                                                                        marginTop: 15,
                                                                                    }}
                                                                                >
                                                                                    Shipping
                                                                                </span>

                                                                                {merchantAddress?.merchant_shipping_add_line1 ??
                                                                                    ""}
                                                                                {merchantShippingAddress &&
                                                                                    merchantShippingAddress}
                                                                                <span className="bill_add_deatils">
                                                                                    {merchantAddress?.merchant_shipping_state ??
                                                                                        ""}
                                                                                </span>
                                                                            </>
                                                                        )}

                                                                    {checked &&
                                                                        merchantAddress?.gst_number !== "" && (
                                                                            <span className="bill_add_deatils">
                                                                                GST -{" "}
                                                                                {merchantAddress?.gst_number ?? ""}
                                                                            </span>
                                                                        )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-xs-5">
                                                            {imageLoaded ? (
                                                                <div className="logo_upload">
                                                                    <div className="loaders"></div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    {/* {merchantImage !== "" || merchantImage !== undefined || merchantImage !== null ? (
                                                                        <div className="logo_upload_merchant">

                                                                            <img className='pop-body-vi' src={merchantImage} alt="upload img" />

                                                                            <span>{merchantProfile}</span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="logo_upload" onChange={uploadImages}>


                                                                            <img className='' style={{ display: "block", margin: "0 auto" }} src={uploadImage} alt="  " />

                                                                            <div className><div className="upload_text"> <span className="clr_txt_up">Browse</span> or drop your logo here.</div><div className="recom_cons">Maximum 5MB in size</div><div className="recom_cons">JPG,PNG or GIF format</div><div className="recom_cons">Recommended is 300 to 200 pixels</div></div>
                                                                            <input accept="image/*" className="pop-body-vi-0" type="file" />
                                                                            <span>{merchantProfile}</span>
                                                                        </div>
                                                                    )} */}

                                                                    {merchantImage !== "" &&
                                                                        merchantImage !== undefined &&
                                                                        merchantImage !== null && (
                                                                            <div className="logo_upload_merchant">
                                                                                <img
                                                                                    className="pop-body-vi"
                                                                                    src={merchantImage}
                                                                                    alt="upload img"
                                                                                    accept="image/*"
                                                                                />

                                                                                <span>{merchantProfile}</span>
                                                                            </div>
                                                                        )}

                                                                    {(merchantImage === "" ||
                                                                        merchantImage === undefined ||
                                                                        merchantImage === null) && (
                                                                            <div
                                                                                className="logo_upload"
                                                                                onChange={uploadImages}
                                                                            >
                                                                                <img
                                                                                    className=""
                                                                                    style={{
                                                                                        display: "block",
                                                                                        margin: "0 auto",
                                                                                    }}
                                                                                    src={uploadImage}
                                                                                    alt="upload img"
                                                                                />

                                                                                <div className>
                                                                                    <div className="upload_text">
                                                                                        {" "}
                                                                                        <span className="clr_txt_up">
                                                                                            Browse
                                                                                        </span>{" "}
                                                                                        or drop your logo here.
                                                                                    </div>
                                                                                    <div className="recom_cons">
                                                                                        Maximum 5MB in size
                                                                                    </div>
                                                                                    <div className="recom_cons">
                                                                                        JPG,PNG or GIF format
                                                                                    </div>
                                                                                    <div className="recom_cons">
                                                                                        Recommended is 300 to 200 pixels
                                                                                    </div>
                                                                                </div>
                                                                                <input
                                                                                    accept="image/*"
                                                                                    className="pop-body-vi-0"
                                                                                    type="file"
                                                                                />
                                                                                {/* <span>{merchantProfile}</span> */}
                                                                            </div>
                                                                        )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="col-xs-12 p-0 m-t-20 ">
                                                        <div className="col-xs-6 ">
                                                            <div className="add_input m-0">
                                                                <div className="add_input ">
                                                                    <p className="inv_type">Invoice Type</p>

                                                                    <input
                                                                        type="radio"
                                                                        name="farmer_f2m"
                                                                        value={farmer_f2m}
                                                                        id="Farmer"
                                                                        checked={farmerCheck}
                                                                        onChange={() => handleRadioChange("f2m")}
                                                                    />
                                                                    <label
                                                                        className="label_margin ivc_type_name"
                                                                        for="Farmer"
                                                                    >
                                                                        Farmer
                                                                    </label>
                                                                    <input
                                                                        type="radio"
                                                                        name="business_m2b"
                                                                        value={business_m2b}
                                                                        id="Business"
                                                                        checked={businessCheck}
                                                                        onChange={() =>
                                                                            handleBUsinessRadioChange("m2b")
                                                                        }
                                                                    />
                                                                    <label
                                                                        className="label_margin ivc_type_name"
                                                                        for="Business"
                                                                    >
                                                                        Business
                                                                    </label>
                                                                </div>

                                                                {customerAddress ? (
                                                                    // {state.customerAddress && (
                                                                    <div
                                                                        className="col-xs-6"
                                                                        style={{ width: "107%", display: "flex" }}
                                                                    >
                                                                        <div className="customer-border">
                                                                            <div
                                                                                className="customer_address"
                                                                                style={{ marginTop: 15 }}
                                                                            >
                                                                                {farmer_f2m === "f2m" &&
                                                                                    farmerAddress ? (
                                                                                    <div className="customer_address">
                                                                                        {farmerAddName !== "" && (
                                                                                            <>
                                                                                                <span className="bill_add_deatils addr_title">
                                                                                                    Address
                                                                                                </span>
                                                                                            </>
                                                                                        )}
                                                                                        <span className="bill_add_name">
                                                                                            {farmerAddName}
                                                                                        </span>
                                                                                        <span className="bill_add_deatils">
                                                                                            {farmerFlat}
                                                                                        </span>

                                                                                        <span className="bill_add_deatils">
                                                                                            {farmerBillingAddress}
                                                                                        </span>
                                                                                        <span className="bill_add_deatils">
                                                                                            {farmer_bill_state}
                                                                                        </span>
                                                                                    </div>
                                                                                ) : (
                                                                                    ""
                                                                                )}
                                                                            </div>

                                                                            <div
                                                                                className="customer_address"
                                                                                style={{ marginTop: 15 }}
                                                                            >
                                                                                {business_m2b === "m2b" &&
                                                                                    businessAddress ? (
                                                                                    <>
                                                                                        {businessAddName !== "" && (
                                                                                            <>
                                                                                                <span className="bill_add_deatils addr_title">
                                                                                                    Bill to
                                                                                                </span>
                                                                                            </>
                                                                                        )}
                                                                                        <span className="bill_add_name">
                                                                                            {businessAddName}
                                                                                        </span>

                                                                                        {businessBillingFlat &&
                                                                                            businessBillingFlat}

                                                                                        {businessBillingAddress &&
                                                                                            businessBillingAddress}
                                                                                        <span className="bill_add_deatils">
                                                                                            {business_bill_state}
                                                                                        </span>
                                                                                    </>
                                                                                ) : (
                                                                                    ""
                                                                                )}
                                                                            </div>
                                                                            <div
                                                                                className="customer_address"
                                                                                style={{ marginTop: 15 }}
                                                                            >
                                                                                {business_m2b === "m2b" &&
                                                                                    businessAddress &&
                                                                                    !business_same_billing ? (
                                                                                    <>
                                                                                        <span
                                                                                            className="bill_add_deatils"
                                                                                            style={{ fontWeight: "bold" }}
                                                                                        >
                                                                                            Shipping To
                                                                                        </span>

                                                                                        {businessShippingFlat &&
                                                                                            businessShippingFlat}

                                                                                        {businessShippingAddress &&
                                                                                            businessShippingAddress}
                                                                                        <span className="bill_add_deatils">
                                                                                            {business_ship_state}
                                                                                        </span>
                                                                                    </>
                                                                                ) : (
                                                                                    ""
                                                                                )}
                                                                            </div>

                                                                            <div>
                                                                                <p
                                                                                    onClick={customerToggle}
                                                                                    className="differ_cus"
                                                                                >
                                                                                    Choose a different customer
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        {farmer_f2m === "f2m" &&
                                                                            state.select_farmer_dash ? (
                                                                            <div
                                                                                className="img_upload_sec_customer"
                                                                                onClick={() =>
                                                                                    setState({
                                                                                        ...state,
                                                                                        select_farmer_dash: false,
                                                                                    })
                                                                                }
                                                                            >
                                                                                <span className="customer_dash">
                                                                                    SELECT A FARMER
                                                                                </span>
                                                                            </div>
                                                                        ) : (
                                                                            farmer_f2m === "f2m" && (
                                                                                <div className="add-input">
                                                                                    <Select
                                                                                        placeholder="Type"
                                                                                        optionFilterProp="children"
                                                                                        showSearch
                                                                                        style={{ width: "100%" }}
                                                                                        value={
                                                                                            defaultRole
                                                                                                ? defaultRole.name
                                                                                                : "SELECT A FARMER"
                                                                                        }
                                                                                        autoFocus={true}
                                                                                        defaultOpen
                                                                                        filterOption={(input, option) =>
                                                                                            option.children
                                                                                                .toLowerCase()
                                                                                                .includes(input.toLowerCase())
                                                                                        }
                                                                                        onChange={(value) => {
                                                                                            setState({
                                                                                                ...state,
                                                                                                role: value,
                                                                                                customerAddress: true,
                                                                                            });
                                                                                            setRole(value);
                                                                                            setCustomerAddress(true);

                                                                                            farmerNameChange(
                                                                                                JSON.parse(value).id
                                                                                            );
                                                                                        }}
                                                                                    >
                                                                                        {farmersList &&
                                                                                            farmersList.map((item) => {
                                                                                                return (
                                                                                                    <Option
                                                                                                        key={item.farmer_id}
                                                                                                        value={JSON.stringify({
                                                                                                            name: item.name.full,
                                                                                                            id: item.farmer_id,
                                                                                                        })}
                                                                                                    >
                                                                                                        {item.name.full}
                                                                                                    </Option>
                                                                                                );
                                                                                            })}
                                                                                    </Select>
                                                                                </div>
                                                                            )
                                                                        )}

                                                                        {business_m2b === "m2b" &&
                                                                            state.select_business_dash ? (
                                                                            <div
                                                                                className="img_upload_sec_customer"
                                                                                onClick={() =>
                                                                                    setState({
                                                                                        ...state,
                                                                                        select_business_dash: false,
                                                                                    })
                                                                                }
                                                                            >
                                                                                <span className="customer_dash">
                                                                                    SELECT A BUSINESS
                                                                                </span>
                                                                            </div>
                                                                        ) : (
                                                                            business_m2b === "m2b" && (
                                                                                <div className="add-input m-0">
                                                                                    <Select
                                                                                        placeholder="Type"
                                                                                        // className="select_box"
                                                                                        style={{
                                                                                            width: "100%",
                                                                                        }}
                                                                                        optionFilterProp="children"
                                                                                        showSearch
                                                                                        defaultOpen
                                                                                        autoFocus={true}
                                                                                        filterOption={(input, option) =>
                                                                                            option.children
                                                                                                .toLowerCase()
                                                                                                .includes(input.toLowerCase())
                                                                                        }
                                                                                        name="customer"
                                                                                        value={
                                                                                            defaultRole
                                                                                                ? defaultRole.name
                                                                                                : "SELECT A BUSINESS"
                                                                                        }
                                                                                        onChange={(value) => {
                                                                                            setState({
                                                                                                ...state,
                                                                                                role: value,
                                                                                                customerAddress: true,
                                                                                            });
                                                                                            setRole(value);
                                                                                            setCustomerAddress(true);
                                                                                            businessNameChange(
                                                                                                JSON.parse(value).id
                                                                                            );
                                                                                        }}
                                                                                    >
                                                                                        {businessess &&
                                                                                            businessess.map((item) => (
                                                                                                <Option
                                                                                                    key={item.business_id}
                                                                                                    value={JSON.stringify({
                                                                                                        name: item.name.full,
                                                                                                        id: item.business_id,
                                                                                                    })}
                                                                                                >
                                                                                                    {item.name.full}
                                                                                                </Option>
                                                                                            ))}
                                                                                    </Select>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="col-xs-6">
                                                            <table
                                                                className="bill-table invoice_info_table"
                                                                style={{ float: "right" }}
                                                            >
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="table-align">
                                                                            INVOICE DATE :
                                                                        </td>

                                                                        <td style={{ paddingRight: "0" }}>
                                                                            <DatePicker
                                                                                selected={state.invoicedate}
                                                                                dateFormat="MM-dd-yyyy"
                                                                                placeholder="Invoicedate"
                                                                                name="invoicedate"
                                                                                id="invoicedate"
                                                                                value={state.invoicedate}
                                                                                style={{
                                                                                    fontWeight: "500",
                                                                                    padding: "6px 11px",
                                                                                    marginLeft: 0,
                                                                                    width: 180,
                                                                                }}
                                                                                showYearDropdown
                                                                                showMonthDropdown
                                                                                ariaDescribedBy="basic-addon2"
                                                                                onChange={handleOnInvoicedateChange}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="table-align">
                                                                            PAYMENT DUE :
                                                                        </td>
                                                                        <td style={{ paddingRight: "0" }}>
                                                                            <DatePicker
                                                                                selected={state.paymentdue}
                                                                                dateFormat="MM-dd-yyyy"
                                                                                placeholder="Paymentdue"
                                                                                name="paymentdue"
                                                                                id="paymentdue"
                                                                                value={state.paymentdue}
                                                                                style={{
                                                                                    fontWeight: "500",
                                                                                    padding: "6px 11px",
                                                                                    marginLeft: 0,
                                                                                    width: 180,
                                                                                }}
                                                                                showYearDropdown
                                                                                showMonthDropdown
                                                                                ariaDescribedBy="basic-addon2"
                                                                                onChange={handleOnPaymentdateChange}
                                                                                className=""
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="add_item m-0">
                                                    <div style={{ width: "100%" }}>
                                                        <table className="ref_table">
                                                            <thead>
                                                                <tr className="table_head">
                                                                    <th></th>
                                                                    <th>
                                                                        <span>Item</span>
                                                                    </th>
                                                                    <th>
                                                                        <span>Description</span>
                                                                    </th>
                                                                    <th>
                                                                        <span>Rate/item</span>
                                                                    </th>
                                                                    <th>
                                                                        <span>Quantity</span>
                                                                    </th>
                                                                    <th>
                                                                        <span>Gst</span>
                                                                    </th>
                                                                    <th className="text-right">
                                                                        <span
                                                                            style={{
                                                                                justifyContent: "end",
                                                                                paddingRight: "15px",
                                                                            }}
                                                                        >
                                                                            Amount
                                                                        </span>
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {item && item.length !== 0
                                                                    ? item &&
                                                                    item.map((items, i) => (
                                                                        <tr key={i} className="invoicechild_tr">
                                                                            <td>
                                                                                <span>
                                                                                    {inputList.length - 1 !== i ? (
                                                                                        <p
                                                                                            style={{
                                                                                                margin: 0,
                                                                                                cursor: "pointer",
                                                                                            }}
                                                                                            onClick={() =>
                                                                                                handleRemoveClick(i)
                                                                                            }
                                                                                        >
                                                                                            <span className="add-field">
                                                                                                <DeleteOutlined />
                                                                                            </span>
                                                                                        </p>
                                                                                    ) : (
                                                                                        <p
                                                                                            style={{
                                                                                                margin: 0,
                                                                                                cursor: "pointer",
                                                                                            }}
                                                                                        >
                                                                                            <span
                                                                                                className="add-field"
                                                                                                onClick={handleAddClick}
                                                                                            >
                                                                                                <PlusCircleOutlined />
                                                                                            </span>
                                                                                        </p>
                                                                                    )}
                                                                                </span>
                                                                            </td>

                                                                            <td
                                                                                style={{
                                                                                    position: "relative",
                                                                                }}
                                                                            >
                                                                                <span>
                                                                                    <Input
                                                                                        name="name"
                                                                                        value={items.name}
                                                                                        style={{
                                                                                            height: "35px",
                                                                                            borderRadius: "5px",
                                                                                        }}
                                                                                        placeholder="Item Name"
                                                                                        autoComplete="off"
                                                                                        onChange={(e) =>
                                                                                            handleInputChange(e, i)
                                                                                        }
                                                                                    />
                                                                                    {inputIndex === i && (
                                                                                        <div
                                                                                            className="item-list-box2"
                                                                                            style={{
                                                                                                top: "85%",
                                                                                                left: "10px",
                                                                                                width: "217px",
                                                                                            }}
                                                                                        >
                                                                                            {ItemListdata &&
                                                                                                ItemListdata
                                                                                                    .filter((val) => {
                                                                                                        const list = [
                                                                                                            ...inputList,
                                                                                                        ];
                                                                                                        const searchTerm =
                                                                                                            list[
                                                                                                                inputIndex
                                                                                                            ].name.toLowerCase();
                                                                                                        const item_name =
                                                                                                            val.name.toLowerCase();

                                                                                                        return (
                                                                                                            searchTerm &&
                                                                                                            item_name.startsWith(
                                                                                                                searchTerm
                                                                                                            ) &&
                                                                                                            item_name !== searchTerm
                                                                                                        );
                                                                                                    })
                                                                                                    .map((item, j) => {
                                                                                                        return (
                                                                                                            <ul className="drop_list">
                                                                                                                <li
                                                                                                                    key={j}
                                                                                                                    onClick={() =>
                                                                                                                        listOnclick(item)
                                                                                                                    }
                                                                                                                >
                                                                                                                    <div className="itemListLeft">
                                                                                                                        {item.name}
                                                                                                                    </div>
                                                                                                                    <div className="itemListRight">
                                                                                                                        &#x20B9;
                                                                                                                        {toFixed(
                                                                                                                            item.cost
                                                                                                                        )}
                                                                                                                    </div>
                                                                                                                </li>
                                                                                                            </ul>
                                                                                                        );
                                                                                                    })}
                                                                                        </div>
                                                                                    )}
                                                                                </span>
                                                                            </td>
                                                                            <td>
                                                                                <span>
                                                                                    <Input
                                                                                        name="desc"
                                                                                        value={items.desc}
                                                                                        placeholder=" Item Description"
                                                                                        style={{
                                                                                            height: "35px",
                                                                                            borderRadius: "5px",
                                                                                        }}
                                                                                        autoComplete="off"
                                                                                        onChange={(e) =>
                                                                                            handleInputDesChange(e, i)
                                                                                        }
                                                                                    />
                                                                                </span>
                                                                            </td>
                                                                            <td>
                                                                                <span>
                                                                                    <Input
                                                                                        name="cost"
                                                                                        style={{
                                                                                            width: "90%",
                                                                                            textAlign: "right",
                                                                                            height: "35px",
                                                                                            borderRadius: "5px",
                                                                                            backgroundColor: "transparent",
                                                                                        }}
                                                                                        value={items.cost}
                                                                                        placeholder="0"
                                                                                        autoComplete="off"
                                                                                        onChange={(e) =>
                                                                                            handlecostChange(e, i)
                                                                                        }
                                                                                    />
                                                                                </span>
                                                                            </td>

                                                                            <td>
                                                                                <span>
                                                                                    <Input
                                                                                        name="qty"
                                                                                        style={{
                                                                                            width: "70px",
                                                                                            textAlign: "right",
                                                                                            height: "35px",
                                                                                            borderRadius: "5px",
                                                                                        }}
                                                                                        value={items.qty}
                                                                                        placeholder="0"
                                                                                        autoComplete="off"
                                                                                        ref={inputRef}
                                                                                        onChange={(e) =>
                                                                                            handlePriceChange(e, i)
                                                                                        }
                                                                                    />
                                                                                </span>
                                                                            </td>
                                                                            <td>
                                                                                <span className="discount_con">
                                                                                    <div className="modal_amount gst_input">
                                                                                        <Input.Group
                                                                                            compact
                                                                                            style={{
                                                                                                display: "flex",
                                                                                                width: "80px",
                                                                                                height: "35px",
                                                                                                textAlign: "right",
                                                                                                justifyContent: "end",
                                                                                            }}
                                                                                            className="discount_prc"
                                                                                        >
                                                                                            <Input
                                                                                                style={{ width: 40 }}
                                                                                                name="gst"
                                                                                                value={items.gst}
                                                                                                // onChange={handlegstChange}
                                                                                                onChange={(e) =>
                                                                                                    handlegstChange(e, i)
                                                                                                }
                                                                                                // maxLength={2}
                                                                                                autoComplete="off"
                                                                                            />

                                                                                            <span
                                                                                                style={{
                                                                                                    width: "25px",
                                                                                                    display: "flex",
                                                                                                    justifyContent: "center",
                                                                                                    alignItems: "center",
                                                                                                    background: "#eee",
                                                                                                }}
                                                                                                className="discount"
                                                                                            >
                                                                                                %
                                                                                            </span>
                                                                                        </Input.Group>
                                                                                    </div>
                                                                                </span>
                                                                            </td>
                                                                            <td>
                                                                                <span
                                                                                    className="price_col"
                                                                                    style={{ paddingRight: "15px" }}
                                                                                >
                                                                                    &#x20B9;{" "}
                                                                                    {toFixed(
                                                                                        items.cost * items.qty +
                                                                                        (items.cost *
                                                                                            items.qty *
                                                                                            items.gst) /
                                                                                        100
                                                                                    )}
                                                                                </span>
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                    : null}

                                                                <tr>
                                                                    <td colSpan={7}>
                                                                        <span>
                                                                            <div className="col-xs-12 text-center">
                                                                                <div
                                                                                    className="inv"
                                                                                    onClick={openItemList}
                                                                                >
                                                                                    {" "}
                                                                                    <PlusCircleFilled className="invoice_add_item" />{" "}
                                                                                    <span className="add_invoice_btn">
                                                                                        ADD AN ITEM
                                                                                    </span>{" "}
                                                                                </div>

                                                                                <>
                                                                                    {isOpenItemList === true ? (
                                                                                        <div className="pop_selector">
                                                                                            <div className="search_box">
                                                                                                <span className="search_btn">
                                                                                                    <i className="fa fa-search" />
                                                                                                </span>
                                                                                                <input
                                                                                                    type="text"
                                                                                                    className="search_form"
                                                                                                    placeholder="Type an item name"
                                                                                                    name="name"
                                                                                                    // value={items.name}
                                                                                                    // onChange={(e) =>
                                                                                                    // handleInputsearch(e)
                                                                                                    // }
                                                                                                    // onChange={(e) =>
                                                                                                    //     handleInputChange(e)
                                                                                                    // }
                                                                                                    onChange={(e) => setSearchFilter(e.target.value)}
                                                                                                />

                                                                                            </div>

                                                                                            {/* {inputIndex && ( */}
                                                                                            <div                                                                                                    >

                                                                                                <ul
                                                                                                    className="pop_drop_list"
                                                                                                    style={{
                                                                                                        listStyleType: "none",
                                                                                                    }}
                                                                                                >
                                                                                                    {
                                                                                                        ItemListdata && ItemListdata.length > 0 ?
                                                                                                            ItemListdata &&
                                                                                                            ItemListdata.map((item, index) => {
                                                                                                                return (

                                                                                                                    <li key={index}
                                                                                                                        onClick={() =>
                                                                                                                            listOnclick(item)
                                                                                                                        }>
                                                                                                                        <div className="itemListLeft">
                                                                                                                            <span className="bld_con text-left">{item.name}</span>
                                                                                                                            <span className="lig_con_text text-left" />
                                                                                                                        </div>
                                                                                                                        <div className="itemListRight">
                                                                                                                            <span className="bld_con text-left">
                                                                                                                                &#x20B9;
                                                                                                                                {toFixed(
                                                                                                                                    item.cost
                                                                                                                                )}
                                                                                                                            </span>
                                                                                                                        </div>
                                                                                                                    </li>
                                                                                                                );
                                                                                                            }) : <li>
                                                                                                                <span className="bld_con">
                                                                                                                    No item found
                                                                                                                </span>
                                                                                                            </li>}
                                                                                                </ul>
                                                                                            </div>
                                                                                            {/* )} */}

                                                                                            <a
                                                                                                className="create_new"
                                                                                                onClick={() =>
                                                                                                    setModal2Visible(true)
                                                                                                }
                                                                                            >
                                                                                                <i className="fa fa-plus-circle" />{" "}
                                                                                                Create a new item
                                                                                            </a>
                                                                                        </div>
                                                                                    ) : null}
                                                                                </>



                                                                            </div>
                                                                        </span>
                                                                    </td>
                                                                </tr>

                                                                <tr className="invoicechild_tr">
                                                                    <td
                                                                        colSpan={6}
                                                                        style={{ textAlign: "right" }}
                                                                    >
                                                                        <span className="subtotal_label">
                                                                            Subtotal
                                                                        </span>
                                                                    </td>
                                                                    <td className="table-float">
                                                                        {" "}
                                                                        <span
                                                                            className="price_col"
                                                                            style={{ paddingRight: "15px" }}
                                                                        >
                                                                            &#x20B9; {toFixed(subTotal)}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                                <tr className="invoicechild_tr">
                                                                    <td
                                                                        colSpan={6}
                                                                        style={{ textAlign: "right" }}
                                                                    >
                                                                        <span className="discount_con">
                                                                            <label className="discount_label">
                                                                                Discount
                                                                            </label>
                                                                            <div className="modal_amount">
                                                                                <Input.Group
                                                                                    compact
                                                                                    style={{
                                                                                        display: "flex",
                                                                                    }}
                                                                                    className="discount_prc"
                                                                                >
                                                                                    <Input
                                                                                        style={{ width: 50 }}
                                                                                        name="discountPrice"
                                                                                        value={discountPrice}
                                                                                        onChange={discountChange}
                                                                                        maxLength={
                                                                                            discount === "percentage" ? 2 : ""
                                                                                        }
                                                                                        autoComplete="off"
                                                                                    />

                                                                                    <select
                                                                                        name="discount"
                                                                                        className="discount"
                                                                                        value={discount}
                                                                                        onChange={handleDiscountChange}
                                                                                    >
                                                                                        <option value="percentage">
                                                                                            %
                                                                                        </option>
                                                                                        <option value="rs">&#x20B9;</option>
                                                                                    </select>
                                                                                </Input.Group>
                                                                            </div>
                                                                        </span>
                                                                    </td>
                                                                    <td className="table-float">
                                                                        <span
                                                                            className="price_col"
                                                                            style={{ paddingRight: "15px" }}
                                                                        >
                                                                            {discountPrice > 0 ? " -" : ""}{" "}
                                                                            &#x20B9; {toFixed(rate)}

                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                                {business_m2b === "m2b" || params.id
                                                                    ? taxLists &&
                                                                    taxLists.map((item, k) => (
                                                                        <React.Fragment key={k}>
                                                                            {item.is_enabled && (
                                                                                <tr className="invoicechild_tr">
                                                                                    <td
                                                                                        colSpan={6}
                                                                                        style={{ textAlign: "right" }}
                                                                                    >
                                                                                        <span>
                                                                                            <label>
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    name="is_checked"
                                                                                                    checked={item.is_checked}
                                                                                                    id={item.tax_id}
                                                                                                    style={{ marginRight: 10 }}
                                                                                                    onChange={() =>
                                                                                                        handleCheckboxes(
                                                                                                            item.tax_id
                                                                                                        )
                                                                                                    }
                                                                                                />
                                                                                                {item.name}{" "}
                                                                                                {"(" + item.percentage + "%)"}
                                                                                            </label>
                                                                                        </span>
                                                                                    </td>
                                                                                    <td className="table-float">
                                                                                        <span
                                                                                            className="price_col"
                                                                                            style={{ paddingRight: "15px" }}
                                                                                        >
                                                                                            &#x20B9;{" "}
                                                                                            {toFixed(
                                                                                                item.value ? item.value : 0
                                                                                            )}
                                                                                        </span>
                                                                                    </td>
                                                                                </tr>
                                                                            )}
                                                                        </React.Fragment>
                                                                    ))
                                                                    : ""}

                                                                <tr className="invoicechild_tr">
                                                                    <td
                                                                        colSpan={6}
                                                                        style={{ textAlign: "right" }}
                                                                    >
                                                                        <span className="discount_con">
                                                                            <label className="discount_label">
                                                                                Adjustment
                                                                            </label>
                                                                            <div className="modal_amount">
                                                                                <Input.Group
                                                                                    compact
                                                                                    style={{
                                                                                        display: "flex",
                                                                                    }}
                                                                                    className="discount_prc"
                                                                                >
                                                                                    <Input
                                                                                        style={{ width: 50 }}
                                                                                        name="adjustmentPrice"
                                                                                        value={adjustmentPrice}
                                                                                        onChange={handleadjustmentChange}
                                                                                        autoComplete="off"
                                                                                    />
                                                                                    <span
                                                                                        style={{
                                                                                            width: "34px",
                                                                                            display: "flex",
                                                                                            justifyContent: "center",
                                                                                            alignItems: "center",
                                                                                            background: "#eee",
                                                                                        }}
                                                                                        className="discount"
                                                                                    >
                                                                                        &#x20B9;
                                                                                    </span>
                                                                                </Input.Group>
                                                                            </div>
                                                                        </span>
                                                                    </td>
                                                                    <td className="table-float">
                                                                        <span
                                                                            className="price_col"
                                                                            style={{ paddingRight: "15px" }}
                                                                        >

                                                                            {toFixed(adjustmentrate)}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                                <tr className="invoicechild_tr">
                                                                    <td
                                                                        colSpan={6}
                                                                        style={{ textAlign: "right" }}
                                                                    >
                                                                        <span className="totalamt_label">
                                                                            Total Amount
                                                                        </span>
                                                                    </td>
                                                                    <td className="table-float">
                                                                        <span
                                                                            className="price_col "
                                                                            style={{ paddingRight: "15px" }}
                                                                        >
                                                                            &#x20B9; {toFixed(totalAmount)}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>

                                                <div className="add_column">
                                                    <hr />
                                                    <div className="terms_head">
                                                        <span className="terms_title">
                                                            TERMS AND CONDITIONS
                                                        </span>
                                                        <TextArea
                                                            value={state.terms_condition}
                                                            placeholder="Add Terms And Conditions"
                                                            name="terms_condition"
                                                            onChange={handleChange}
                                                            className="terms_condition"
                                                            autoComplete="off"
                                                            col={8}
                                                        />
                                                        <p className="future_check">
                                                            <input
                                                                type="checkbox"
                                                                name="futures_condition"
                                                                checked={checkFuture}
                                                                onChange={onChangeFuture}
                                                            />
                                                            <span>For Future Use</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        </div>
                                    </div>
                                    <div className="invoice_right" style={{ width: "32%" }}>
                                        <div className="rightsec_fix">
                                            {businessArray?.invoice_type === "f2m" ||
                                                farmer_f2m === "f2m" ? (
                                                ""
                                            ) : (
                                                <div>
                                                    {businessCheck && (
                                                        <Card
                                                            className="invoice_card"
                                                            style={{ margin: 0 }}
                                                        >
                                                            <div className="invoice_card_1">
                                                                <div>
                                                                    <h4
                                                                        className="tab_head"
                                                                        style={{ margin: 0 }}
                                                                    >
                                                                        Create GST Enabled Invoices
                                                                    </h4>
                                                                </div>
                                                                <div>
                                                                    <input
                                                                        type="checkbox"
                                                                        name="rememberCheckbox"
                                                                        checked={checked}
                                                                        onChange={onChange}
                                                                        style={{ marginLeft: 5 }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    )}

                                                    <Card
                                                        className="invoice_card "
                                                        style={{ marginTop: businessCheck ? "3px" : "0px" }}
                                                    >
                                                        <div className="invoice_card_1">
                                                            <div>
                                                                <h4
                                                                    className="tab_head"
                                                                    style={{ marginBottom: "15px" }}
                                                                >
                                                                    Enable Partial Payments
                                                                </h4>

                                                                <div
                                                                    className={
                                                                        checkedPartial
                                                                            ? "checkPartial"
                                                                            : "HidecheckPartial"
                                                                    }
                                                                >
                                                                    <h5 className="tab_des">
                                                                        Allow accepting payments in parts
                                                                    </h5>
                                                                    <Select
                                                                        style={{ width: "210px" }}
                                                                        name="payment_select"
                                                                        value={state.payment_select || undefined}
                                                                        onChange={payment_drop}
                                                                        disabled={checkedPartial ? false : true}
                                                                        placeholder="Selected By"
                                                                    >
                                                                        <Option value="2">2 Times</Option>
                                                                        <Option value="3">3 Times</Option>
                                                                        <Option value="4">4 Times</Option>
                                                                        <Option value="5">5 Times</Option>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <input
                                                                    type="checkbox"
                                                                    name="rememberCheckbox"
                                                                    checked={checkedPartial}
                                                                    onChange={onChangePartial}
                                                                    style={{ marginLeft: 5 }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </div>
                                            )}
                                            <Card
                                                className={
                                                    businessArray?.invoice_type === "f2m" ||
                                                        farmer_f2m === "f2m"
                                                        ? "invoice_card_top"
                                                        : "invoice_card "
                                                }
                                            >
                                                <div className="invoice_card_3">
                                                    <h4>
                                                        {" "}
                                                        <i
                                                            className="fa fa-file-text"
                                                            style={{ fontSize: "20px", marginRight: "15px" }}
                                                        ></i>{" "}
                                                        Create Invoice
                                                    </h4>
                                                </div>
                                                <div className="creat-invoice">
                                                    <div className="invoice_card_3">
                                                        <button
                                                            className="create_share_preview"
                                                            onClick={() => createInvoiceItems("preview")}
                                                        >
                                                            Preview
                                                        </button>
                                                        <button
                                                            className="create_btn"
                                                            onClick={() => createInvoiceItems("draft")}
                                                        >
                                                            Save Draft
                                                        </button>
                                                    </div>
                                                </div>
                                                <span className="link_brd_line" />
                                            </Card>
                                            {params.id ? (
                                                businessArray?.invoice_type === "f2m" ||
                                                    farmer_f2m === "f2m" ? (
                                                    ""
                                                ) : (
                                                    <Card className={state.invoiceType === "Farmer" ? "invoice_card_far" : "invoice_card"} style={{ marginTop: (state.create_gst === false && state.partial_payment === false ? "16px" : "20px") }}>
                                                        <div className="invoice_card_3">
                                                            <h4>
                                                                {" "}
                                                                <i
                                                                    className="fa fa-send"
                                                                    style={{
                                                                        fontSize: "20px",
                                                                        marginRight: "15px",
                                                                    }}
                                                                ></i>{" "}
                                                                Send Invoice
                                                            </h4>
                                                        </div>

                                                        <div className="send-invoice">
                                                            <h5>Last Sent:Never-</h5>
                                                            <h5 style={{ marginBottom: "15px" }}>
                                                                <span style={{ color: "#2e72b9" }}>
                                                                    Mark as sent{" "}
                                                                </span>
                                                                to set up reminder
                                                            </h5>

                                                            <div className="invoice_card_3">
                                                                {(state.invoiceType === "Farmer" && state.status === "paid") || state.status === "sent" ? "" : (
                                                                    <button className="creates_btn" onClick={state.invoiceType === "Farmer" && state.status !== "paid" ? "" : sendInvoice}>{state.invoiceType === "Farmer" && state.status !== "paid" ? "Pay Now" : "Send"}</button>
                                                                )}
                                                                <button className="creates_btn" style={{ marginLeft: "15px" }} onClick={downloadPdf}>
                                                                    Download
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <span className="link_brd" />
                                                    </Card>
                                                )
                                            ) : (
                                                <Card className="invoice_card card_opacity">
                                                    <div className="invoice_card_3">
                                                        <h4>
                                                            {" "}
                                                            <i
                                                                className="fa fa-send"
                                                                style={{
                                                                    fontSize: "20px",
                                                                    marginRight: "15px",
                                                                }}
                                                            ></i>{" "}
                                                            Send Invoice
                                                        </h4>
                                                    </div>

                                                    <div className="send-invoice">
                                                        <h5>Last Sent:Never-</h5>
                                                        <h5 style={{ marginBottom: "15px" }}>
                                                            <span style={{ color: "#2e72b9" }}>
                                                                Mark as sent{" "}
                                                            </span>
                                                            to set up reminder
                                                        </h5>
                                                        <div className="invoice_card_3">
                                                            {farmer_f2m === "f2m" ? "" :
                                                                <button className="creates_btn ant-btn" style={{ marginRight: "15px" }} disabled>
                                                                    Send
                                                                </button>
                                                            }
                                                            {/* <button className="create_share ant-btn" disabled>
                                                                Get Share Link
                                                            </button> */}
                                                            <button className="creates_btn ant-btn" disabled>
                                                                Download
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <span className="link_brd" />
                                                </Card>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        </div>
                    </div>
                    <div>
                        <Modal
                            title={modalItem.item_id ? "Update Item" : "Create Item"}
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
                                    {modalItem.item_id ? "Update" : "Submit"}
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
                                    <Form.Item label="Name">
                                        <Input
                                            name="name"
                                            placeholder="Name"
                                            value={modalItem.name}
                                            onChange={handleItemChange}
                                        />
                                    </Form.Item>
                                    {/* <Form.Item
                                            label="Quantity"
                                        >
                                            <Input name="quantity" placeholder="quantity" value={modalItem.quantity} onChange={handleChangeNumber} />
                                        </Form.Item> */}
                                    <Form.Item label="Description">
                                        <Input
                                            name="description"
                                            placeholder="description"
                                            value={modalItem.description}
                                            onChange={handleItemChange}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Cost">
                                        <Input
                                            name="cost"
                                            placeholder="cost"
                                            value={modalItem.cost}
                                            onChange={handleItemChangeNumber}
                                        />
                                    </Form.Item>
                                    <Form.Item label="GST">
                                        <Input
                                            name="gst"
                                            placeholder="Gst"
                                            value={modalItem.gst}
                                            onChange={handleItemChangeNumber}
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
                                    {senditems && senditems.length !== 0 ? senditems && senditems.map((item, i) => (
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
                                                    onChange={(e) => handleSendInputChange(e, i)}
                                                />
                                                <BsPlusCircle className="invoice_plus_icon" onClick={handleSendAddClick} />
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
                                                    /> <span style={{ marginTop: 5, float: 'left' }}> Send a copy to myself at <span style={{ color: "black", fontWeight: 500 }}>{sendInvoices.from}</span></span>
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
                </div>
            </>
        </>
    );
}

export default AddEdit;
