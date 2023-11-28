import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from 'react-router-dom';
import { removeCookies, getCookies } from '../helpers/Utils';
import logout from '../images/fi-rr-sign-out-alt.svg';
import Arrow_down from "../images/arrow_down.svg";
import profile from '../images/fi-rr-user.svg';
import Item from '../images/item.png';
// import Profile from '../images/fi-rr-user.svg';
import category from '../images/fi-rr-apps.svg';
import settle from '../images/Settle-2.svg';
import { useDispatch } from "react-redux";
import { removeCookie } from "muthu-plugins";
import { myprofile } from "../store/actions/profile";
import DropdownList from "../components/ui/dropdown";
// import { useState } from "react";

export default function Header(props) {

  const dispatch = useDispatch();
  let history = useHistory();
  let location = useLocation();
  const [name, setName] = useState()

  const logOut = () => {
    removeCookies("token");
    removeCookies("payout_status");
    window.localStorage.clear();
    // window.location.href('/login');
    // history.push('/login');
    window.location.reload();
  }

  useEffect(() => {
    profiles();
  }, [])

  const [route, setRoute] = useState([
    {
      to: "/submerchants",
      src: category,
      name: "Sub Merchants",
    },
    {
      to: "/items",
      src: settle,
      name: "Items",
    },
    {
      to: "/taxes",
      src: Item,
      name: "Taxes",
    },
  ])

  const [payoutStatus, setPayoutStatus] = useState("")
  const profiles = () => {
    dispatch(myprofile((result) => {

      if (result) {
       
        setName(result?.merchant?.name?.full);
        setPayoutStatus(result?.merchant?.payout?.status)
      }
    }))
  }
  return (
    <div
      className="app-header header sticky"
      // style={{ marginBottom: "-74px" }}
    >
      <div className="container-fluid main-container">
        <div className="d-flex">
          <div className="header_title">
            {payoutStatus === "approved" ? (
              <>
                {location.pathname === "/dashboard" && "Dashboard"}
                {location.pathname === "/profile" && "My Profile"}
                {location.pathname === "/profile/edit" && "Profile"}
                {location.pathname.includes("/invoices") && "Invoices"}
                {location.pathname.includes("/taxes") && "Tax"}
                {location.pathname.includes("/submerchants") && "Sub Merchants"}
                {location.pathname.includes("/items") && "Items"}
                {location.pathname.includes("/farmers") && "Farmers"}
                {location.pathname.includes("/businesses") && "Businesses"}
                {location.pathname.includes("/transactions") && "Transactions"}
                {location.pathname.includes("/contacts") && "Contacts"}
                {location.pathname.includes("/payouts") && "Payouts"}
                {location.pathname.includes("/account-statement") && "Account Statement"}
              </>
            ) : (
              <>
                {location.pathname === "/profile" && "My Profile"}
                {location.pathname === "/profile/edit" && "Profile"}
              </>
            )}


          </div>
          <div className="blog_right_header ms-auto">
            <div className="logout_btn dropdown">
              <button
                type="button"
                className="log_btn dropdown-toggle"
                data-toggle="dropdown"
              >
                <span className="ms-3 profie_name">
                  Hi! {name}</span>
                <span>

                </span>
                <span className="ms-3"><img src={Arrow_down} /></span>
              </button>
              <ul className="dropdown-menu log_blck">

                <Link to="/profile" >
                  <li className="profile_icon">
                    <img src={profile} className="profile_image bluecard_img" />
                    <span className="log_col">
                      Profile
                    </span>
                  </li>
                </Link>

                {payoutStatus === "approved" && (
                  <>
                    {route.map((item, i) => (
                      <>

                        <DropdownList key={i} to={item.to} className1="profile_icon" className2="profile_image bluecard_img" className3="log_col" src={item.src} name={item.name} />
                      </>
                    ))}
                  </>
                )}

                <li className="profile_icon" onClick={logOut} style={{ cursor: "pointer" }}>
                  <img src={logout} className="profile_image bluecard_img" />

                  <a className="log_col" href="#">
                    {/* <img src={Logout} /> */}
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* <a
              aria-label="Hide Sidebar"
              className="app-sidebar__toggle"
              data-toggle="sidebar"
              href="#"
            ></a> */}
          {/* <div className="main-header-center ms-3 hidden-xs d-lg-block">
              <input
                className="form-control"
                placeholder="Search for results..."
                type="search"
              />
              <button className="btn px-0 pt-2">
                <i className="fe fe-search" aria-hidden="true"></i>
              </button>
            </div> */}
          {/* <div className="d-flex order-lg-2 ms-auto header-right-icons">
              <a
                aria-label="Hide Sidebar"
                className="app-sidebar__toggle-right"
                data-toggle="sidebar"
                href="#"
              ></a>
            </div> */}
          {/* <div className="d-flex order-lg-2 ms-auto header-right-icons">
            <Link to="/payouts/apikeys" style={{ marginRight: "20px", color: "#303030", fontSize: "14px", lineHeight: "36px" }}>API Keys</Link>
            <Link to="/profile" style={{ marginRight: "20px", color: "#303030", fontSize: "14px", lineHeight: "36px" }}><img src={profile} alt="profile" className="header_img" /> My Profile</Link>
            <a onClick={logOut} style={{ marginRight: "20px", color: "#303030", fontSize: "14px", lineHeight: "36px" }}>
              <img src={logout} alt="logout" className="header_img" style={{ marginRight: 5 }} />

              Logout
            </a>
            </div> */}

          {/* <div className="right-menu">
              <p className="menu-button">
              <span><Link to="/payouts/apikeys" style={{marginRight:"30px",color:"#303030",fontSize:"13px"}}>API Keys</Link></span>
                <img src={profile} alt="profile" className="sidebar_img" />
                <span style={{ marginTop: 2 }}>Profile</span>
              </p>
              <div className="dropdown-menus">
                <Link to="/profile"><img src={profile} alt="profile" className="sidebar_img" /> My Profile</Link>
                <a onClick={logOut}>
                  <img src={logout} alt="logout" className="sidebar_img" style={{ marginRight:16}}/>

                  Logout
                </a>
                
              </div>
            </div> */}
        </div>
      </div>
    </div>
  );
}

