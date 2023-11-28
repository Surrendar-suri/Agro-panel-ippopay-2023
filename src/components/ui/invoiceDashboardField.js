import React from 'react';

const InvoiceDashboardField = ({ totalAmount,paidAmount,dueAmount,total }) => {
    return (
        <>
            <div className="row m-t-24 agro_card">
                <div className="col-xs-6 col-md-12 col-sm-12 col-lg-3">
                    <div className="card overflow-hidden">
                        <div className="card-body">
                            <div className="d-flex">
                                <div className="mt-0">
                                    <h6 className="main-head">Total Transactions</h6>
                                    <h2 className="number-font">{totalAmount !== "" ? totalAmount : 0} <span className='currency_desc'>INR</span></h2>
                                </div>{" "}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xs-6 col-md-12 col-sm-12 col-lg-3">
                    <div className="card overflow-hidden">
                        <div className="card-body">
                            <div className="d-flex">
                                <div className="mt-0">

                                    <h6 className="main-head">Paid</h6>
                                    <h2 className="number-font">{paidAmount !== "" ? paidAmount : 0} <span className='currency_desc'>INR</span></h2>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xs-6 col-md-12 col-sm-12 col-lg-3">
                    <div className="card overflow-hidden">
                        <div className="card-body">
                            <div className="d-flex">
                                <div className="mt-0">

                                    <h6 className="main-head">Due</h6>
                                    <h2 className="number-font">{dueAmount !== "" ? dueAmount : 0} <span className='currency_desc'>INR</span></h2>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xs-6 col-md-12 col-sm-12 col-lg-3">
                    <div className="card overflow-hidden">
                        <div className="card-body">
                            <div className="d-flex">
                                <div className="mt-0">

                                    <h6 className="main-head">Total Number of Invoices</h6>
                                    <h2 className="number-font">{total} <span className='currency_desc'>Invoices</span></h2>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InvoiceDashboardField;