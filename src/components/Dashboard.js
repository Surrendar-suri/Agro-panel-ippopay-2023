import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import merchantprofile from '../images/fi-rr-user.svg';
import canvasChild from "../images/bluecard_arr.svg";
import { myprofile } from '../store/actions/profile';
import invoice from '../images/invoice.png';
import farmer from "../images/farmer.png";
import business from "../images/business.png";
import coins from "../images/coins.svg";
import commission from '../images/Commision .svg';
import biller from '../images/fi-rr-list.svg';
import Item from '../images/item.png';
import { toFixed, showDateTime } from '../helpers/Utils';
import { Table } from 'antd';
import { transactionList } from '../store/actions/transaction';
import { useDispatch, useSelector } from 'react-redux';
import { dashboardAccountBal, dashboardInvoice, dashboardItems, dashboardList, dashboardTransaction } from "../store/actions/dashboard";

export default function Dashboard(props) {

  const dispatch = useDispatch();
  const transaction = useSelector(state => state.transaction_list.user)

  useEffect(() => {
    profile();
    handleTable();

  }, [])
  const profile = () => {
    let query = "";
    let result;
    let data;
    let id;
  }
  const [state, setState] = useState({
    currentPage: 1,
    pageSize: 10,
    payoutacc_name: "",
    payoutacc_ifsc: "",
    payoutacc_number: "",
  });
  const [bankInfo, setbankInfo] = useState({
    payoutacc_name: "",
    payoutacc_ifsc: "",
    payoutacc_number: "",
  });
  const [submerchantCount, setsubmerchantCount] = useState("")
  const [businessCount, setbusinessCount] = useState("")
  const [farmerCount, setfarmerCount] = useState("")
  const [merchantAccountBal, setmerchantAccountBal] = useState("")
  const [invoiceTotal, setinvoiceTotal] = useState({
    invoiceCount: "",
    invoiceVolume: "",

  });
  const [transactionTotal, settransactionTotal] = useState({
    transactionCount: "",
    transactionVolume: "",

  });

  const [transactionArray, setTransactionArray] = useState([])
  const [itemsTotal, setitemsTotal] = useState({
    itemsCount: "",
  });
  useEffect(() => {
    handleInvoiceDashboard();
    handleItemseDashboard();
    handletransactionDashboard();
    // handlepayoutDashboard();
    handleDashboard();
    profiles();
    handleAccountBal();
  }, []);

  useEffect(() => {
    handleTable();
  }, []);


  const handleTable = () => {
    var queryParams = "?page=" + state.currentPage + "&limit=10";
    // var queryParams =""
    dispatch(transactionList(queryParams, (result) => {
      if (result) {

        setTransactionArray(result.transactions)
      }
    }))
  }
  const profiles = () => {
    dispatch(myprofile((result) => {
      if (result) {
        let data = result?.merchant?.payout?.account ?? "";
        setbankInfo({
          ...bankInfo,
          payoutacc_name: data?.name ?? "-",
          payoutacc_ifsc: data?.ifsc ?? "-",
          payoutacc_number: data?.account_number ?? "-",
        })
      }
    }))
  }
  let locale = {
    emptyText: (
      <span className="empty_data">
        <p>
          Data not found
        </p>

      </span>
    )

  };
  const column = [
    {
      title: "S.No",
      dataIndex: "S.No",
      render: (value, item, index) =>
        <div style={{ paddingLeft: 10 }}>
          {(state.currentPage - 1) * 10 + (index + 1)}
        </div>
    },
    {
      title: "Transaction Id",
      dataIndex: 'trans_id',

    },
    {
      title: "Role",
      dataIndex: "invoice",
      render: (invoice) => (
        <div style={{ textTransform: "capitalize" }}>
          <div >{invoice?.customer?.customer_type ?? "-"}</div>
        </div>
      )

    },
    {
      title: "Customer Name",
      dataIndex: "customer",
      render: (customer) => <>
        <span style={{ textTransform: "capitalize" }}>{customer?.name ?? "-"}</span>
      </>

    },
    {
      title: "Price",
      dataIndex: "cost",

      render: (cost) => (
        <p style={{ margin: 0 }}>&#x20B9; {toFixed(cost.paid)}</p>
      )
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (createdAt) => showDateTime(`${createdAt}`),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status, object) => (
        <div style={{ textTransform: "capitalize" }}>
          {(status === "success" && object?.invoice?.customer?.customer_type?.toString().toLowerCase() === "business") && <div className="badge bg-success-transparent text-success rounded-pill  p-2 px-3">Collected</div>}
          {(status === "success" && object?.invoice?.customer?.customer_type?.toString().toLowerCase() === "farmer") && <div className="badge bg-success-transparent text-success rounded-pill  p-2 px-3">Paid</div>}
          {status === "initiated" && <div className="badge bg-primary-transparent text-primary rounded-pill  p-2 px-3">{status}</div>}
          {status === "failed" && <div className="badge bg-danger-transparent text-danger rounded-pill  p-2 px-3">{status}</div>}
          {status === "paid" && <div className="badge bg-success-transparent text-success rounded-pill  p-2 px-3">{status}</div>}
        </div>
      )
    },
    // {
    //   // className="badge bg-warning-transparent text-warning rounded-pill  p-2 px-3"
    //   title: "Transaction Status",
    //   dataIndex: "transaction_status",
    //   // render: (transaction_status) => transaction_status ? transaction_status: "-",
    //   render: (key, status, index) => (
    //     <div key={index} style={{ textTransform: "capitalize" }}>
    //       {key === "pending" ? <div className="badge bg-warning-transparent text-warning rounded-pill  p-2 px-3">{key}</div> : "-"}


    //     </div>
    //   )
    // },


  ]
  const handleDashboard = () => {
    dispatch(dashboardList((result) => {
      if (result) {

        let data = result?.dashboard_all_summary;

        setsubmerchantCount(data?.sub_merchant_count)
        setbusinessCount(data?.business_count)
        setfarmerCount(data?.farmer_count)
      }
    }));
  }
  const handleInvoiceDashboard = () => {
    dispatch(dashboardInvoice((result) => {
      if (result) {

        let data = result?.invoiceSummary
        setinvoiceTotal({
          ...invoiceTotal,
          invoiceCount: data?.count ?? "0",
          invoiceVolume: data?.value ?? "0",
        });
      }
    }));
  }
  const handleItemseDashboard = () => {
    dispatch(dashboardItems((result) => {
      if (result) {

        let data = result?.dashboard_all_summary
        setitemsTotal({
          ...itemsTotal,
          itemsCount: data?.item_count ?? "0",
        });
      }
    }));
  }
  const handleAccountBal = () => {
    dispatch(dashboardAccountBal((result) => {
      if (result) {

        let data = result?.account?.available_balance ?? "-";

        setmerchantAccountBal(data)
      }
    }));
  }
  const handletransactionDashboard = () => {
    dispatch(dashboardTransaction((result) => {
      if (result) {

        let data = result?.transactionsummary
        settransactionTotal({
          ...transactionTotal,
          transactionCount: data?.count ?? "0",
          transactionVolume: data?.cost ?? "0",

        });
      }
    }));
  }

  // const handlepayoutDashboard = () => {
  //   dispatch(dashboardList((result) => {
  //     if (result) {

  //       let data = result?.dashboard_all_summary
  //       setState({
  //         ...state,

  //       });
  //     }
  //   }));
  // }


  return (
    <>
      {" "}
      {/* <div className="jumps-prevent" style={{ paddingTop: "76px" }}></div> */}
      <div className="main-content app-content mt-0">
        <div className="side-app">
          <div className="container-fluid main-container p-0">
            {/* new Dashboard */}
            {/* Row1-content */}
            <div className="row m-t-15">
              <div className="col-xs-12 p-0">
                <div className="col-xs-5 p-r-20" >
                  <div className="card match-height">
                    <div className="card-body">
                      <h3 className="overview-dashboard ">Account Details</h3>
                      <p className="account-num">{bankInfo.payoutacc_number}</p>
                      <div className="overall_flex">
                        <div className="acc_title">IFSC Code</div>
                        <div className="acc_value">{bankInfo.payoutacc_ifsc}</div>
                      </div>
                      <p className="acc_bal"><span>&#x20B9; </span>{merchantAccountBal}</p>
                    </div>
                    <img className="coin-img" src={coins} />
                  </div>

                </div>
                <div className="col-xs-7 p-l-0">
                  <div className="card match-height">
                    <div className="card-body">
                      <div className="row">
                        <h3 className="overview-dashboard m-b-45 col-xs-12">Overview</h3>
                        <div className="col-xs-3 p-r-0">
                          <div className="overall_flex">
                            <div className="d-flex">
                              <div className="img_frame badge-light-primary">
                                <img className="management_img" src={business} />
                              </div>
                              <div className="mt-0">
                                <h2 className="mb-0 number-font">{businessCount}</h2>
                                <h6 className="main-head">Businesses</h6>
                              </div>
                            </div>

                            {/* <div className="ms-auto">
                              <img className="canvas-filter" src={canvasChild} />
                            </div> */}
                          </div>
                        </div>
                        <div className="col-xs-3 p-r-0">
                          <div className="overall_flex">
                            <div className="img_frame badge-light-info ">
                              <img className="management_img" src={farmer} />
                            </div>

                            <div className="d-flex">
                              <div className="mt-0">
                                <h2 className="mb-0 number-font">{farmerCount}</h2>
                                <h6 className="main-head">Farmers</h6>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xs-3 p-r-0">
                          <div className="overall_flex">
                            <div className="img_frame badge-light-danger">
                              <img className="management_img" src={Item} />
                            </div>
                            <div className="d-flex">
                              <div className="mt-0">
                                <h2 className="mb-0 number-font">{itemsTotal.itemsCount}</h2>
                                <h6 className="main-head">Items</h6>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xs-3 p-r-0">
                          <div className="overall_flex">
                            <div className="img_frame badge-light-success">
                              <img className="management_img" src={merchantprofile} />
                            </div>
                            <div className="d-flex">
                              <div className="mt-0">
                                <h2 className="mb-0 number-font">{submerchantCount}</h2>
                                <h6 className="main-head">SubMerchants</h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <div className="agro_card_table" style={{ paddingRight: "0" }}>
                  <div className="table-header">
                    <h3 className="table-title">Recent Transactions</h3>
                  </div>
                  <div className="card">

                    <div className='card-body'>
                      <Table
                        align="left"
                        className="gx-table-responsive agri_table"
                        columns={column}
                        dataSource={transactionArray}
                        locale={locale}
                        size="middle"
                        pagination={
                          false
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  // }
}
