import React, { useEffect, useRef, useMemo, useCallback, memo } from "react";
import { currencyFormatter, textCapitalize } from "./../../DataServices/Utils";
import Modal from "react-modal";
const customStyles = {
  overlay: {
    backgroundColor: null,
    position: null,
    inset: null,
  },
  content: {
    top: "50%",
    inset: "50% auto auto 30%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    zIndex: 100,
    padding: 0,
    border: 0,
    width: 700,
  },
};
const TransactionDetail = (props) => {


  return (
    props.isTransDetail && (
      <Modal
        isOpen={props.isTransDetail}
        style={customStyles}
        contentLabel="Assign IP"
      >
        <div id="trans_deatils" className="modal-overview">
          <div className="modal-header">
            <button type="button" className="close" onClick={props.closeModal}>
              &times;
            </button>
            <h4 className="modal-title">
              Transfer Details - #{props.TransactionDetail.trans_id}
            </h4>
          </div>
          <div className="modal-body clearfix modal_label_right">
            <div className="col-xs-12 p-0 m-b-15">
              <div className="tab_sub_title width_auto m-0 line_height_38">
                Amount -{" "}
              </div>
              <div className="tab_title width_auto m-l-10 m-t-0 line_height_38">
                {currencyFormatter(
                  Math.round(props.TransactionDetail.transaction_amount * 100) /
                    100,
                  { code: "INR" }
                )}
              </div>
            </div>
            <p className="account-head">Payment Information</p>
            <div className="col-xs-12 col-sm-6 p-0">
              <div className="info_title">UTR Number</div>
              <div className="info_value">116010645620</div>
              <div className="info_title">Purpose</div>
              <div className="info_value">
                {props.TransactionDetail.remarks
                  ? props.TransactionDetail.remarks
                  : "N/A"}
              </div>
              <div className="info_title">Reference ID</div>
              <div className="info_value">
                {props.TransactionDetail.trans_id}
              </div>
            </div>
            <div className="col-xs-12 col-sm-6 p-0">
              <div className="info_title">Transfer Method</div>
              <div className="info_value">
                {props.TransactionDetail.pay_mode}
              </div>
              <div className="info_title">Created By</div>
              <div className="info_value">
                {props.TransactionDetail.init_src
                  ? props.TransactionDetail.init_src
                  : "API"}
              </div>
              <div className="info_title">Fee + Taxes</div>
              <div className="info_value">
                {currencyFormatter(
                  Math.round(props.TransactionDetail.commission.total * 100) /
                    100,
                  { code: "INR" }
                )}
              </div>
            </div>
            <div className="clr col-xs-12 col-sm-6 p-0">
              <p className="account-head">Transaction Information</p>
              <div className="info_title">Amount</div>
              <div className="info_value">
                {currencyFormatter(
                  Math.round(props.TransactionDetail.final_amount * 100) / 100,
                  { code: "INR" }
                )}
              </div>
              <div className="info_title">Transaction ID</div>
              <div className="info_value">
                {props.TransactionDetail.trans_id}
              </div>
              <div className="info_title">Status</div>
              <div className="info_value">
                {textCapitalize(props.TransactionDetail.status)}
              </div>
            </div>
            <div className="col-xs-12 col-sm-6 p-0">
              <p className="account-head">Payout sent to...</p>
              <div className="info_title">Name</div>
              <div className="info_value">
                {props.TransactionDetail.beneficiary.name.full}
              </div>
              {/* <div className="info_title">Contact Type</div> */}
              {/* <div className="info_value">{textCapitalize(props.TransactionDetail.contact.contact_type)}</div> */}
              {/*  <div className="info_title">Account No</div>
                            <div className="info_value">3813106358</div> */}
            </div>
          </div>
        </div>
      </Modal>
    )
  );
};

export default memo(TransactionDetail);
