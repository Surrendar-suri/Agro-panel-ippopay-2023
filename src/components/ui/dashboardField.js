import React from 'react';

const DashboardField = ({active,inactive,suspended,total,activeName,inactiveName,totalTitle,suspendName,name}) => {
    return (
        <>
            <div className="row m-t-24 agro_card">
                <div className="col-xs-6 col-md-12 col-sm-12 col-lg-3">
                    <div className="card overflow-hidden">
                        <div className="card-body">
                            <div className="d-flex">
                                <div className="mt-0">
                                    <h6 className="main-head text-success">{activeName}</h6>
                                    <h2 className="number-font">{active !=="" ? active : 0} <span className='currency_desc'>Active</span></h2>
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
                                    <h6 className="main-head text-danger">{inactiveName}</h6>
                                    <h2 className="number-font">{inactive  !=="" ? inactive : 0} <span className='currency_desc'>Inactive</span></h2>
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

                                    <h6 className="main-head text-warning">{suspendName}</h6>
                                    <h2 className="number-font">{suspended !=="" ? suspended : 0} <span className='currency_desc'>Suspended</span></h2>
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

                                    <h6 className="main-head text-primary">{totalTitle}</h6>
                                    <h2 className="number-font">{total !=="" ? total : 0 } <span className='currency_desc'>{name}</span></h2>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardField;