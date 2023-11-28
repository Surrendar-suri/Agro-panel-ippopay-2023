import React, {
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useState,
} from "react";
import { Link, useHistory } from 'react-router-dom';
import { imagePath } from "./../../assets/ImagePath";
import { useDispatch, useSelector } from "react-redux";
import { userConstants } from "./../../constants/ActionTypes";
import {
  validate,
  currencyFormatter,
  returnTimeZoneDate,
  returnZoneDate,
  manipulateString,
  textCapitalize,
  returnFixed,
} from "./../../DataServices/Utils";
import ApiGateway from "./../../DataServices/DataServices";
import Select from "react-select";
import { customAlphabet } from "nanoid";
import { ToastProvider, useToasts } from "react-toast-notifications";
import cookie from "react-cookies";
import { DateRangePicker } from "react-date-range";
import {Table } from 'antd';
import { isInvalidEmail, isInvalidName,showDateTime, number, specialChars, uppercase, lowercase, toastError, toastSuccess, Toaster, passwordValidations, showDate, getIsoString, showError, showSuccess } from '../../helpers/Utils';
import moment from "moment";
import Modal from "react-modal";
// const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  10
);
const customStyles = {
  overlay: {
    backgroundColor: null,
    position: null,
    inset: null,
  },
  content: {
    top: null,
    left: null,
    right: null,
    bottom: null,
    border: null,
    background: null,
    borderRadius: null,
    padding: null,
    position: null,
    overflow: null,
  },
};
const Payouts = () => {
  const { dashboard, quick_transfer, header } = useSelector((state) => state);
  console.log("quick_transfer", dashboard);
  const dispatch = useDispatch();
  const latestValue = useRef({});
  latestValue.current = quick_transfer;
  const stateChanges = (type, payload) => {
    console.log("sdaasdads", payload)
    return { type: userConstants[type], payload };
  };
 
  useEffect(() => {
    getPayoutsList();
    ApiGateway.get(`/account/details`, function (response) {
      if (response.success) {
        console.log("response response", response);
        if (response.success) {
          let account = response.data.account;
          dispatch(
            updateState(userConstants.DASHBOARD, {
              account_number:
                account.van_accounts[account.van_accounts.primary].account_no,
              ifsc: account.van_accounts[account.van_accounts.primary].ifsc,
              company_name:
                header.merchant_profile.business !== undefined
                  ? header.merchant_profile.business.name
                  : "",
              virtual_acnt_created: true,
              available_balance: account.available_balance,
              upi_vpa_id:
                account.vpa_accounts[account.vpa_accounts.primary].vpa,
            })
          );
        } else {
          dispatch(
            updateState(userConstants.DASHBOARD, {
              virtual_acnt_created: false,
            })
          );
        }
        //dispatch(updateState(userConstants.DASHBOARD,{ merchant_profile : response.data.merchant }));
      }
    });
  }, [
    quick_transfer.status,
    quick_transfer.content_type_filter,
    quick_transfer.page,
    quick_transfer.selection,
    quick_transfer.fromDate,
    quick_transfer.filterList,
  ]);
  useEffect(() => {
    if (quick_transfer.showQuickTransfer) {
      getContactList();
    }
  }, [quick_transfer.showQuickTransfer]);

  useEffect(() => {
    if (quick_transfer.contact_id !== "") {
      getFundAcntList();
    }
  }, [quick_transfer.contact_id]);

  useEffect(() => {
    if (quick_transfer.FundAcntList) {
      getFundAcntUpiList();
    }
  }, [quick_transfer.FundAcntList]);
  const updateState = (actionType, value) => (dispatch) => {
    dispatch({ type: actionType, payload: value });
    return Promise.resolve();
  };
  document.onclick = (args) => {
    if (
      !args.target.closest(
        ".fileter_form_input_contact_type,.pop_selector .drop_list"
      )
    ) {
      dispatch(
        stateChanges("QUICK_TRANSFER", {
          drop_down_open: false,
          itemSearchTerm: "",
        })
      );
    }
  };

  const getFundAcntUpiList = () => {
    if (quick_transfer.contact_id !== "") {
      ApiGateway.get(
        `/merchant/upi/list?contact_id=${quick_transfer.contact_id}`,
        function (response) {
          if (response.success) {
            console.log(
              "quick_transfer quick_transfer quick_transfer quick_transfer",
              quick_transfer
            );
            console.log("response.success response", response);
            let FundAcntUpiList = response.data.upis;
            FundAcntUpiList.map((v, i) => {
              v.checked = i === 0 ? true : false;
            });
            console.log("FundAcntUpiList FundAcntUpiList", FundAcntUpiList);
            let [selectedFundAcntUpiList] = response.data.upis;
            selectedFundAcntUpiList.checked = true;
            dispatch(
              stateChanges("QUICK_TRANSFER", {
                FundAcntUpiList,
                selectedFundAcntUpiList,
                account_type:
                  quick_transfer.FundAcntList.length < 5
                    ? "bank_acnt"
                    : "upi_id",
              })
            );
          }
        }
      );
    }
  };

  const getFundAcntList = () => {
    ApiGateway.get(
      `/beneficiary/list?contact_id=${quick_transfer.contact_id}`,
      function (response) {
        if (response.success) {
          console.log("response.success", response);
          let FundAcntList = response.data.beneficiaries;
          if (FundAcntList.length > 0) {
            FundAcntList.map((v, i) => {
              v.checked = i === 0 ? true : false;
            });
            let [selectedFundAcntList] = response.data.beneficiaries;
            selectedFundAcntList.checked = true;
            dispatch(
              stateChanges("QUICK_TRANSFER", {
                FundAcntList,
                selectedFundAcntList,
                createFundAcnt: !FundAcntList.length ? true : false,
                showFundList: FundAcntList.length ? true : false,
              })
            );
          } else {
            let [selectedFundAcntList] = [];
            dispatch(
              stateChanges("QUICK_TRANSFER", {
                FundAcntList,
                selectedFundAcntList,
                createFundAcnt: !FundAcntList.length ? true : false,
                showFundList: FundAcntList.length ? true : false,
              })
            );
          }
        }
      }
    );
  };

  const getPayoutsList = () => {
    var queryParam = "";
    queryParam += `&trans_type=DEBIT`;
    queryParam +=
      !quick_transfer.status || quick_transfer.status === "all"
        ? ""
        : `&status=${quick_transfer.status}`;
    queryParam += !quick_transfer.content_type_filter
      ? ""
      : `&contact_type=${quick_transfer.content_type_filter}`;
    queryParam += !quick_transfer.selection
      ? ""
      : `&selection=${quick_transfer.selection}`;
    queryParam +=
      quick_transfer.fromDate === ""
        ? ""
        : "&from_date=" + quick_transfer.fromDate;
    queryParam +=
      quick_transfer.toDate === "" ? "" : "&to_date=" + quick_transfer.toDate;
    queryParam +=
      quick_transfer.searchTerm !== ""
        ? "&search_term=" + quick_transfer.searchTerm
        : "";
    queryParam +=
      quick_transfer[quick_transfer.search_type] === undefined ||
        quick_transfer[quick_transfer.search_type] === ""
        ? ""
        : `&${quick_transfer.search_type}=` +
        quick_transfer[quick_transfer.search_type];
    ApiGateway.get(
      `/transaction/list?page=${quick_transfer.page}&limit=${quick_transfer.limit}${queryParam}`,
      function (response) {
        if (response.success) {
          dispatch(
            stateChanges("QUICK_TRANSFER", {
              payoutList: response.data.transaction,
            })
          );
          //dispatch(stateChanges({payoutList : response.data.transaction}));
        }
      }
    );
  };

  const toggleSection = (section) => {
    //dispatch(stateChanges("QUICK_TRANSFER",{[section] :  !quick_transfer[section]}));
    dispatch(
      updateState(userConstants.QUICK_TRANSFER, {
        [section]: !quick_transfer[section],
      })
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(
      stateChanges("QUICK_TRANSFER", {
        [name]: value,
      })
    );
  };
  const handleAmountChange = (e) => {
    const { name, value } = e.target;
    dispatch(
      stateChanges("QUICK_TRANSFER", {
        [name]: returnFixed(value),
      })
    );
  };

  const handleSelect = (value) => {
    dispatch(
      stateChanges("QUICK_TRANSFER", {
        contact_type: value,
        drop_down_open: false,
        itemSearchTerm: "",
      })
    );
  };

  const addNewType = () => {
    dispatch(
      stateChanges("QUICK_TRANSFER", {
        contact_type: quick_transfer.new_type,
        drop_down_open: false,
        itemSearchTerm: "",
      })
    );
  };

  const selectSingleContact = (list) => {
    console.log("single contact", list);
    let selectedSingleContact = {
      name: list.name,
      mobile: list.mobile,
      email: list.email,
      contact_type: list.contact_type,
    };
    dispatch(
      stateChanges("QUICK_TRANSFER", {
        selectedSingleContact,
        selectContact: true,
        createFundAcnt: false,
        contact_id: list.contact_id,
        beneficiary_name: selectedSingleContact.name.full,
        selectContact: true,
        showContactList: !quick_transfer.showContactList,
      })
    );

  };

  const removeSelectedContact = () => {
    console.log("enter enter enter enter");
    dispatch(
      stateChanges("QUICK_TRANSFER", {
        selectedFundAccount: {},
        addingPayout: false,
        selectedSingleContact: {},
        add_new_contact: false,
        selectContact: false,
        createFundAcnt: false,
        showFundList: false,
        showContactList: !quick_transfer.showContactList,
      })
    );
  };

  const createContact = () => {
    var eRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!quick_transfer.contact_name) {
      toastError("Please enter contact name");
    } else if (!quick_transfer.contact_type) {
      toastError("Please select contact type");
    } else if (!quick_transfer.contact_phone) {
      toastError("Please enter phone number");
    } else if (quick_transfer.contact_phone.length !== 10) {
      toastError("Please enter valid phone number");
    } else if (
      !quick_transfer.contact_email ||
      !eRegex.test(quick_transfer.contact_email)
    ) {
      toastError("Please enter valid email");
    } else {
      createContactApi();
    }
  };

  const createContactApi = () => {
    const data = {
      merchant_id: cookie.load("ippo_merchant_id"),
      name: {
        full: quick_transfer.contact_name,
      },
      mobile: {
        national_number: quick_transfer.contact_phone,
      },
      email: quick_transfer.contact_email,
      contact_type: quick_transfer.contact_type,
    };
    ApiGateway.post("/merchant/add/contact", data, function (response) {
      if (response.success) {
        toastSuccess(response.message);
        let selectedSingleContact = (({ merchant_id, ...o }) => o)(data);
        dispatch(
          stateChanges("QUICK_TRANSFER", {
            selectedSingleContact,
            selectContact: true,
            createFundAcnt: true,
            contact_id: response.data.contact.contact_id,
            beneficiary_name: data.name.full,
            add_new_contact: false,
          })
        );
      } else {
        toastError(response.message);
      }
    });
  };

  const createAccount = () => {
    if (quick_transfer.account_type === "bank_acnt") {
      if (!quick_transfer.beneficiary_name) {
        toastError("Please enter beneficiary name");
      } else if (!quick_transfer.fund_acnt_number) {
        toastError("Please enter account number");
      } else if (!quick_transfer.fund_confirm_acnt_number) {
        toastError("Please enter confirm account number");
      } else if (
        quick_transfer.fund_acnt_number !==
        quick_transfer.fund_confirm_acnt_number
      ) {
        toastError("Account number does not match");
      } else if (!quick_transfer.fund_ifsc) {
        toastError("PLease enter ifsc");
      } /* else if (!quick_transfer.beneficiary_ref) {
        toastError("PLease enter beneficiary reference");
      } */ else {
        let data = {
          contact_id: quick_transfer.contact_id,
          account: {
            number: quick_transfer.fund_acnt_number,
            ifsc: quick_transfer.fund_ifsc.replace(/ /g, ""),
          },
          beneficiary_ref: nanoid(),
          name: {
            full: quick_transfer.beneficiary_name,
          },
        };
        fundAccountCreation(data);
      }
    } else {
      if (!quick_transfer.beneficiary_name) {
        toastError("Please enter beneficiary name");
      } else if (!quick_transfer.fund_upi_id) {
        toastError("Please enter upi id");
      } else {
        let data = {
          merchant_id: cookie.load("ippo_merchant_id"),
          contact_id: quick_transfer.contact_id,
          vpa: quick_transfer.fund_upi_id,
          name: {
            full: quick_transfer.beneficiary_name,
          },
        };
        fundAccountCreation(data);
      }
    }
  };

  const fundAccountCreation = useCallback((data) => {
    if (quick_transfer.account_type === "bank_acnt") {
      ApiGateway.post(
        `/beneficiary/add`,
        data,
        function (response) {
          if (response.success) {
            let selectedFundAccount = {
              ...quick_transfer.selectedSingleContact,
              //bank: response.data.beneficiary.bank_info.name,
              account_number: data.account.number,
              beneficiary_ref: data.beneficiary_ref,
            };
            console.log(
              "quick_transfer.selectedSingleContact",
              quick_transfer.selectedSingleContact
            );
            console.log(
              "selectedFundAccount selectedFundAccount",
              selectedFundAccount
            );
            dispatch(updateState(userConstants.QUICK_TRANSFER, { createFundAcnt: false }));
            dispatch(
              stateChanges("QUICK_TRANSFER", {
                selectedFundAccount,
                addingPayout: true,
                showPayout: true,
              })
            );
          }
        }
      );
    } else {
      ApiGateway.post(`/merchant/add/upi`, data, function (response) {
        if (response.success) {
          console.log("upi response", response);
          let selectedFundAccount = {
            ...quick_transfer.selectedSingleContact,
            upi_id: quick_transfer.fund_upi_id,
          };
          console.log(
            "selectedFundAccount selectedFundAccount Api",
            selectedFundAccount
          );
          dispatch(
            stateChanges("QUICK_TRANSFER", {
              selectedFundAccount,
              addingPayout: true,
            })
          );
        }
      });
    }
  }, []);

  const changeCheck = (arr, idx) => {
    var newArr = arr;
    quick_transfer[newArr].map((v, i) => {
      v.checked = i === idx ? true : false;
    });
    console.log("newArr", newArr);
    dispatch(
      stateChanges("QUICK_TRANSFER", {
        [newArr]: quick_transfer[newArr]
      })
    );
  };

  const selectBeneficiaryAcnt = () => {
    //Object.keys(obj).length === 0 quick_transfer.FundAcntList.length
    console.log("123", quick_transfer);
    if (quick_transfer.account_type_list === "bank_acnt") {
      if (quick_transfer.ShowFundAcntList) {
        console.log("123", quick_transfer.ShowFundAcntList);
        let index = quick_transfer.FundAcntList.findIndex((x) => x.checked);
        let selectedFundAccount = {
          ...quick_transfer.selectedSingleContact,
          //bank: quick_transfer.FundAcntList[index].bank_info.name,
          account_number: quick_transfer.FundAcntList[index].account.number,
          beneficiary_id: quick_transfer.FundAcntList[index].beneficiary_id,
          beneficiary_ref: quick_transfer.FundAcntList[index].beneficiary_ref,
        };
        dispatch(
          stateChanges("QUICK_TRANSFER", {
            selectedFundAccount,
            addingPayout: true,
            showPayout: true,
          })
        );
      } else {
        let selectedFundAccount = {
          ...quick_transfer.selectedSingleContact,
          account_number:
            quick_transfer.selectedFundAcntList.account &&
            quick_transfer.selectedFundAcntList.account.number,
          beneficiary_id:
            quick_transfer.selectedFundAcntList &&
            quick_transfer.selectedFundAcntList.beneficiary_id,
        };

        console.log(
          "quick_transfer.selectedFundAcntList",
          quick_transfer.selectedFundAcntList
        );
        dispatch(
          stateChanges("QUICK_TRANSFER", {
            selectedFundAccount,
            addingPayout: true,
            showPayout: true,
          })
        );
      }
    } else {
      if (quick_transfer.ShowFundAcntUpiList) {
        let index = quick_transfer.FundAcntUpiList.findIndex((x) => x.checked);
        let selectedFundAccount = {
          ...quick_transfer.selectedSingleContact,
          upi_id: quick_transfer.FundAcntUpiList[index].vpa,
        };
        dispatch(
          stateChanges("QUICK_TRANSFER", {
            selectedFundAccount,
            addingPayout: true,
            showPayout: true,
          })
        );
      } else {
        let selectedFundAccount = {
          ...quick_transfer.selectedSingleContact,
          upi_id: quick_transfer.selectedFundAcntUpiList.vpa,
        };
        console.log(
          "quick_transfer.selectedFundAcntUpiList",
          quick_transfer.selectedFundAcntUpiList
        );
        dispatch(
          stateChanges("QUICK_TRANSFER", {
            selectedFundAccount,
            addingPayout: true,
            showPayout: true,
          })
        );
      }
    }
  };
  const handleSearchChange = (e) => {
    var name = e.target.name;
    var value = e.target.value;
    dispatch(updateState(userConstants.QUICK_TRANSFER, { [name]: value }));
    /* dispatch(stateChanges({
                [name]: value
            })); */
  };
  const selectFilter = (filter, e) => {
    console.log("filter", filter);
    console.log("e", e);
    let str = manipulateString(filter);
    dispatch(
      updateState(userConstants.QUICK_TRANSFER, {
        [filter]: e.value,
        [str]: e,
        searchTerm: "filter" === "search_type" ? "" : quick_transfer.searchTerm,
      })
    );
    /* dispatch(stateChanges({
                [filter]: e.value,
                [str]: e,
                searchTerm: "filter" === "search_type" ? "" : quick_transfer.searchTerm
            })); */
  };
  const showFilterList = () => {
    if (
      quick_transfer.searchTerm !== "" ||
      (quick_transfer[quick_transfer.search_type] !== undefined &&
        quick_transfer[quick_transfer.search_type] !== "")
    ) {
      dispatch(stateChanges({ filterList: true }));
      //dispatch(updateState(userConstants.QUICK_TRANSFER,{ filterList : true}));
    }
  };
  const selectionRange = {
    startDate: quick_transfer.startDate,
    endDate: quick_transfer.endDate,
    key: "selection",
  };
  const dateChange = (dates) => {
    dispatch(
      updateState(userConstants.QUICK_TRANSFER, {
        startDate: dates.selection.startDate,
        endDate: dates.selection.endDate,
      })
    ).then(() => {
      const quick_transfer = latestValue.current;
      console.log("quick_transfer quick_transfer", quick_transfer);
      if (quick_transfer.endDate > quick_transfer.startDate) {
        dispatch(
          updateState(userConstants.QUICK_TRANSFER, {
            from: moment(quick_transfer.startDate).format("DD/MM/YYYY"),
            to: moment(quick_transfer.endDate).format("DD/MM/YYYY"),
            fromDate: moment(quick_transfer.startDate)
              .startOf("day")
              .utc()
              .toISOString(),
            toDate: moment(quick_transfer.endDate)
              .startOf("day")
              .utc()
              .toISOString(),
            open_picker: false,
          })
        );
      }
    });
  };
  const getContactList = () => {
    var queryParam = "";
    queryParam += `&merchant_id=${cookie.load("ippo_merchant_id")}`;
    queryParam +=
      !quick_transfer.status || quick_transfer.status === "all"
        ? ""
        : `&status=${quick_transfer.status}`;
    queryParam += !quick_transfer.content_type_filter
      ? ""
      : `&contact.contact_type=${quick_transfer.content_type_filter}`;
    queryParam += !quick_transfer.selection
      ? ""
      : `&pay_mode=${quick_transfer.selection}`;
    queryParam +=
      quick_transfer.fromDate === ""
        ? ""
        : "&from_date=" + quick_transfer.fromDate;
    queryParam +=
      quick_transfer.toDate === "" ? "" : "&to_date=" + quick_transfer.toDate;
    queryParam +=
      quick_transfer.searchTerm !== ""
        ? "&search_term=" + quick_transfer.searchTerm
        : "";
    queryParam +=
      quick_transfer[quick_transfer.search_type] === undefined ||
        quick_transfer[quick_transfer.search_type] === ""
        ? ""
        : `&${quick_transfer.search_type}=` +
        quick_transfer[quick_transfer.search_type];
    ApiGateway.get(
      `/merchant/list/contact?page=${quick_transfer.page}&limit=${quick_transfer.limit}${queryParam}`,
      function (response) {
        if (response.success) {
          //dispatch(stateChanges({contactList : response.data.contacts , totalPage : response.data.total}));
          dispatch(
            stateChanges("QUICK_TRANSFER", {
              contactList: response.data.contacts,
            })
          );
        }
      }
    );
  };
  const openViewModal = (trans_id) => {
    ApiGateway.get(
      `/transaction/detail?trans_id=${trans_id}`,
      function (response) {
        if (response.success) {
          dispatch(
            updateState(userConstants.QUICK_TRANSFER, {
              transactionDetails: response.data.transaction,
              modalIsOpen: true,
            })
          );
        }
      }
    );
  };
  const closeModal = () => {
    dispatch(updateState(userConstants.QUICK_TRANSFER, { modalIsOpen: false }));
  };
  const openDatePicker = () => {
    dispatch(updateState(userConstants.QUICK_TRANSFER, { open_picker: true }));
  };
  const addPayout = () => {
    if (!quick_transfer.payout_amount) {
      toastError("Please Enter Amount");
    } else if (quick_transfer.payout_amount == 0) {
      toastError("Please Enter Valid Amount");
    } else if (!quick_transfer.payout_purpose) {
      toastError("Please Enter Purpose of Payment");
    } else if (!quick_transfer.payment_type) {
      toastError("Please Select Payment Type");
    } else {
      dispatch(
        updateState(userConstants.QUICK_TRANSFER, {
          showPayout: false,
          transaction_ref: nanoid(),
          confirmCreationPayout: true,
        })
      );
    }
  };
  const confirmPayout = () => {
    const data = {
      amount: quick_transfer.payout_amount,
      remarks: quick_transfer.payout_purpose,
      pay_mode: quick_transfer.payment_type,
      trans_ref: quick_transfer.transaction_ref,
      beneficiary: {
        beneficiary_ref: quick_transfer.selectedFundAccount.beneficiary_id,
      },
    };
    console.log("asd11a123", quick_transfer.selectedFundAccount);
    if (!quick_transfer.payout_verify_otp) {
      toastError("Please Enter OTP");
    } else {
      ApiGateway.post("/transaction/banktransfer", data, function (response) {
        if (response.success) {
          toastSuccess(response.message);
          dispatch(
            updateState(userConstants.QUICK_TRANSFER, {
              showQuickTransfer: false,
            })
          );
          getPayoutsList();
        } else {
          toastError(response.message);
        }
      });
    }
  };
  const resetFilter = () => {
    if (quick_transfer.status) {
      delete quick_transfer.status;
      delete quick_transfer.Status;
    }
    if (quick_transfer.content_type_filter) {
      delete quick_transfer.content_type_filter;
      delete quick_transfer.ContentTypeFilter;
    }
    if (quick_transfer.selection) {
      delete quick_transfer.selection;
      delete quick_transfer.Selection;
    }
    if (quick_transfer.from) {
      quick_transfer.startDate = new Date();
      quick_transfer.endDate = new Date();
      quick_transfer.from = "";
      quick_transfer.to = "";
      quick_transfer.fromDate = "";
      quick_transfer.toDate = "";
    }
    if (quick_transfer.searchTerm) {
      quick_transfer.searchTerm = "";
    }
    if (quick_transfer.search_type) {
      delete quick_transfer[quick_transfer.search_type];
      delete quick_transfer.SearchType;
      quick_transfer.search_type = "";
    }
    console.log("quick_transfer", quick_transfer.SearchType);
    dispatch(
      updateState(userConstants.QUICK_TRANSFER, {
        ...quick_transfer,
        open_picker: false,
      })
    );
  };
  const search_filter = [
    { value: "beneficiary.beneficiary_id", label: "Benificiary Name" },
    { value: "trans_id", label: "Transaction ID" },
    { value: "contact.contact_id", label: "Contact ID" },
    { value: "contact.email", label: "Contact Email" },
    { value: "contact.phone.national_number", label: "Contact Phone" },
    { value: "contact.name.full", label: "Contact Name" },
    { value: "utr", label: "UTR" },
  ];
  const status_filter = [
    { value: "all", label: "All" },
    { value: "processing", label: "Processing" },
    { value: "queued", label: "Queued" },
    { value: "accepted", label: "Accepted" },
    { value: "success", label: "Success" },
    { value: "failed", label: "Failed" },
    { value: "cancelled", label: "Cancelled" },
  ];
  const pay_mode_filter = [
    { value: "imps", label: "IMPS" },
    { value: "rtgs", label: "RTGS" },
    { value: "neft", label: "NEFT" },
    { value: "upi", label: "UPI" },
  ];
  const type_filter = [
    { value: "customer", label: "Customer" },
    { value: "employee", label: "Employee" },
    { value: "vendor", label: "Vendor" },
    { value: "self", label: "Self" },
  ];
  const Duration_Filter = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "3month", label: "Last 3 Months" },
    { value: "6month", label: "Last 6 Months" },
    { value: "year", label: "Last year" },
  ];
  const contact_search = [
    { value: "contact_search_id", label: "Contact ID" },
    { value: "contact_search_email", label: "Contact Email" },
    { value: "contact_search_phone", label: "Contact Phone" },
    { value: "contact_search_name", label: "Contact Name" },
    { value: "contact_search_ref_id", label: "Reference ID" },
  ];

  // New Table
  // const [state, setState] = useState({
  //   acc_transaction_id: "",
  //   acc_transaction_name: "",
  //   acc_transaction_time: "",
  //   acc_transaction_created:"",
  //   acc_transaction_source: "",
  //   acc_transaction_paymode: "",
  //   acc_transaction_amount: "",
  //   acc_transaction_status: "",
  //   acc_transaction_contactname: "",
  //   trans_utr_num:"",
  //   trans_id: "",
  //   trans_fee:"",
  //   trans_tax:"",
  //   acc_transaction_transamount:"",
  //   trans_feetax_total:"",
  //   statement: [],
  // })
  // useEffect(() => {
  //   handleTable();
  // }, []);        

  // const handleTable = () => {
  //   let query = ""
  //   dispatch((query, (result) => {
  //     if (result) {
  //       console.log("Payouts:::", result)
  //       let data = result?.transactions ?? "";
  //       setState({ ...state, statement: data, });
  //       setTotal(result.total)
  //     }
  //   }))
  // }


  // const handlePageChange = (page, pageSize) => {

  //   // setPage(page);
  //   setPageSize(pageSize);
  //   handleTable();
  // };
  // const column = [
  //   {
  //     title: "S.No",
  //     dataIndex: "S.No",
  //     render: (value, item, index) =>
  //       <div style={{ paddingLeft: 10 }}>
  //         {(currentPage - 1) * 10 + (index + 1)}
  //       </div>
  //   },

  //   {
  //     title: "ID",
  //     dataIndex: "trans_id",
  //     render: (trans_id, object) =>
  //       <a
  //         className=""
  //         // onClick={() => accountStatementDetail(object.trans_ref)}
  //       >{object.trans_id} </a>
  //   },

  //   {
  //     title: "Transaction Time",
  //     dataIndex: "createdAt",
  //     render: (createdAt) => showDateTime(createdAt)
  //   },
  //   {
  //     title: "Source",
  //     dataIndex: "trans_type",
  //   },
  //   {
  //     title: "Payment Mode",
  //     dataIndex: "pay_mode",
  //     render: (pay_mode, object) => `${pay_mode ?? "-"}`
  //   },
  //   {
  //     title: "Contact",
  //     dataIndex: "beneficiary",
  //     render: (beneficiary, object) => `${beneficiary?.name?.full ?? "-"}`
  //   },
  //   {
  //     title: "Amount",
  //     dataIndex: "transaction_amount",
  //     render: (transaction_amount) => (transaction_amount)
  //   },
  //   {
  //     title: "Status",
  //     dataIndex: "status",
  //   },
  //   {
  //     title: "Action",
  //     dataIndex: "trans_ref",
  //     render: (trans_ref, object) =>
  //       <a
  //         className="btn btn-xs btn-info"
  //         // onClick={() => accountStatementDetail(trans_ref)}
  //       >View </a>
  //   },
  //   // {
  //   //   title: "Action",
  //   // },

  // ]
  // let locale = {
  //   emptyText: (
  //     <span className="empty_data">
  //       <p>
  //         Data not found
  //       </p>

  //     </span>
  //   )

  // };


  return (
    <>
      <Toaster />
      <div className="content_wrapper">
        <div className="jumps-prevent" style={{ paddingTop: 74 }}></div>
        <div className="main-content app-content mt-0">
          <div className="side-app">
            <div className="container-fluid main-container p-0 ">
              <div className="business_top agro_card">
                <div className="row">
                  <div className="col-xs-4">
                    <div className="card">
                      <div className="card-body">
                        <h4 className="">Account Balance</h4>
                        <h2 className="mb-0 number-font">&#x20B9;2,44,278</h2>
                      </div>
                    </div>
                  </div>
                  <div className="col-xs-4">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="m-b-10 "><span>Company Name :</span><span> Ippopay</span></h5>
                        <h5 className="m-b-10"><span>Account Number :</span><span> 3838303349994</span></h5>
                        <h5><span>IFSC :</span><span></span> HDFCOCNSFD</h5>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="business_header">
                  <h4 className="business_head"></h4>
                  <div className="payout_buttons">
                    <button
                      className="create_btn"
                      onClick={() => toggleSection("showQuickTransfer")}
                    >
                      {" "}
                      Quick Transfer{" "}
                    </button>
                  </div>
                </div>
                {/* <div className="business_top">
                  <div className='agro_card_table'>
                    <div className='card'>
                      <div className='card-body'>
                        <Table
                          align="left"
                          className="gx-table-responsive agri_table"
                          columns={column}
                          locale={locale}
                          dataSource={state.statement}
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={quick_transfer.showQuickTransfer}
        style={customStyles}
        contentLabel="Quick Transfer"
      >
        <div
          className="modal-overview"
        >
          <div className="modal-header">
            <button
              type="button"
              className="close"
              onClick={() => toggleSection("showQuickTransfer")}
            >
              {" "}
              &times;{" "}
            </button>
            <h4 className="modal-title"> Quick Transfer </h4>
          </div>
          <div className="modal-body clearfix">
            <div className="bs-vertical-wizard">
              <ul>
                <li className="complete">
                  <div className="step_wrap">
                    Debit account details confirmed{" "}
                    <i className="ico fa fa-check ico-green"> </i>{" "}
                    <span className="desc">
                      {" "}
                      Debit from Virtual Account{" "}
                      <span className="blue font-600">
                        {" "}
                        {dashboard.account_number || "-"}{" "}
                      </span>
                    </span>
                  </div>
                </li>
                <li
                  className={
                    quick_transfer.addingPayout ? "complete" : "current"
                  }
                >
                  <div className="step_wrap">
                    Who do you want to send the payout to ?{" "}
                    <i className="ico fa fa-check ico-green"> </i>
                  </div>
                  {quick_transfer.addingPayout ? (
                    <div className="payout_added_section">
                      <div className="payout_added_section_list">
                        {quick_transfer.selectedFundAccount.name &&
                          <div className="payout_added_section_list_inner">
                            <i className="fa fa-user"> </i>{" "}
                            {quick_transfer.selectedFundAccount.name.full}
                          </div>
                        }
                        {quick_transfer.selectedFundAccount.mobile &&
                          <div className="payout_added_section_list_inner">
                            <i className="fa fa-phone"> </i>
                            {
                              quick_transfer.selectedFundAccount.mobile
                                .national_number
                            }
                          </div>
                        }
                        {quick_transfer.selectedFundAccount.email &&
                          <div className="payout_added_section_list_inner">
                            <i className="fa fa-envelope"> </i>{" "}
                            {quick_transfer.selectedFundAccount.email}
                          </div>
                        }
                        {quick_transfer.selectedFundAccount.upi_id !==
                          undefined ? (
                          <div className="payout_added_section_list_inner">
                            {" "}
                            <img src={imagePath("./upi-new.png").default} />
                            {quick_transfer.selectedFundAccount.upi_id}
                          </div>
                        ) : (
                          <div className="payout_added_section_list_inner">
                            {" "}
                            <img src={imagePath("./bankaccount.png").default} />
                            {quick_transfer.selectedFundAccount.account_number}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="payout_popup_wrapper">
                      {quick_transfer.add_new_contact ? (
                        <div className="center_palcemrnt">
                          <p className="choose_contact_para">
                            {" "}
                            Adding a new contact
                            <span
                              className="choose_contact_go_back"
                              onClick={() =>
                                dispatch(
                                  stateChanges("QUICK_TRANSFER", {
                                    add_new_contact: false,
                                  })
                                )
                              }
                            >
                              {" "}
                              Go back to existing contact selection{" "}
                            </span>
                          </p>
                          <div className="contact_add_popup_inner">
                            <div className="col-xs-12 col-md-6 p-l-0">
                              <div className="form-group clearfix">
                                <label className="filter_label col-xs-12 p-l-0">
                                  {" "}
                                  Contact Name{" "}
                                </label>
                                <div className="col-xs-12 p-0">
                                  <input
                                    className="fileter_form_input"
                                    type="text"
                                    name="contact_name"
                                    value={quick_transfer.contact_name}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-xs-12 col-md-6 p-r-0">
                              <div className="form-group clearfix">
                                <label className="filter_label col-xs-12 p-l-0">
                                  {" "}
                                  Contact Type{" "}
                                </label>
                                <div className="col-xs-12 p-0">
                                  <input
                                    className="fileter_form_input fileter_form_input_contact_type"
                                    type="text"
                                    value={quick_transfer.contact_type}
                                    onClick={() =>
                                      dispatch(
                                        stateChanges("QUICK_TRANSFER", {
                                          drop_down_open:
                                            !quick_transfer.drop_down_open,
                                        })
                                      )
                                    }
                                  />
                                  {quick_transfer.drop_down_open && (
                                    <div className="pop_selector">
                                      {/* <div className="search_box">
                                                                            <span className="search_btn">
                                                                                <i className="fa fa-search"> </i>
                                                                            </span> 
                                                                            <input type="text" className="search_form" placeholder="Type an item name" name="itemSearchTerm" value={ quick_transfer.itemSearchTerm } onChange={ handleChange }/> 
                                                                        </div>  */}
                                      <ul className="drop_list">
                                        {quick_transfer.contact_type_list
                                          .length !== 0 ? (
                                          quick_transfer.contact_type_list.map(
                                            (list, i) => {
                                              return (
                                                <li
                                                  key={i}
                                                  onClick={() =>
                                                    handleSelect(list.value)
                                                  }
                                                >
                                                  {" "}
                                                  {list.value}{" "}
                                                </li>
                                              );
                                            }
                                          )
                                        ) : (
                                          <li>
                                            <span className="bld_con text-center">
                                              {" "}
                                              No item found{" "}
                                            </span>
                                          </li>
                                        )}
                                      </ul>
                                      {quick_transfer.contact_type_list
                                        .length === 0 ? (
                                        <div className="create_new">
                                          <input
                                            type="text"
                                            className="create_new_input"
                                            placeholder="Type a name"
                                            name="new_type"
                                            value={
                                              quick_transfer.new_type || ""
                                            }
                                            onChange={handleChange}
                                          />
                                          <span className="popup_icon_close">
                                            {" "}
                                            <i className="fa fa-close"> </i>
                                          </span>
                                          <span
                                            className="popup_icon_add"
                                            onClick={() =>
                                              quick_transfer.new_type !== "" &&
                                              addNewType()
                                            }
                                          >
                                            <i className="fa fa-check"></i>
                                          </span>
                                        </div>
                                      ) : null}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col-xs-12 col-md-6 p-l-0">
                              <div className="form-group clearfix">
                                <label className="filter_label col-xs-12 p-l-0">
                                  {" "}
                                  Phone{" "}
                                </label>
                                <div className="col-xs-12 p-0">
                                  <div className="input-group">
                                    <span className="input-group-addon">
                                      {" "}
                                      +91{" "}
                                    </span>
                                    <input
                                      className="fileter_form_input"
                                      // name="date"
                                      placeholder=""
                                      type="text"
                                      name="contact_phone"
                                      value={quick_transfer.contact_phone}
                                      onChange={handleChange}
                                      onKeyPress={(e) => validate(e)}
                                      onPaste={(e) => e.preventDefault()}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-xs-12 col-md-6 p-r-0">
                              <div className="form-group clearfix">
                                <label className="filter_label col-xs-12 p-l-0">
                                  {" "}
                                  Email{" "}
                                </label>
                                <div className="col-xs-12 p-0">
                                  <div className="input-group">
                                    <span className="input-group-addon">
                                      {" "}
                                      <i className="fa fa-envelope"> </i>
                                    </span>
                                    <input
                                      className="fileter_form_input"
                                      placeholder=""
                                      type="text"
                                      name="contact_email"
                                      value={quick_transfer.contact_email}
                                      onChange={handleChange}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="contact_item_button">
                              <a
                                className="btn btn_new btn-default"
                                onClick={() =>
                                  dispatch(
                                    stateChanges("QUICK_TRANSFER", {
                                      add_new_contact: false,
                                    })
                                  )
                                }
                              >
                                {" "}
                                Back{" "}
                              </a>
                              <a
                                className="btn btn_new btn-primary"
                                onClick={createContact}
                              >
                                {" "}
                                Next{" "}
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          {quick_transfer.showContactList ? (
                            <>
                              <div className="payout_popup_search">
                                <input
                                  className="payout_popup_search_input"
                                  type="text"
                                />
                                <div className="payout_popup_search_select">
                                  <Select
                                    className="selectpicker"
                                    options={contact_search}
                                    onChange={(e) =>
                                      selectFilter("contact_search", e)
                                    }
                                    value={
                                      quick_transfer.contactSearch !==
                                      undefined &&
                                      quick_transfer.contactSearch
                                    }
                                  />
                                </div>
                              </div>
                              <p className="choose_contact_para">
                                {" "}
                                Or choose from your latest created contacts....{" "}
                              </p>
                              <div className="contact_list">
                                {quick_transfer.contactList.map((list, i) => {
                                  return (
                                    <div
                                      className="contact_list_item"
                                      key={"list" + i}
                                      onClick={() => selectSingleContact(list)}
                                    >
                                      <div className="contact_list_name">
                                        {" "}
                                        {list.name.full}{" "}
                                      </div>
                                      <div className="contact_list_detail">
                                        {" "}
                                        <i className="fa fa-phone"> </i>
                                        {list.mobile.national_number}
                                      </div>
                                      <div className="contact_list_detail">
                                        {" "}
                                        <i className="fa fa-envelope"> </i>
                                        {list.email}
                                      </div>
                                      <div className="contact_list_type">
                                        {" "}
                                        {list.contact_type}{" "}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <div
                                className="contact_add_item"
                                onClick={() =>
                                  dispatch(
                                    stateChanges("QUICK_TRANSFER", {
                                      add_new_contact: true,
                                    })
                                  )
                                }
                              >
                                Add a new contact{" "}
                              </div>
                            </>
                          ) : null}
                        </>
                      )}
                      {(quick_transfer.showFundList ||
                        quick_transfer.selectContact ||
                        quick_transfer.createFundAcnt) && (
                          <div className="contact_add_popup">
                            {quick_transfer.selectContact ? (
                              <div className="contact_list_item contact_list_item_remove">
                                <div className="contact_list_name">
                                  {quick_transfer.selectedSingleContact.name.full}{" "}
                                </div>
                                <div className="contact_list_detail">
                                  <i className="fa fa-phone"> </i>{" "}
                                  {
                                    quick_transfer.selectedSingleContact.mobile
                                      .national_number
                                  }{" "}
                                </div>{" "}
                                <div className="contact_list_detail">
                                  <i className="fa fa-envelope"> </i>{" "}
                                  {quick_transfer.selectedSingleContact.email}{" "}
                                </div>
                                <div className="contact_list_type">
                                  {" "}
                                  {
                                    quick_transfer.selectedSingleContact
                                      .contact_type
                                  }{" "}
                                </div>
                                <div
                                  className="contact_list_close"
                                  onClick={removeSelectedContact}
                                >
                                  <i className="fa fa-close"> </i>{" "}
                                </div>
                              </div>
                            ) : null}
                            {quick_transfer.createFundAcnt ? (
                              <>
                                <p className="choose_contact_para bold">
                                  Adding a new fund account{" "}
                                </p>
                                {quick_transfer.FundAcntUpiList.length > 1 &&
                                  <p
                                    className="choose_contact_go_back"
                                    onClick={() =>
                                      dispatch(
                                        stateChanges("QUICK_TRANSFER", {
                                          createFundAcnt: false,
                                          showFundList: true,
                                        })
                                      )
                                    }
                                  >
                                    Go back to existing fund account selection{" "}
                                  </p>
                                }
                                <div className="contact_add_popup_inner">
                                  <div className="col-xs-12 col-md-12 p-l-0">
                                    <div className="form-group clearfix">
                                      <label className="filter_label col-xs-12 p-l-0">
                                        {" "}
                                        Account Type{" "}
                                      </label>
                                      <div className="col-xs-12 p-0">
                                        {quick_transfer.FundAcntUpiList.length <
                                          5 ? (
                                          <div className="pull-left">
                                            <input
                                              className="radio-check_input"
                                              type="radio"
                                              id="f-option1"
                                              onChange={() =>
                                                dispatch(
                                                  stateChanges("QUICK_TRANSFER", {
                                                    account_type: "upi_id",
                                                  })
                                                )
                                              }
                                              checked={
                                                quick_transfer.account_type ===
                                                "upi_id"
                                              }
                                            />
                                            <label
                                              className="radio-check_label"
                                              for="f-option1"
                                            >
                                              {" "}
                                              UPI ID{" "}
                                            </label>
                                          </div>
                                        ) : null}
                                        {quick_transfer.FundAcntList.length <
                                          5 ? (
                                          <div className="pull-left">
                                            <input
                                              className="radio-check_input"
                                              type="radio"
                                              id="f-option2"
                                              onChange={() =>
                                                dispatch(
                                                  stateChanges("QUICK_TRANSFER", {
                                                    account_type: "bank_acnt",
                                                  })
                                                )
                                              }
                                              checked={
                                                quick_transfer.account_type ===
                                                "bank_acnt"
                                              }
                                            />
                                            <label
                                              className="radio-check_label"
                                              for="f-option2"
                                            >
                                              {" "}
                                              Bank Account{" "}
                                            </label>
                                          </div>
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                  {quick_transfer.account_type === "bank_acnt" ? (
                                    <>
                                      <div className="col-xs-12 col-md-6 p-l-0">
                                        <div className="form-group clearfix">
                                          <label className="filter_label col-xs-12 p-l-0">
                                            {" "}
                                            Beneficiary Name{" "}
                                          </label>
                                          <div className="col-xs-12 p-0">
                                            <input
                                              className="fileter_form_input"
                                              type="text"
                                              name="beneficiary_name"
                                              value={
                                                quick_transfer.beneficiary_name
                                              }
                                              onChange={handleChange}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-xs-12 col-md-6 p-r-0">
                                        <div className="form-group clearfix">
                                          <label className="filter_label col-xs-12 p-l-0">
                                            {" "}
                                            Account Number{" "}
                                          </label>
                                          <div className="col-xs-12 p-0">
                                            <input
                                              className="fileter_form_input"
                                              type="text"
                                              name="fund_acnt_number"
                                              value={
                                                quick_transfer.fund_acnt_number
                                              }
                                              onChange={handleChange}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-xs-12 col-md-6 p-l-0">
                                        <div className="form-group clearfix">
                                          <label className="filter_label col-xs-12 p-l-0">
                                            {" "}
                                            Confirm Account Number{" "}
                                          </label>
                                          <div className="col-xs-12 p-0">
                                            <input
                                              className="fileter_form_input"
                                              type="text"
                                              name="fund_confirm_acnt_number"
                                              value={
                                                quick_transfer.fund_confirm_acnt_number
                                              }
                                              onChange={handleChange}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-xs-12 col-md-6 p-r-0">
                                        <div className="form-group clearfix">
                                          <label className="filter_label col-xs-12 p-l-0">
                                            {" "}
                                            IFSC{" "}
                                          </label>
                                          <div className="col-xs-12 p-0">
                                            <input
                                              className="fileter_form_input"
                                              type="text"
                                              name="fund_ifsc"
                                              value={quick_transfer.fund_ifsc}
                                              onChange={handleChange}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      {/* <div className="col-xs-12 col-md-6 p-l-0">
                                      <div className="form-group clearfix">
                                        <label className="filter_label col-xs-12 p-l-0">
                                          {" "}
                                          Beneficiary Reference{" "}
                                        </label>
                                        <div className="col-xs-12 p-0">
                                          <input
                                            className="fileter_form_input"
                                            type="text"
                                            name="beneficiary_ref"
                                            value={
                                              quick_transfer.beneficiary_ref
                                            }
                                            onChange={handleChange}
                                          />
                                        </div>
                                      </div>
                                    </div> */}
                                    </>
                                  ) : (
                                    <>
                                      <div className="col-xs-12 col-md-6 p-l-0">
                                        <div className="form-group clearfix">
                                          <label className="filter_label col-xs-12 p-l-0">
                                            {" "}
                                            Beneficiary Name{" "}
                                          </label>
                                          <div className="col-xs-12 p-0">
                                            <input
                                              className="fileter_form_input"
                                              type="text"
                                              name="beneficiary_name"
                                              value={
                                                quick_transfer.beneficiary_name
                                              }
                                              onChange={handleChange}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-xs-12 col-md-6 p-r-0">
                                        <div className="form-group clearfix">
                                          <label className="filter_label col-xs-12 p-l-0">
                                            {" "}
                                            VPA(UPI ID){" "}
                                          </label>
                                          <div className="col-xs-12 p-0">
                                            <input
                                              className="fileter_form_input"
                                              type="text"
                                              name="fund_upi_id"
                                              value={quick_transfer.fund_upi_id}
                                              onChange={handleChange}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                  <div className="contact_item_button">
                                    <a className="btn btn_new btn-default">
                                      {" "}
                                      Back{" "}
                                    </a>
                                    <a
                                      className="btn btn_new btn-primary"
                                      onClick={createAccount}
                                    >
                                      {" "}
                                      Next{" "}
                                    </a>
                                  </div>
                                </div>
                              </>
                            ) : null}
                            {quick_transfer.showFundList ? (
                              <>
                                <p className="choose_contact_para m-t-10">
                                  {" "}
                                  Select fund account{" "}
                                </p>{" "}
                                <div className="contact_add_popup_inner">
                                  <div className="col-xs-12 col-md-12 p-l-0">
                                    {quick_transfer.FundAcntUpiList.length >= 1 &&
                                      <div className="form-group clearfix">
                                        <div className="col-xs-12 p-0">
                                          <div className="pull-left">
                                            <input
                                              className="radio-check_input"
                                              type="radio"
                                              id="f-option8"
                                              onChange={() =>
                                                dispatch(
                                                  stateChanges("QUICK_TRANSFER", {
                                                    account_type_list: "upi_id",
                                                  })
                                                )
                                              }
                                              checked={
                                                quick_transfer.account_type_list ===
                                                "upi_id"
                                              }
                                            />

                                            <label
                                              className="radio-check_label"
                                              for="f-option8"
                                            >
                                              {" "}
                                              UPI ID{" "}
                                            </label>

                                          </div>

                                          <div className="pull-left">
                                            <input
                                              className="radio-check_input"
                                              type="radio"
                                              id="f-option4"
                                              name="selector"
                                              onChange={() =>
                                                dispatch(
                                                  stateChanges("QUICK_TRANSFER", {
                                                    account_type_list: "bank_acnt",
                                                  })
                                                )
                                              }
                                              checked={
                                                quick_transfer.account_type_list ===
                                                "bank_acnt"
                                              }
                                            />
                                            <label
                                              className="radio-check_label"
                                              for="f-option4"
                                            >
                                              {" "}
                                              Bank Account{" "}
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    }
                                  </div>
                                  {quick_transfer.account_type_list ===
                                    "bank_acnt" ? (
                                    <>
                                      {quick_transfer.ShowFundAcntList ? (
                                        quick_transfer.FundAcntList.map(
                                          (list, i) => {
                                            return (
                                              <div
                                                className="col-xs-12 col-md-12 p-l-0"
                                                key={"list" + i}
                                              >
                                                <div className="form-group clearfix">
                                                  <input
                                                    className="radio-check_input"
                                                    type="radio"
                                                    id={"list" + i}
                                                    checked={list.checked}
                                                    onChange={() =>
                                                      changeCheck(
                                                        "FundAcntList",
                                                        i
                                                      )
                                                    }
                                                  />
                                                  <label
                                                    className="radio-check_label"
                                                    for={"list" + i}
                                                  >
                                                    <span className="accoount_bank_name_no">
                                                      <img
                                                        src={
                                                          imagePath(
                                                            "./bankaccount.png"
                                                          ).default
                                                        }
                                                      />

                                                      {list.account.number}
                                                    </span>
                                                    <span className="accoount_ifsc_name">
                                                      {" "}
                                                      {list.account.ifsc},{" "}
                                                      {list.name.full}{" "}
                                                    </span>
                                                  </label>
                                                </div>
                                              </div>
                                            );
                                          }
                                        )
                                      ) : (
                                        <>
                                          <p
                                            className="choose_contact_go_back"
                                            onClick={() =>
                                              dispatch(
                                                stateChanges("QUICK_TRANSFER", {
                                                  ShowFundAcntList: true,
                                                })
                                              )
                                            }
                                          >
                                            Show List
                                          </p>
                                          <div className="col-xs-12 col-md-12 p-l-0">
                                            <div className="form-group clearfix">
                                              <input
                                                className="radio-check_input"
                                                type="radio"
                                                id="f-option5"
                                                checked={
                                                  quick_transfer
                                                    .selectedFundAcntList.checked
                                                }
                                              />
                                              <label
                                                className="radio-check_label"
                                                for="f-option5"
                                              >
                                                <span className="accoount_bank_name_no">
                                                  <img
                                                    src={
                                                      imagePath(
                                                        "./bankaccount.png"
                                                      ).default
                                                    }
                                                  />
                                                  {
                                                    quick_transfer
                                                      .selectedFundAcntList
                                                      .account.number
                                                  }
                                                  {" "}
                                                  {
                                                    quick_transfer
                                                      .selectedFundAcntList
                                                      .account.ifsc
                                                  }
                                                </span>
                                                <span className="accoount_ifsc_name">
                                                  {" "}
                                                  {
                                                    quick_transfer
                                                      .selectedFundAcntList.name
                                                      .full
                                                  }{" "}
                                                </span>
                                              </label>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                      {quick_transfer.FundAcntList.length < 5 ? (
                                        <div
                                          className="contact_add_item"
                                          onClick={() =>
                                            dispatch(
                                              stateChanges("QUICK_TRANSFER", {
                                                createFundAcnt: true,
                                              })
                                            )
                                          }
                                        >
                                          {" "}
                                          Add a fund account{" "}
                                        </div>
                                      ) : null}
                                    </>
                                  ) : (
                                    <>
                                      {quick_transfer.ShowFundAcntUpiList ? (
                                        quick_transfer.FundAcntUpiList.map(
                                          (upi_list, i) => {
                                            return (
                                              <div
                                                className="col-xs-12 col-md-12 p-l-0"
                                                key={"upi_list" + i}
                                              >
                                                <div className="form-group clearfix">
                                                  <input
                                                    className="radio-check_input"
                                                    type="radio"
                                                    id={"upi_list" + i}
                                                    checked={upi_list.checked}
                                                    onChange={() =>
                                                      changeCheck(
                                                        "FundAcntUpiList",
                                                        i
                                                      )
                                                    }
                                                  />
                                                  <label
                                                    className="radio-check_label"
                                                    for={"upi_list" + i}
                                                  >
                                                    <span className="accoount_bank_name_no">
                                                      <img
                                                        src={
                                                          imagePath(
                                                            "./bankaccount.png"
                                                          ).default
                                                        }
                                                      />
                                                      {upi_list.vpa}
                                                    </span>
                                                  </label>
                                                </div>
                                              </div>
                                            );
                                          }
                                        )
                                      ) : (
                                        <>
                                          <p
                                            className="choose_contact_go_back"
                                            onClick={() =>
                                              dispatch(
                                                stateChanges("QUICK_TRANSFER", {
                                                  ShowFundAcntUpiList: true,
                                                })
                                              )
                                            }
                                          >
                                            Show Lis1t{" "}
                                          </p>
                                          <div className="col-xs-12 col-md-12 p-l-0">
                                            <div className="form-group clearfix">
                                              <input
                                                className="radio-check_input"
                                                type="radio"
                                                id="f-option6"
                                                checked={
                                                  quick_transfer
                                                    .selectedFundAcntUpiList
                                                    .checked
                                                }
                                              />
                                              <label
                                                className="radio-check_label"
                                                for="f-option6"
                                              >
                                                <span className="accoount_bank_name_no">
                                                  <img
                                                    src={
                                                      imagePath(
                                                        "./bankaccount.png"
                                                      ).default
                                                    }
                                                  />
                                                  {
                                                    quick_transfer
                                                      .selectedFundAcntUpiList.vpa
                                                  }
                                                </span>
                                              </label>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                      {quick_transfer.FundAcntUpiList.length <
                                        5 ? (
                                        <div
                                          className="contact_add_item"
                                          onClick={() =>
                                            dispatch(
                                              stateChanges("QUICK_TRANSFER", {
                                                createFundAcnt: true,
                                              })
                                            )
                                          }
                                        >
                                          {" "}
                                          Add a 1fund account{" "}
                                        </div>
                                      ) : null}
                                    </>
                                  )}
                                </div>
                              </>
                            ) : null}
                            {!quick_transfer.createFundAcnt &&
                              <div className="contact_item_button">
                                <a
                                  className="btn btn_new btn-default"
                                  onClick={() =>
                                    dispatch(
                                      stateChanges("QUICK_TRANSFER", {
                                        showContactList: true,
                                        selectContact: false,
                                        showFundList: false,
                                      })
                                    )
                                  }
                                >
                                  {" "}
                                  Back{" "}
                                </a>
                                <a
                                  className="btn btn_new btn-primary"
                                  onClick={selectBeneficiaryAcnt}
                                >
                                  {" "}
                                  Next{" "}
                                </a>
                              </div>
                            }
                          </div>
                        )}
                    </div>
                  )}
                </li>
                <li
                  className={
                    quick_transfer.confirmCreationPayout
                      ? "complete"
                      : "current"
                  }
                >
                  <div className="step_wrap">
                    {" "}
                    Adding payout details{" "}
                    <i className="ico fa fa-check ico-green"> </i>
                  </div>
                  {quick_transfer.addingPayout && quick_transfer.showPayout ? (
                    <div className="payout_popup_wrapper">
                      <div className="contact_add_popup_next">
                        <div className="contact_add_popup_inner">
                          <div className="col-xs-12 col-md-6 p-l-0">
                            <div className="form-group clearfix">
                              <label className="filter_label col-xs-12 p-l-0">
                                {" "}
                                Payout Amount{" "}
                              </label>
                              <div className="col-xs-12 p-0">
                                <div className="input-group">
                                  <span className="input-group-addon"> ₹ </span>
                                  <input
                                    className="fileter_form_input"
                                    placeholder=""
                                    name="payout_amount"
                                    value={quick_transfer.payout_amount}
                                    onChange={handleAmountChange}
                                    type="text"
                                  />
                                </div>
                              </div>
                              <label className="current_balance">
                                {" "}
                                Current Balance : ₹80.00{" "}
                              </label>
                            </div>
                          </div>
                          <div className="col-xs-12 col-md-6 p-r-0">
                            <div className="form-group clearfix">
                              <label className="filter_label col-xs-12 p-l-0">
                                {" "}
                                Payout Purpose{" "}
                              </label>{" "}
                              <div className="col-xs-12 p-0">
                                <input
                                  className="fileter_form_input"
                                  type="text"
                                  name="payout_purpose"
                                  value={quick_transfer.payout_purpose}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="clearfix"></div>
                          <div className="col-xs-12 col-md-6 p-l-0">
                            <div className="form-group clearfix">
                              <label className="filter_label col-xs-12 p-l-0">
                                {" "}
                                Payment Method{" "}
                              </label>
                              {quick_transfer.account_type_list ===
                                "bank_acnt" ? (
                                <>
                                  <div className="col-xs-12 p-0">
                                    <div
                                      className={
                                        quick_transfer.payment_type == "IMPS"
                                          ? "payment_type active"
                                          : "payment_type"
                                      }
                                      onClick={() =>
                                        dispatch(
                                          stateChanges("QUICK_TRANSFER", {
                                            payment_type: "IMPS",
                                          })
                                        )
                                      }
                                    >
                                      IMPS
                                    </div>
                                    <div
                                      className={
                                        quick_transfer.payment_type == "NEFT"
                                          ? "payment_type active"
                                          : "payment_type"
                                      }
                                      onClick={() =>
                                        dispatch(
                                          stateChanges("QUICK_TRANSFER", {
                                            payment_type: "NEFT",
                                          })
                                        )
                                      }
                                    >
                                      NEFT
                                    </div>
                                    <div
                                      className={
                                        quick_transfer.payment_type == "RTGS"
                                          ? "payment_type active"
                                          : "payment_type"
                                      }
                                      onClick={() =>
                                        dispatch(
                                          stateChanges("QUICK_TRANSFER", {
                                            payment_type: "RTGS",
                                          })
                                        )
                                      }
                                    >
                                      RTGS
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="col-xs-12 p-0">
                                  <div
                                    className={
                                      quick_transfer.payment_type == "UPI"
                                        ? "payment_type active"
                                        : "payment_type"
                                    }
                                    onClick={() =>
                                      dispatch(
                                        stateChanges("QUICK_TRANSFER", {
                                          payment_type: "UPI",
                                        })
                                      )
                                    }
                                  >
                                    {" "}
                                    UPI{" "}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="contact_item_button">
                            <a
                              className="btn btn_new btn-default"
                              onClick={() =>
                                dispatch(
                                  stateChanges("QUICK_TRANSFER", {
                                    addingPayout: false,
                                  })
                                )
                              }
                            >
                              {" "}
                              Back{" "}
                            </a>
                            <a
                              className="btn btn_new btn-primary"
                              onClick={addPayout}
                            >
                              {" "}
                              Next{" "}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </li>
                <li className="current">
                  <div className="step_wrap"> Confirm creation of payout </div>
                  {quick_transfer.confirmCreationPayout ? (
                    <div className="payout_popup_wrapper">
                      <div className="contact_add_popup_next">
                        <p className="choose_contact_para">
                          {" "}
                          Review the details and enter Security code for
                          Verification{" "}
                        </p>
                        <div className="contact_add_popup_inner m-b-0">
                          <div className="col-xs-12 p-l-0">
                            <div className="form-group clearfix">
                              <label className="filter_label col-xs-12 p-l-0">
                                {" "}
                                Enter Security Code{" "}
                              </label>
                              <div className="col-xs-12 col-md-6 p-0">
                                <input
                                  className="fileter_form_input"
                                  type="password"
                                  name="payout_verify_otp"
                                  value={quick_transfer.payout_verify_otp}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="contact_item_button">
                            <a
                              className="btn btn_new btn-default"
                              onClick={() =>
                                dispatch(
                                  stateChanges("QUICK_TRANSFER", {
                                    confirmCreationPayout: false,
                                    showPayout: true,
                                  })
                                )
                              }
                            >
                              {" "}
                              Back{" "}
                            </a>
                            <a
                              className="btn btn_new btn-primary"
                              onClick={confirmPayout}
                            >
                              {" "}
                              Create Payout{" "}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Modal>
      {quick_transfer.modalIsOpen && (
        <Modal
          isOpen={quick_transfer.modalIsOpen}
          style={customStyles}
          contentLabel="Assign IP"
        >
          <div
            className="modal-overview"
          >
            <div className="modal-header">
              <button type="button" className="close" onClick={closeModal}>
                {" "}
                &times;{" "}
              </button>
              <h4 className="modal-title">
                {" "}
                Transfer Details - #{
                  quick_transfer.transactionDetails.trans_id
                }{" "}
              </h4>
            </div>
            <div className="modal-body clearfix modal_label_right">
              <div className="col-xs-12 p-0 m-b-15">
                <div className="tab_sub_title width_auto m-0 line_height_38">
                  {" "}
                  Amount -{" "}
                </div>
                <div className="tab_title width_auto m-l-10 m-t-0 line_height_38">
                  {/* {currencyFormatter(
                    Math.round(quick_transfer.transactionDetails.amount * 100) /
                      100,
                    { code: "INR" }
                  )} */}
                  {currencyFormatter(
                    Math.round(
                      quick_transfer.transactionDetails.transaction_amount * 100
                    ) / 100,
                    { code: "INR" }
                  )}
                </div>
              </div>
              <div className="col-xs-12 p-0">
                <p className="account-head"> Payment Information </p>
                <div className="info_title"> UTR Number </div>
                <div className="info_value">
                  {" "}
                  {/* {quick_transfer &&
                    quick_transfer.transactionDetails &&
                    quick_transfer.transactionDetails.internal &&
                    quick_transfer.transactionDetails.internal.Data &&
                    quick_transfer.transactionDetails.internal.Data
                      .TransactionIdentification}{" "} */}
                  {quick_transfer.transactionDetails.utr
                    ? quick_transfer.transactionDetails.utr
                    : "N/A"}
                </div>
                <div className="col-xs-12 col-sm-6 col-md-6 p-0">
                  <div className="info_title"> Purpose </div>
                  <div className="info_value">
                    {" "}
                    {quick_transfer.transactionDetails.remarks
                      ? quick_transfer.transactionDetails.remarks
                      : "N/A"}{" "}
                  </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-md-6 p-0">
                  <div className="info_title"> Reference ID </div>
                  <div className="info_value">
                    {" "}
                    {quick_transfer.transactionDetails.trans_ref}{" "}
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-sm-6 col-md-6 p-0">
                <p className="account-head"> Transaction Information </p>
                <div className="info_title"> Transfer Method </div>
                <div className="info_value">
                  {" "}
                  {quick_transfer.transactionDetails.pay_mode}{" "}
                </div>
                <div className="info_title"> Created By </div>
                <div className="info_value">
                  {" "}
                  {quick_transfer.transactionDetails.merchant &&
                    quick_transfer.transactionDetails.merchant.name}{" "}
                </div>
                <div className="info_title"> Fee + Taxes </div>
                <div className="info_value">
                  {quick_transfer.transactionDetails.commission &&
                    currencyFormatter(
                      Math.round(
                        quick_transfer.transactionDetails.commission.total * 100
                      ) / 100,
                      { code: "INR" }
                    )}
                </div>
              </div>
              <div className="col-xs-12 col-sm-6 col-md-6 p-0">
                <p className="account-head"> &nbsp;</p>
                <div className="info_title"> Amount </div>
                <div className="info_value">
                  {currencyFormatter(
                    Math.round(
                      quick_transfer.transactionDetails.final_amount * 100
                    ) / 100,
                    { code: "INR" }
                  )}
                </div>
                <div className="info_title"> Transaction ID </div>
                <div className="info_value">
                  {" "}
                  {quick_transfer.transactionDetails.trans_id}{" "}
                </div>
                <div className="info_title"> Payout Status </div>
                <div className="info_value">
                  <a
                    className={
                      quick_transfer.transactionDetails.status === "accepted"
                        ? "label label-success label-sm accepted"
                        : quick_transfer.transactionDetails.status === "queued"
                          ? "label label-success label-sm queued"
                          : quick_transfer.transactionDetails.status ===
                            "processing"
                            ? "label label-primary label-sm processing"
                            : quick_transfer.transactionDetails.status === "success"
                              ? "label label-success label-sm success"
                              : quick_transfer.transactionDetails.status === "failed"
                                ? "label label-danger label-sm failed"
                                : quick_transfer.transactionDetails.status ===
                                  "cancelled"
                                  ? "label label-warning label-sm cancelled"
                                  : ""
                    }
                  >
                    {" "}
                    {textCapitalize(
                      quick_transfer.transactionDetails.status
                    )}{" "}
                  </a>
                </div>
              </div>
              <div className="col-xs-12 p-0">
                <p className="account-head"> Payout sent to... </p>
                <div className="col-xs-12 col-sm-6 col-md-6 p-0">
                  <div className="info_title"> Name </div>
                  <div className="info_value">
                    {" "}
                    {quick_transfer.transactionDetails.beneficiary &&
                      textCapitalize(
                        quick_transfer.transactionDetails.beneficiary.name.full
                      )}{" "}
                  </div>
                </div>
                {/* <div className="col-xs-12 col-sm-6 col-md-6 p-0">
                  <div className="info_title"> Contact Type </div>
                  <div className="info_value">
                    {" "}
                    {quick_transfer.transactionDetails.contact &&
                      textCapitalize(
                        quick_transfer.transactionDetails.contact.contact_type
                      )}{" "}
                  </div>
                </div> */}
                <div className="info_title"> Account No </div>
                <div className="info_value">
                  {/* {quick_transfer.transactionDetails.beneficiary &&
                    quick_transfer.transactionDetails.beneficiary.account &&
                    quick_transfer.transactionDetails.beneficiary.account
                      .number} */}
                  {quick_transfer.transactionDetails.beneficiary &&
                    quick_transfer.transactionDetails.beneficiary.account &&
                    quick_transfer.transactionDetails.beneficiary.account.number
                    ? quick_transfer.transactionDetails.beneficiary.account
                      .number
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Payouts;
