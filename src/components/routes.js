import React, { Component } from "react";
import Dashboard from '../images/Dashboard.svg';
import logout from '../images/fi-rr-sign-out-alt.svg';
import Profile from '../images/fi-rr-user.svg';
import category from '../images/fi-rr-apps.svg';
import biller from '../images/fi-rr-list.svg';
import admin from '../images/Frame 1.svg';
import settle from '../images/Settle-2.svg';
import commission from '../images/Commision .svg';
import Item from '../images/item.png';
import Invoice from '../images/invoice.png';
import Farmer from "../images/farmer.png";
import Business from "../images/business.png";
import { TeamOutlined } from '@ant-design/icons';


const routes=[
    { title: "Dashboard", path: "/dashboard", key: "dashboard", icon:Dashboard},  
    // { title: "Sub Merchants", path: "/submerchants", key: "sub_merchant", icon: Profile },
    { title: "Businesses", path: "/businesses", key: "business", icon: Business },
    { title: "Farmers", path: "/farmers", key: "farmer", icon:Farmer },
    // { title: "Items", path: "/items", key: "item", icon: Item},
    { title: "Invoices", path: "/invoices", key: "invoice", icon: Invoice},

    { title: "Invoices Pending", path: "/invoices-pending", key: "invoicepending", icon: Invoice},
    { title: "Transactions", path: "/transactions", key: "invoice", icon: commission},
    // { title: "Tax", path: "/taxes", key: "taxes", icon: Item},
    { title: "Contacts", path: "/contacts", key: "contacts", icon: category},
    // { title: "Payouts", path: "/payouts", key: "payouts", icon: biller},
    { title: "Transfers", path: "/account-statement", key: "account_statement", icon: settle},
]

export default routes;