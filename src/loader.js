import React, { Component } from "react";
import Loading from"./images/loader.svg";
export default class loader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
      <>
        
        <div id="ippopay_loading">
            <div className="ippopay_loading_img"><img className="loader_img" src={Loading} width="100"/></div>
        </div>
        
      </>
    );
  }
}