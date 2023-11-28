import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Redirect, HashRouter, Route } from 'react-router-dom';
import MainRouter from './MainRouter';
import Login from '../components/Login';
import InvoiceView from '../components/InvoiceView';
import isLoggedIn from "../helpers/condition";
class PrivateRouter extends Component {

    render() {
       
        return isLoggedIn() ? (<MainRouter />) : 
        
            // (<Route path="/login" exact component={Login} /> );
            // <Login />
            <Switch>
                {/* <Route path="/" exact render={() => <Redirect to="/login" />} /> */}
                <Route path="/login" exact component={Login} />
                <Route path="/invoice/detail/:id" exact component={InvoiceView} />
                <Route render={() => <Redirect to="/login" />} />
            </Switch>
    }
}


export default PrivateRouter;