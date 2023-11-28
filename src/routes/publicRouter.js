import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, HashRouter } from "react-router-dom";
import InvoiceView from '../components/InvoiceView';
import Login from '../components/Login';
class PublicRouter extends Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        return (
           
                <Switch>

                    <Route path="/" exact render={() => <Redirect to="/login" />} />
                    <Route path="/invoice/detail/:id" exact component={InvoiceView}/>
                    <Route path="/login" exact component={Login} />
                    <Route render={() => <Redirect to="/login" />} />

                </Switch>
            
        );
    };
}

export default PublicRouter;