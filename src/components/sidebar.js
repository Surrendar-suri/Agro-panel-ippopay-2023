import React from "react";
import { NavLink} from "react-router-dom";
import ippoPay from "../images/ippoagro.svg";
import { Layout } from 'antd';
import sidebar from "./routes";
import cookie from "react-cookies";
function Dashboard() {

    const token = cookie.load("payout_status");

    return (
        <>

            <div className="jumps-header-prevent" style={{ paddingTop: "74px" }}></div>
            <div className="sticky is-expanded" style={{ marginBottom: "-74px" }}>


                <div className="app-sidebar">
                    <div className="side-header is-expanded">
                        <a className="header-brand1 active" >
                            <img
                                className="header-brand-img light-logo1"
                                src={ippoPay}
                                alt="ippopay"
                            />
                        </a>
                    </div>
                    <div className="main-sidemenu is-expanded" >

                        <ul className="side-menu">
                            {token === "approved" && (
                                <>
                                    {sidebar.map((item, index) => {
                                        return (

                                            <li key={index} >
                                                <NavLink to={item.path} activeClassName={"active_sidebar"}  >

                                                    <img src={item.icon} className="sidebar_img" />
                                                    <span className="side-menu__label">{item.title}</span>
                                                    {/* <i class="angle fe fe-chevron-down"></i> */}
                                                </NavLink>
                                            </li>
                                        )
                                    })}

                                </>
                            )}

                        </ul>
                        <div
                            className="ps__rail-y"
                            style={{ top: "0px", height: "739px", right: "0px" }}
                        >
                            <div
                                className="ps__thumb-y"
                                tabIndex="0"
                                style={{ top: "0px", height: "620px" }}
                            ></div>
                        </div>
                    </div>
                </div>

            </div>

        </>
    );

}
export default Dashboard;