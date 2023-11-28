import React, { useState, useEffect } from 'react';
function ApiKeys(props) {
    return (
        <>
            
            <div className="main-content app-content mt-0" >
                <div className="side-app">
                    <div className="container-fluid main-container p-0 ">
                        <div className="container_top">
                            <div className="container_header">
                                <h4 className="container_head">API Keys</h4>
                                <button className="create_btn">+ Regenerate Key</button>
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-12 p-0">
                        <div className="card">
                            <div className="card-body">
                                <div className="col-xs-12 p-0">
                                    <h1 className="sub_heading">API Settings</h1>
                                    <div className="col-xs-6 p-l-0">
                                        <h5 className="control-label">Public Key</h5>
                                        <form className="form-document m-b-15">
                                            <div className="input-group">
                                                <input type="text" className="form-control frm-shadow" defaultValue="f1ab4652-80ed-48f5-97a9-777dcb4587ce" />
                                                <span className="input-group-addon form-refrance"><i className="fa fa-copy" /></span>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="col-xs-6">
                                        <h5 className="control-label">Secret Key</h5>
                                        <form className="form-document m-b-15">
                                            <div className="input-group">
                                                <input type="text" className="form-control frm-shadow" defaultValue="f1ab4652-80ed-48f5-97a9-777dcb4587ce" />
                                                <span className="input-group-addon form-refrance"><i className="fa fa-copy" /></span>
                                            </div>
                                        </form>
                                    </div>
                                    <div className='col-xs-6 p-l-0'>
                                        <h1 className="sub_heading">Whitelisted IPs</h1>
                                        <p className="sub-para light">Configure which IP addresses can access your account.</p>
                                        <div className="col-xs-12 col-md-10 p-0">
                                            <div className="whitelisted_ip_section"> <span className="whitelisted_ip_section_address">192.168.1.1</span> <span className="whitelisted_ip_section_remove"><i className="fa fa-close" /> Delete</span> </div>
                                            <div className="whitelisted_ip_section"> <span className="whitelisted_ip_section_address">192.168.1.2</span> <span className="whitelisted_ip_section_remove"><i className="fa fa-close" /> Delete</span> </div>
                                            <div className="whitelisted_ip_section"> <span className="whitelisted_ip_section_address">192.168.1.3</span> <span className="whitelisted_ip_section_remove"><i className="fa fa-close" /> Delete</span> </div>
                                            <button type="button" className="btn btn-primary pull-right">Add IP Address</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default ApiKeys;