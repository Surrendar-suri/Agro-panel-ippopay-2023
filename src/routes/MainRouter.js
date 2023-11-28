
import Sidebar from "../components/sidebar";
import Header from "../components/Header";
import Content from "./Content";
import { Layout } from 'antd';
import { BrowserRouter as Router, Switch, Redirect, HashRouter, Route } from 'react-router-dom';

// const { Header, Footer, Sider, Content } = Layout;
import cookie from "react-cookies";
import Profile from '../components/profile/index';
import EditProfile from '../components/profile/Edit';

function MainRouter() {
  let token = cookie.load("payout_status");

  return (
    // <Layout>

    <div className="ip-bbps-page">
      <div className="ip-page-main">
        <Header />
        <Sidebar />
        {/* {token === "approved" && token !== undefined && token !== null ? (<Content />) :
          <Switch>
            <Route path="/profile" exact component={Profile} />
            <Route render={() => <Redirect to="/profile" />} />
            <Route path="/profile/edit" exact component={EditProfile} />
          </Switch>} */}
          <Content />
      </div>
    </div>
    // </Layout>
  );
}

export default MainRouter;
