import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { imagePath } from "./../../assets/ImagePath";
import { useDispatch, useSelector } from "react-redux";
import { ToastProvider, useToasts } from "react-toast-notifications";
import ApiGateway from "./../../DataServices/DataServices";
import { userConstants } from "./../../constants/ActionTypes";
import {
  validate,
  currencyFormatter,
  returnTimeZoneDate,
  returnZoneDate,
  manipulateString,
  textCapitalize,
} from "./../../DataServices/Utils";
import { isInvalidEmail, isInvalidName, number, specialChars, uppercase, lowercase, toastError, toastSuccess, Toaster, passwordValidations, showDate, getIsoString, showError, showSuccess } from '../../helpers/Utils';
import Pagination from "rc-pagination";
import Select from "react-select";
import { DateRange } from "react-date-range";
import moment from "moment";
import TransactionDetail from "./TransactionDetail";

const AccountStatement = () => {
  const { account_statement } = useSelector((state) => state);
  const dispatch = useDispatch();

  console.log("account_statement", account_statement);

  /* const { addToast } = useToasts();
  const applyToast = (msg, type) => {
    return addToast(msg, { appearance: type });
  }; */

  const latestValue = useRef({});

  latestValue.current = account_statement;

  const updateState = (actionType, value) => (dispatch) => {
    dispatch({ type: actionType, payload: value });
    return Promise.resolve();
  };

  useEffect(() => {
    getTransactionList();
  }, [
    account_statement.page,
    account_statement.trans_type,
    account_statement.pay_mode,
    account_statement.contact_type,
    account_statement.selection,
    account_statement.fromDate,
    account_statement.filterList,
  ]);

  const getTransactionList = () => {
    var queryParam = "";
    queryParam +=
      !account_statement.trans_type || account_statement.trans_type === "all"
        ? ""
        : `&trans_type=${account_statement.trans_type}`;
    queryParam += !account_statement.pay_mode
      ? ""
      : `&pay_mode=${account_statement.pay_mode}`;
    queryParam += !account_statement.contact_type
      ? ""
      : `&contact_type=${account_statement.contact_type}`;
    queryParam +=
      account_statement.fromDate === ""
        ? ""
        : "&from_date=" + account_statement.fromDate;
    queryParam +=
      account_statement.toDate === ""
        ? ""
        : "&to_date=" + account_statement.toDate;
    queryParam += !account_statement.selection
      ? ""
      : `&selection=${account_statement.selection}`;
    queryParam += account_statement.searchTerm
      ? "&search_term=" + account_statement.searchTerm
      : "";
    queryParam +=
      account_statement[account_statement.search_type] === undefined ||
        account_statement[account_statement.search_type] === ""
        ? ""
        : `&${account_statement.search_type}=` +
        account_statement[account_statement.search_type];
    ApiGateway.get(
      `/transaction/list?page=${account_statement.page}&limit=${account_statement.limit}${queryParam}`,
      function (response) {
        if (response.success) {
          dispatch(
            updateState(userConstants.ACCOUNT_STATEMENT, {
              TransactionList: response.data.transaction,
              totalPage: response.data.total,
            })
          );
        }
      }
    );
  };

  const onChange = (page) => {
    dispatch(updateState(userConstants.ACCOUNT_STATEMENT, { page }));
  };

  const dateChange = (dates) => {
    dispatch(
      updateState(userConstants.ACCOUNT_STATEMENT, {
        startDate: dates.selection.startDate,
        endDate: dates.selection.endDate,
      })
    ).then(() => {
      const account_statement = latestValue.current;
      console.log("account_statement account_statement", account_statement);
      if (account_statement.endDate > account_statement.startDate) {
        dispatch(
          updateState(userConstants.ACCOUNT_STATEMENT, {
            from: moment(account_statement.startDate).format("DD/MM/YYYY"),
            to: moment(account_statement.endDate).format("DD/MM/YYYY"),
            fromDate: moment(account_statement.startDate)
              .startOf("day")
              .utc()
              .toISOString(),
            toDate: moment(account_statement.endDate)
              .startOf("day")
              .utc()
              .toISOString(),
            open_picker: false,
          })
        );
      }
    });
  };

  const selectFilter = (filter, e) => {
    console.log("filter", filter);
    console.log("e", e);
    let str = manipulateString(filter);
    dispatch(
      updateState(userConstants.ACCOUNT_STATEMENT, {
        [filter]: e.value,
        [str]: e,
        searchTerm:
          "filter" === "search_type" ? "" : account_statement.searchTerm,
      })
    );
  };

  const handleSearchChange = (e) => {
    var name = e.target.name;
    var value = e.target.value;
    dispatch(updateState(userConstants.ACCOUNT_STATEMENT, { [name]: value }));
  };

  const showFilterList = () => {
    if (
      account_statement.searchTerm !== "" ||
      (account_statement[account_statement.search_type] !== undefined &&
        account_statement[account_statement.search_type] !== "")
    ) {
      dispatch(
        updateState(userConstants.ACCOUNT_STATEMENT, { filterList: true })
      );
    }
  };

  const openDetail = (trans_id) => {
    ApiGateway.get(
      `/transaction/detail?trans_id=${trans_id}`,
      function (response) {
        if (response.success) {
          console.log("respone response", response);
          dispatch(
            updateState(userConstants.ACCOUNT_STATEMENT, {
              TransactionDetail: response.data.transaction,
              isTransDetail: true,
            })
          );
        }
      }
    );
  };

  const Trans_type = [
    { value: "all", label: "All" },
    { value: "credit", label: "Credits" },
    { value: "debit", label: "Debits" },
  ];

  const Pay_mode = [
    { value: "imps", label: "IMPS" },
    { value: "rtgs", label: "RTGS" },
    { value: "neft", label: "NEFT" },
    { value: "upi", label: "UPI" },
  ];

  const Contact_type = [
    { value: "customer", label: "Customer" },
    { value: "merchant", label: "Merchant" },
    { value: "employee", label: "Employee" },
    { value: "vendor", label: "Vendor" },
    { value: "supplier", label: "Supplier" },
  ];

  const Duration_Filter = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "3month", label: "Last 3 Months" },
    { value: "6month", label: "Last 6 Months" },
    { value: "year", label: "Last year" },
  ];

  const Id_Filter = [
    { value: "payout_id", label: "Payout ID" },
    { value: "transaction_id", label: "Transaction ID" },
    { value: "reversal_id", label: "Reversal ID" },
    { value: "fund_account_id", label: "Fund Account ID" },
    { value: "batch_id", label: "Batch ID" },
    { value: "contact_id", label: "Contact ID" },
    { value: "email", label: "Contact Email" },
    { value: "mobile.national_number", label: "Contact Phone" },
    { value: "name.full", label: "Contact Name" },
    { value: "utr", label: "UTR" },
  ];

  const selectionRange = {
    startDate: account_statement.startDate,
    endDate: account_statement.endDate,
    key: "selection",
  };

  const memoizedValue = useMemo(() => {
    return {
      isTransDetail: account_statement.isTransDetail,
      TransactionDetail: account_statement.TransactionDetail,
    };
  }, [account_statement.TransactionDetail, account_statement.isTransDetail]);

  const closeModal = useCallback(() => {
    dispatch(
      updateState(userConstants.ACCOUNT_STATEMENT, {
        isTransDetail: false,
        TransactionDetail: {},
      })
    );
  }, []);

  const resetFilter = () => {
    let account_statement_copy = account_statement;
    console.log("account_statement_copy console", account_statement_copy);
    if (account_statement_copy.trans_type) {
      delete account_statement_copy.trans_type;
      delete account_statement_copy.TransType;
    }
    if (account_statement_copy.pay_mode) {
      delete account_statement_copy.pay_mode;
      delete account_statement_copy.PayMode;
    }
    if (account_statement_copy.contact_type) {
      delete account_statement_copy.contact_type;
      delete account_statement_copy.ContactType;
    }
    if (account_statement_copy.from) {
      account_statement_copy.startDate = new Date();
      account_statement_copy.endDate = new Date();
      account_statement_copy.from = "";
      account_statement_copy.to = "";
      account_statement_copy.fromDate = "";
      account_statement_copy.toDate = "";
    }
    if (account_statement_copy.selection) {
      delete account_statement_copy.selection;
      delete account_statement_copy.Selection;
    }
    if (account_statement_copy.searchTerm) {
      delete account_statement_copy.searchTerm;
      account_statement_copy.searchTerm = "";
    }
    if (account_statement_copy.search_type) {
      delete account_statement_copy[account_statement_copy.search_type];
      delete account_statement_copy.SearchType;
      account_statement_copy.search_type = "";
    }
    console.log("account_statement_copy", account_statement_copy);
    dispatch(
      updateState(userConstants.ACCOUNT_STATEMENT, {
        ...account_statement_copy,
      })
    );
  };

  return (
    <>
      <Toaster />
      <div className="content_wrapper">
        {/* <div className="jumps-prevent" style={{ paddingTop: 74 }}></div> */}

        <div className="main-content app-content mt-0">
          <div className="side-app">
            <div className="container-fluid main-container p-0 ">
              <div className="business_top">
                <div className="business_header">
                  {/* <h4 className="business_head">Account Statement</h4> */}

                </div>
                <div className="farmer_filter col-xs-12 m-b-30 p-0">
                  <div className="col-md-6 p-l-0">
                    <div className="payout_popup_search">
                      <div className="input-group">
                        <input
                          className="payout_popup_search_input"
                          type="text"
                          name={account_statement.search_type || "searchTerm"}
                          value={
                            account_statement[account_statement.search_type] ||
                            account_statement.searchTerm
                          }
                          onChange={handleSearchChange}
                        />
                        <div className="payout_popup_search_select">
                          <Select
                            className="selectpicker"
                            options={Id_Filter}
                            value={
                              account_statement.SearchType !== undefined &&
                              account_statement.SearchType
                            }
                            onChange={(e) => {
                              selectFilter("search_type", e);
                            }}
                          />
                        </div>
                        <span
                          className="input-group-addon"
                          onClick={showFilterList}
                        >
                          <i className="fa fa-search"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-xs-12 col-md-2 p-l-0">
                    <Select
                      className="selectpicker"
                      options={Trans_type}
                      onChange={(e) => selectFilter("trans_type", e)}
                      value={
                        account_statement.TransType !== undefined &&
                        account_statement.TransType
                      }
                    />
                  </div>
                  <div className="col-xs-12 col-md-2 p-0">
                    <Select
                      className="selectpicker"
                      options={Pay_mode}
                      onChange={(e) => selectFilter("pay_mode", e)}
                      value={
                        account_statement.PayMode !== undefined &&
                        account_statement.PayMode
                      }
                    />
                  </div>
                  <div className="col-xs-12 col-md-2 p-r-0">
                    <Select
                      className="selectpicker"
                      options={Contact_type}
                      onChange={(e) => selectFilter("contact_type", e)}
                      value={
                        account_statement.ContactType !== undefined &&
                        account_statement.ContactType
                      }
                    />
                  </div>
                </div>
                <div className="col-xs-12 p-0 m-b-30">
                  <label className="filter_label p-l-0">Dates</label>
                  {account_statement.open_picker === false ? (
                    <div className="col-xs-12 col-md-2 p-0">
                      <input
                        className="fileter_form_input"
                        id="from_date"
                        name="date"
                        placeholder=""
                        type="text"
                        onClick={() =>
                          dispatch(
                            updateState(userConstants.ACCOUNT_STATEMENT, {
                              open_picker: !account_statement.open_picker,
                            })
                          )
                        }
                        value={
                          account_statement.from !== ""
                            ? `${account_statement.from} ~ ${account_statement.to}`
                            : ""
                        }
                      />
                    </div>
                  ) : (
                    <DateRange
                      months={2}
                      ranges={[selectionRange]}
                      onChange={(e) => dateChange(e)}
                      direction="horizontal"
                      maxDate={new Date()}
                      showMonthAndYearPickers={false}
                      showSelectionPreview={true}
                      moveRangeOnFirstSelection={false}
                      showPreview={false}
                      showDateDisplay={false}
                    />
                  )}
                  {/* <label className="filter_label pad_center">to</label> 
                                <div className="col-xs-12 col-md-2 p-0">
                                    <input className="fileter_form_input" id="from_date" name="date" placeholder="" type="text"/>
                                </div> */}
                  <div className="col-xs-12 col-md-2 p-r-0">
                    <Select
                      className="selectpicker"
                      options={Duration_Filter}
                      onChange={(e) => selectFilter("selection", e)}
                      value={
                        account_statement.Selection !== undefined &&
                        account_statement.ContactType
                      }
                    />
                  </div>
                  {/* <div className="col-xs-12 col-md-2 p-r-0">
                                    <select className="selectpicker" title="Source">
                                        <option>Payout</option>
                                        <option>Payout Reversal</option>
                                        <option>Adjustment</option>
                                        <option>Bank Transfer</option>
                                        <option>Fund Account Validation</option>
                                    </select>
                                </div> */}
                  <a className="btn btn-default m-l-15" onClick={resetFilter}>
                    Reset
                  </a>
                  <a
                    className="btn btn-primary m-l-15"
                    data-toggle="modal"
                    data-target="#export_modal"
                  >
                    Export
                  </a>
                </div>
                <div className="col-xs-12 p-0 agro_card_table ">
                  <div className="card">
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table agri_table">
                          <thead>
                            <tr>
                              <th>S.No</th>
                              <th>ID</th>
                              <th>Transaction Time</th>
                              <th>Source</th>
                              <th>Payment Mode</th>
                              <th>Amount</th>
                              <th>Contact</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {account_statement.TransactionList.map((list, i) => {
                              return (
                                <tr key={"list" + i}>
                                  <td>{i + 1}</td>
                                  <td>
                                    <a
                                      className="link"
                                      data-toggle="modal"
                                      onClick={() => openDetail(list.trans_id)}
                                    >
                                      {list.trans_id}
                                    </a>
                                  </td>
                                  <td>{returnTimeZoneDate(list.createdAt)}</td>
                                  <td>{list.trans_type}</td>
                                  <td>{list.pay_mode}</td>
                                  <td>
                                    {currencyFormatter(
                                      Math.round(list.transaction_amount * 100) / 100,
                                      { code: "INR" }
                                    )}
                                  </td>
                                  <td>
                                    {list.beneficiary && list.beneficiary.name.full
                                      ? list.beneficiary.name.full
                                      : "N/A"}
                                  </td>
                                  <td>{textCapitalize(list.status)}</td>
                                  <td>
                                    <a
                                      className="btn btn-xs btn-info"
                                      onClick={() => openDetail(list.trans_id)}
                                    >
                                      View
                                    </a>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {account_statement.totalPage !== 0 &&
                    account_statement.totalPage >= 10 ? (
                    <Pagination
                      onChange={onChange}
                      current={account_statement.page}
                      total={account_statement.totalPage}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TransactionDetail /*isTransDetail={account_statement.isTransDetail} trans_id={account_statement.trans_id}*/
        {...memoizedValue}
        closeModal={closeModal}
      />
    </>
  );
};

export default AccountStatement;
