import React from 'react'
import { Result } from "antd";

export default function PageNotFound() {
  return (
    <>
      {/*  */}
      <div className="main-content app-content mt-0" >
        <div className="side-app">
          <div className="container-fluid main-container p-0 ">
            <div className="flex-cen wh-100">
              <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
              />
            </div>
            <div>
            </div>
          </div>
        </div>
      </div>


    </>

  )
}