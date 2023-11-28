import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect, HashRouter } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import SubAdmin from "../components/SubAdmin";
import Profile from '../components/profile/index';
import EditProfile from '../components/profile/Edit';
import Business from '../components/business/index';
import BusinessAddEdit from '../components/business/addEdit';
import Farmer from '../components/farmer/index';
import BusinessDetail from "../components/business/detailpage";
import FarmerDetail from "../components/farmer/detailpage";
import Submerchant from "../components/submerchant/index";
import submerchantDetail from "../components/submerchant/detailpage";
import InvoiceItem from "../components/items/index";
import InvoiceItemDetail from "../components/items/detailpage";
import Invoice from "../components/invoices/index";
import Tax from "../components/Tax/taxes";
import InvoiceDetail from "../components/invoices/details";
import AddInvoice from "../components/invoices/edit";
import Transactions from "../components/transaction/index";
import TransDetail from "../components/transaction/details";
import Pagenotfound from "../components/404Page";
import AddEditFarmer from "../components/farmer/AddEditFarmer";
import Contacts from "../components/Contacts/index";
import Payouts from "../components/Payouts/index2";
import AccountStatement from "../components/AccountStatement/index";
import ApiKeys from "../components/Payouts/ApiKeys";
import cookie from "react-cookies";
import InvoicePending from "../components/invoicesPending";
import InvoicependingDetails from "../components/invoicesPending/details";
import InvoicePendingAddEdit from "../components/invoicesPending/edit";

export default function Content() {
  const token = cookie.load("payout_status");
  return (
    <>

      {token === "approved" && token !== undefined && token !== null ? (
        <>
          <Switch>
            <Route path="/login" exact render={() => <Redirect to={"/dashboard"} />} />
            <Route path="/dashboard" exact component={Dashboard} />
            <Route path="/" exact render={() => <Redirect to={"/dashboard"} />} />
            <Route path="/sub_admin" exact component={SubAdmin} />
            <Route path="/submerchants" exact component={Submerchant} />
            <Route path="/submerchants/details/:id" exact component={submerchantDetail} />
            <Route path="/profile" exact component={Profile} />
            <Route path="/profile/edit" exact component={EditProfile} />
            <Route path="/businesses" exact component={Business} />
            <Route path="/businesses/details/:id" exact component={BusinessDetail} />
            <Route path="/businesses/AddEdit/:id" exact component={BusinessAddEdit} />
            <Route path="/businesses/AddEdit" exact component={BusinessAddEdit} />
            <Route path="/farmers/details/:id" exact component={FarmerDetail} />
            <Route path="/farmers/add" exact component={AddEditFarmer} />
            <Route path="/farmers/edit/:id" exact component={AddEditFarmer} />
            <Route path="/farmers" exact component={Farmer} />
            <Route path="/items" exact component={InvoiceItem} />
            <Route path="/items/details/:id" exact component={InvoiceItemDetail} />
            <Route path="/invoices" exact component={Invoice} />
            <Route path="/invoices/details/:id" exact component={InvoiceDetail} />
            <Route path="/invoices/add" exact component={AddInvoice} />
            <Route path="/invoices/edit/:id" exact component={AddInvoice} />
            <Route path="/invoices-pending" exact component={InvoicePending} />
            <Route path="/invoices-pending/details/:id" exact component={InvoicependingDetails} />
            <Route path="/invoices-pending/edit/:id" exact component={InvoicePendingAddEdit} />
            <Route path="/transactions" exact component={Transactions} />
            <Route path="/transactions/details/:id" exact component={TransDetail} />
            <Route path="/taxes" exact component={Tax} />
            <Route path="/contacts" exact component={Contacts} />
            <Route path="/payouts" exact component={Payouts} />
            <Route path="/payouts/apikeys" exact component={ApiKeys}/>
            <Route path="/account-statement" exact component={AccountStatement} />
            <Route component={Pagenotfound} />
          </Switch>
        </>
      ) : (
        <>
          <Switch>
            <Route path="/login" exact render={() => <Redirect to={"/profile"} />} />
            <Route path="/profile" exact component={Profile} />
            <Route path="/profile/edit" exact component={EditProfile} />
            <Route component={Pagenotfound} />
          </Switch>
        </>
      )}


    </>
  );
}



