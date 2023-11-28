import '../styles/invoiceView.css';
import { invoiceOpenDetails } from '../store/actions/invoice';
import moment from "moment";
import download from "../images/print-icon.svg";
import print from "../images/download-icon.svg";
import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { showError, Toaster, toastError, number, showDate, showDateTime, getShortDateFormat, toFixed } from '../helpers/Utils';
import { useDispatch, useSelector } from 'react-redux';
export default function InvoiceView() {
  const history = useHistory()
  const dispatch = useDispatch();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState(false);
  const [linkValue, setLinkValue] = useState();

  const [state, setState] = useState({
    actual: "",
    discount: "",
    final: "",
    tax: [],
    invoiceNumber: "",
    invoiceType: "",
    isGst: "",
    item: [],
    Totaltax: "",
    heading: "",
    status: "",
    summary: "",
    customerId: "",
    currentPage: 1,
    rate: "",
    priceType: "",
    customerType: "",
    invoiceno: "",
    paid: [{}],
    amountpaid: '',
    amountdue: "",
    date: moment(new Date),
    payMode: "cash",
    notes: "",
    amount: "",
    invoiceId: "",
    due: "",
    invoiceDate: "",
    paymentDate: "",
    address: "",
    partial_payment: "",
    create_gst: "",
    link_value: window.location.protocol + "//" + window.location.hostname + "/invoices/" + params.id,
    // link_value: window.location.href,
    status_invoice: "",
    merchantName: "",
    merchant_billing_line_1: "",
    merchant_billing_line_2: "",
    merchant_billing_zipcode: "",
    merchant_billing_city: "",
    merchant_billing_state: "",
    merchant_shipping_line_1: "",
    merchant_shipping_line_2: "",
    merchant_shipping_zipcode: "",
    merchant_shipping_city: "",
    merchant_shipping_state: "",
    customerName: "",
    customer_billing_line_1: "",
    customer_billing_line_2: "",
    customer_billing_zipcode: "",
    customer_billing_city: "",
    customer_billing_state: "",
    customer_shipping_line_1: "",
    customer_shipping_line_2: "",
    customer_shipping_zipcode: "",
    customer_shipping_city: "",
    customer_shipping_state: "",
    merchant_Check_address: false,
    customer_Check_address: false,
    partialPayment_status: "",
    logo_image: "",
    data: ""

  })
  useEffect(() => {
    handleTable()
  },
    []
  )

  const handleTable = () => {
    dispatch(invoiceOpenDetails(params.id, (result) => {
      
      if (result) {
        let data = result.invoice;
        let customer_billing = data?.customer?.address?.billing || "";
        let customer_shipping = data?.customer?.address?.shipping || "";
        let merchant_billing = data?.merchant?.address?.billing || "";
        let merchant_shipping = data?.merchant?.address?.shipping || "";
        setState({
          ...state,
          actual: toFixed(data.cost.actual),
          discount: toFixed(data.cost.discount),
          final: toFixed(data.cost.final),
          Totaltax: data.cost.tax,
          // invoiceNumber: data.invoice_no,
          // invoiceType: data.invoice_type === "m2b" ? "Business" : "Farmer",
          invoiceType: data.invoice_type,
          // invoiceType: data.invoice_type,

          isGst: data.is_gst === true ? "true" : "false",
          item: data.items,
          tax: data.tax,
          heading: data.heading,
          status: data.status,
          summary: data.summary,
          invoiceno: data.invoice_no,
          customerId: data.customer.id && data.customer.id,
          rate: data.discount.value,
          priceType: data.discount.calculation === "rs" ? "rs" : "%",
          customerType: data.customer.customer_type && data.customer.customer_type,
          amountpaid: toFixed(data.partial_payment.paid && data.partial_payment.paid),
          invoiceId: data.invoice_id,
          amount:toFixed ((data.cost.final && data.cost.final) - (data.partial_payment.paid && data.partial_payment.paid)),
          due: toFixed((data.cost.final && data.cost.final) - (data.partial_payment.paid && data.partial_payment.paid)),
          invoiceDate: data.date ? data.date.issue : "N/A",
          paymentDate: data.date ? data.date.due : "N/A",
          partial_payment: data.partial_payment && data.partial_payment.is_allowed,
          create_gst: data.is_gst,
          status_invoice: data.status,
          merchantName: data?.merchant?.name || "",
          customerName: data?.customer?.name || "",
          customer_billing_line_1: customer_billing?.line_1 || "",
          customer_billing_line_2: customer_billing?.line_2 || "",
          customer_billing_city: customer_billing?.city?.name || "",
          customer_billing_state: customer_billing?.state?.name || "",
          customer_billing_zipcode: customer_billing?.zipcode || "",
          customer_shipping_line_1: customer_shipping?.line_1 || "",
          customer_shipping_line_2: customer_shipping?.line_2 || "",
          customer_shipping_city: customer_shipping?.city?.name || "",
          customer_shipping_state: customer_shipping?.state?.name || "",
          customer_shipping_zipcode: customer_shipping?.zipcode || "",
          merchant_billing_line1: merchant_billing?.line_1 || "",
          merchant_billing_line2: merchant_billing?.line_2 || "",
          merchant_billing_city: merchant_billing?.city?.name || "",
          merchant_billing_state: merchant_billing?.state?.name || "",
          merchant_billing_zipcode: merchant_billing?.zipcode || "",
          merchant_shipping_line1: merchant_shipping?.line_1 || "",
          merchant_shipping_line2: merchant_shipping?.line_2 || "",
          merchant_shipping_city: merchant_shipping?.city?.name || "",
          merchant_shipping_state: merchant_shipping?.state?.name || "",
          merchant_shipping_zipcode: merchant_shipping?.zipcode || "",
          merchant_Check_address: data?.merchant?.address?.is_same_billing || "",
          customer_Check_address: data?.customer?.address?.is_same_billing || "",
          partialPayment_status: data?.partial_payment || "",
          paritalAmount: Math.round(state.amount * 100) / 100,
          logo_image: data?.merchant?.image || ""
        })

        setLinkValue(window.location.protocol + "//pay.ippopay.com" + data.link_url)
        setLoading(true);

      }
    }))
  }

  const { merchantName, status_invoice, merchant_billing_line1, merchant_billing_line2, merchant_billing_city, merchant_billing_zipcode, merchant_billing_state, merchant_shipping_line1, merchant_shipping_line2, merchant_shipping_city, merchant_shipping_zipcode, merchant_shipping_state, customerName,
    customer_billing_line_1, customer_billing_line_2, customer_billing_state, customer_billing_city, customer_billing_zipcode, customer_shipping_line_1, customer_shipping_line_2, customer_shipping_state, customer_shipping_city, customer_shipping_zipcode, data } = state;

  const merchant_address =
    <>
      <div>
        <div className="reciver text-uppercase" style={{ marginTop: '10px' }}>Bill to</div>
        <div className="company_name">{merchantName}</div>
        <div className="bil_to">No. {merchant_billing_line1}</div>
        <div className="bil_to">{merchant_billing_line2}</div>
        <div className="bil_to">{merchant_billing_city} - {merchant_billing_zipcode}</div>
        <div className="bil_to">{merchant_billing_state}</div>
        {/* <div className="bil_to" />
        div className="bil_to">GST - 123456</div> */}
        <>
          {
            state.merchant_Check_address || state.invoiceType === "m2b"
              ?
              ("")
              :
              <div>
                <div className="reciver text-uppercase" style={{ marginTop: '10px' }}>Ship to</div>
                <div className="ship_to">No. {merchant_shipping_line1}</div>
                <div className="ship_to">{merchant_shipping_line2}</div>
                <div className="ship_to">{merchant_shipping_city} - {merchant_shipping_zipcode}</div>
                <div className="ship_to">{merchant_shipping_state}</div>
              </div>
          }
        </>
      </div>
    </>

  const customer_address = <>
    <div className="reciver text-uppercase">Bill to</div>
    <div className="user_name">{customerName}</div>
    <div className="bil_to">{customer_billing_line_1}</div>
    <div className="bil_to">{customer_billing_line_2}</div>
    <div className="bil_to">{customer_billing_city} - {customer_billing_zipcode}</div>
    <div className="bil_to">{customer_billing_state}</div>
    <>
      {
        state.customer_Check_address || state.invoiceType === "f2m"
          ?
          ("")
          :
          <div>
            <div className="reciver text-uppercase" style={{ marginTop: '10px' }}>Ship to</div>
            <div className="ship_to">{customer_shipping_line_1}</div>
            <div className="ship_to">{customer_shipping_line_2}</div>
            <div className="ship_to">{customer_shipping_city} - {customer_shipping_zipcode}</div>
            <div className="ship_to">{customer_shipping_state}</div>
            {/* <div className="ship_to">India</div> */}
          </div>
      }
    </>
  </>

  return (
    <>
      <div id="main_wrapper">
        <div className="ip_payment_section">
          <div className="ipo-section--main-body clearfix" style={{ maxWidth: '1000px', width: '100%' }}>
            <div className="col-jr-8 section-left-wrapper">
              <div className="ipo-section--invoice">
                {state.invoiceType === "f2m"
                  ?
                  <div className='invoice_address_details'>
                    <div className="col-fl-12 ip_invoice_wrapper" style={{ marginBottom: '0px' }}>
                      <div className="col-fl-6 m_view">
                        <div className="userdeat">
                          <div className="bold_title">Invoice</div>
                          <div className="invoice_desc" />
                          <div>{customer_address}</div>
                        </div>

                      </div>
                      <div className="col-fl-6 m_view">
                        <div className="img_align">
                          {state.logo_image !== "" ?
                            <img src="https://ippo-pay.s3.amazonaws.com/5m5vqouFS9_letter-b-logo-power-red_42564-7.jpg" />
                            :
                            ("")
                          }
                        </div>
                      </div>
                    </div>

                    {status_invoice === "partially_paid" &&
                      state.partialPayment_status.paid !== 0 &&
                      state.partialPayment_status.is_allowed
                      ?
                      (
                        <div className="col-jr-12 p-0">
                          <div className="brd_top" />
                          <div className="due_tab">You have made a partial payment of &#x20B9;{(state.amountpaid)} on this invoice.
                            <span className="amt_blanc">Your amount due is <span>&#x20B9; {(state.due)}</span></span>
                          </div>
                        </div>
                      )
                      :
                      ("")
                    }

                    <div className="preview_top_section">
                      <div className="col-jr-5 m_view">
                        <div className="userdeat">
                          <div>{merchant_address}</div>
                        </div>
                      </div>
                      <div className="col-jr-7 m_view invoice_view_details">
                        {data.invoice_no === "" ? null : (
                          <div className="col-jr-12 p-0 mb-10">
                            <div className="col-jr-7 mobile_view_align">
                              <div className="form_label chg_per">Invoice Number :</div>
                            </div>
                            <div className="col-jr-5 mobile_view_align">
                              <div className="bil_to line_height_22">{state.invoiceno}</div>
                            </div>
                          </div>
                        )}
                        <div className="col-jr-12 p-0 mb-10">
                          <div className="col-jr-7 mobile_view_align">
                            <div className="form_label chg_per">Invoice Date :</div>
                          </div>
                          <div className="col-jr-5 mobile_view_align">
                            <div className="bil_to line_height_22">{getShortDateFormat(state.invoiceDate)}</div>
                          </div>
                        </div>
                        <div className="col-jr-12 p-0 mb-10">
                          <div className="col-jr-7 mobile_view_align">
                            <div className="form_label chg_per">Payment Due :</div>
                          </div>
                          <div className="col-jr-5 mobile_view_align pos_image_paid">
                            <div className="bil_to line_height_22">{getShortDateFormat(state.paymentDate)}</div>
                            {status_invoice === "paid" &&
                              <div className="paid_symb"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEoAAAAvCAYAAABE6VyYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTExLTE2VDE2OjUwOjMxKzA1OjMwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTExLTE2VDE2OjUwOjMxKzA1OjMwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0xMS0xNlQxNjo1MDozMSswNTozMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpjYWY1NDg0OC00NGRjLWVjNGItYWQ5NC02NjcxN2E3Y2JmMmMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoyMmRlMjAyMi02NTE3LWU5NDgtODIx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" alt="Logo" /></div>
                            }
                          </div>
                        </div>
                        <div className="col-jr-12 p-0 mb-10">
                          <div className="col-jr-7 mobile_view_align">
                            <div className="form_label chg_per">Amount Due (INR) :</div>
                          </div>
                          <div className="col-jr-5 mobile_view_align">
                            <div className="bil_to line_height_22">&#x20B9; {(state.due)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  :
                  <div className='invoice_address_details'>
                    <div className="col-fl-12 ip_invoice_wrapper" style={{ marginBottom: '0px' }}>
                      <div className="col-fl-6 m_view">
                        <div className="userdeat">
                          <div className="bold_title">Invoice</div>
                          <div className="invoice_desc" />
                          <div>{merchant_address}</div>
                        </div>

                      </div>
                      <div className="col-fl-6 m_view">
                        <div className="img_align"><img src="https://ippo-pay.s3.amazonaws.com/5m5vqouFS9_letter-b-logo-power-red_42564-7.jpg" /></div>
                      </div>
                    </div>

                    {status_invoice === "partially_paid" &&
                      <div className="col-jr-12 p-0">
                        <div className="brd_top" />
                        <div className="due_tab">You have made a partial payment of &#x20B9;{toFixed(state.partialPayment_status.paid)} on this invoice.<span className="amt_blanc">Your amount due is <span>&#x20B9; {(state.due)}</span></span>
                        </div>
                      </div>}

                    <div className="preview_top_section">
                      <div className="col-jr-5 m_view">
                        <div className="userdeat">
                          {customer_address}
                        </div>
                      </div>
                      <div className="col-jr-7 m_view invoice_view_details">
                        <div className="col-jr-12 p-0 mb-10">
                          <div className="col-jr-7 mobile_view_align">
                            <div className="form_label chg_per">Invoice Number :</div>
                          </div>
                          <div className="col-jr-5 mobile_view_align">
                            <div className="bil_to line_height_22">{state.invoiceno}</div>
                          </div>
                        </div>
                        <div className="col-jr-12 p-0 mb-10">
                          <div className="col-jr-7 mobile_view_align">
                            <div className="form_label chg_per">Invoice Date :</div>
                          </div>
                          <div className="col-jr-5 mobile_view_align">
                            <div className="bil_to line_height_22">{getShortDateFormat(state.invoiceDate)}</div>
                          </div>
                        </div>
                        <div className="col-jr-12 p-0 mb-10">
                          <div className="col-jr-7 mobile_view_align">
                            <div className="form_label chg_per">Payment Due :</div>
                          </div>
                          <div className="col-jr-5 mobile_view_align pos_image_paid">
                            <div className="bil_to line_height_22">{getShortDateFormat(state.paymentDate)}</div>
                            {status_invoice === "paid" &&
                              <div className="paid_symb"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEoAAAAvCAYAAABE6VyYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTExLTE2VDE2OjUwOjMxKzA1OjMwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTExLTE2VDE2OjUwOjMxKzA1OjMwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0xMS0xNlQxNjo1MDozMSswNTozMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpjYWY1NDg0OC00NGRjLWVjNGItYWQ5NC02NjcxN2E3Y2JmMmMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoyMmRlMjAyMi02NTE3LWU5NDgtODIx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" alt="Logo" /></div>
                            }
                          </div>
                        </div>
                        <div className="col-jr-12 p-0 mb-10">
                          <div className="col-jr-7 mobile_view_align">
                            <div className="form_label chg_per">Amount Due (INR) :</div>
                          </div>
                          <div className="col-jr-5 mobile_view_align">
                            <div className="bil_to line_height_22">&#x20B9; {(state.due)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                }


                <div className="col-jr-12 p-0 table_m_view">
                  <table className="ref_table invoice_item_table">
                    <thead>
                      <tr className="table_head_blk">
                        <th>
                          <p className="just_lft">Items</p>
                        </th>
                        <th>
                          <p>Rate/Item</p>
                        </th>
                        <th>
                          <p>Quantity</p>
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
                                <p className="tab_bld">{item.name}</p>
                                <p className="tab_lig" />
                              </td>
                              <td>
                                <p className="table_value u-right-align">{item.cost} </p>
                              </td>
                              <td>
                                <p className="table_value">{item.qty}</p>
                              </td>
                              <td>
                                <p className="table_value "> &#x20B9; {toFixed(item.cost * item.qty)}</p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={4}>
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
                              <td colSpan={4}>
                                <p className="table_brd" />
                              </td>
                            </tr>
                          </>
                        )}


                      <tr>
                        <td colSpan={3} className="txt-rig">
                          <p className="table_value">Subtotal</p>
                        </td>
                        <td>
                          <p className="table_value u-right-align">&#x20B9; {(state.actual)}</p>
                        </td>
                      </tr>
                      {state.discount !== 0 ? (

                        <tr>
                          <td colSpan={3} className="txt-rig">
                            <p className="table_value">Discount ({state.rate} {state.priceType})</p>
                          </td>
                          <td>
                            <p className="table_value u-right-align">&#x20B9; {(state.discount)}</p>
                          </td>
                        </tr>
                      )
                        :
                        ("")
                      }

                      {state.tax && state.tax.length > 0 && state.tax.map((item, m) => (

                        <tr key={m}>
                          {item.is_checked && (<td colSpan={3} className="txt-rig">
                            <p className="table_value">{item.name} {"(" + item.percentage + "%)"}</p>
                          </td>)}
                          {item.is_checked && (
                            <td>
                              <p className="table_value u-right-align">&#x20B9; {toFixed(item.value)}</p>
                            </td>
                          )}
                        </tr>
                      ))}

                      {state.partialPayment_status.is_allowed
                        ?
                        (
                          <>
                            <tr>
                              <td colSpan={4}>
                                <p className="table_brd" />
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={3} className="txt-rig">
                                <p className="table_value fnt_align">Total (INR) </p>
                              </td>
                              <td>
                                <p className="table_value fnt_align u-right-align">&#x20B9; {(state.final)}</p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={4} />
                            </tr>
                            <tr>
                              <td colSpan={3} className="txt-rig">
                                <p className="table_value fnt_align" style={{ color: 'rgb(39, 194, 76)' }}>Amount Paid (INR) </p>
                              </td>
                              <td>
                                <p className="table_value fnt_align u-right-align" style={{ color: 'rgb(39, 194, 76)' }}>&#x20B9; {(state.amountpaid)}</p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={4} />
                            </tr>
                            <tr>
                              <td colSpan={3} className="txt-rig">
                                <p className="table_value fnt_align fnt_align_due">Amount Due (INR) </p>
                              </td>
                              <td>
                                <p className="table_value fnt_align u-right-align">&#x20B9; {(state.due)}</p>
                              </td>
                            </tr>
                          </>
                        )
                        :
                        (
                          <>
                            <tr>
                              <td colSpan={4}>
                                <p className="table_brd" />
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={3} className="txt-rig">
                                <p className="table_value fnt_align">Total (INR) </p>
                              </td>
                              <td>
                                <p className="table_value fnt_align u-right-align">&#x20B9; {(state.final)}</p>
                              </td>
                            </tr>
                          </>
                        )}
                    </tbody>
                  </table>
                </div>
                <div className="col-jr-12 p-0">
                  <div className="terms_notes" />
                </div>
              </div>
            </div>

            <div className="section-right-wrapper col-jr-4 stickyPay ip_invoice_right_box">
              {status_invoice === "paid" ? null : (
                <div className="right_wrapper">
                  <div className="col-jr-12 p-0 ">
                    {state.partialPayment_status.is_allowed && state.status_invoice !== "paid" ? (
                      <div className="col-jr-12 p-0">
                        <label className="partial_pay_label">Now make payment in parts!</label>
                        <p className="partial_pay_text">Pay some amount now and remaining later. Just change the amount during checkout and pay.</p>
                        <input name="paritalAmount" className="partial_pay_input" Value={state.paritalAmount} />
                      </div>
                    )
                      :
                      ("")
                    }


                    {state.status_invoice !== "paid" ?
                      (
                        <a className="payment_btn" id="payBtn" onClick={""} style={{ background: 'rgb(0, 51, 102) none repeat scroll 0% 0%' }}>
                          Proceed to Pay{" "}
                          {state.partialPayment_status.is_allowed
                            ?
                            <span>&#x20B9;{state.paritalAmount}</span>
                            :
                            <span>&#x20B9;{state.final}</span>
                          }
                        </a>
                      ) :
                      (
                        <a className="payment_btn" id="payBtn" onClick={""} style={{ background: 'rgb(0, 51, 102) none repeat scroll 0% 0%' }}>
                          Proceed to Pay{" "}
                          {state.partialPayment_status.is_allowed
                            ?
                            <span>&#x20B9;{state.paritalAmount}</span>
                            :
                            <span>&#x20B9; {state.final}</span>
                          }
                        </a>
                      )
                    }
                  </div>
                </div>
              )}
              <div className="right_bottom_wrap">
                <a className="download_btn_new">Download Invoice<img src={download} alt="Logo" /></a>
                <a className="download_btn_new">Print Invoice<img src={print} alt="Logo" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
