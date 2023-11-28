import React from "react";

const Spinner = () => {
    return (

        <>
            
            <div className="main-content app-content mt-0" >
                <div className="side-app">
                    <div className="container-fluid main-container p-0 ">
                        <div className="business_top">
                            <div className="business_header page_header" style={{ display: 'flex', justifyContent: 'center', marginTop: 150 }}>
                                <div className="page-loaders"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Spinner;