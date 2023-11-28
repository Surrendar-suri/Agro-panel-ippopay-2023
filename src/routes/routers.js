import React, { Component } from "react";
import { BrowserRouter as Router} from "react-router-dom";

//Routers
import PrivateRouter from "./privateRouter";
import PublicRouter from "./publicRouter";
import isLoggedIn from "../helpers/condition";

class Routers extends Component {
    
  render = () => {
    return isLoggedIn ? (
      <Router>
        <PrivateRouter />
      </Router>
    ) : (
      <Router>
        <PublicRouter />
      </Router>
    );
    
  };
}

export default Routers;
