import React, { Component } from "react";

export default class SubAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="main-content app-content mt-0">
        <div className="side-app">
          <div className="container-fluid main-container p-0">
            <div className="page-header">
              <h1 className="page-title">Sub Admin</h1>
              <div>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="#">Home</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Sub Admin
                  </li>
                </ol>
              </div>
            </div>
            <div className="card">
              <div className="table-header">
                <h3 className="table-title">Sub Admin List</h3>
                <a href="sub-admin-form.html">
                  <button type="button" className="btn btn-primary">
                    Create Sub Admin
                  </button>
                </a>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered datatable">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>ID</th>
                        <th>Created At</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Surendar</td>
                        <td>9767665765</td>
                        <td>suri@1323</td>
                        <td>
                          <a href="">pxJbwOfGG</a>
                        </td>
                        <td>13-12-2021 5:11 pm</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-success table-btn"
                          >
                            Active
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Balaji</td>
                        <td>9678765765</td>
                        <td>balaji@1323</td>
                        <td>
                          <a href="">ftxbwOfGG</a>
                        </td>
                        <td>19-12-2021 10:11 am</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-danger table-btn"
                          >
                            Deactive
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>Hari</td>
                        <td>8890985765</td>
                        <td>hari@1323</td>
                        <td>
                          <a href="">kqJbwOSTG</a>
                        </td>
                        <td>22-12-2021 1:31 pm</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-success table-btn"
                          >
                            Active
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td>Hari prasad</td>
                        <td>9796567765</td>
                        <td>prasad@1323</td>
                        <td>
                          <a href="">jxHDFOfGG</a>
                        </td>
                        <td>23-12-2021 3:11 pm</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-danger table-btn"
                          >
                            Deactive
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>5</td>
                        <td>Farid</td>
                        <td>9786576765</td>
                        <td>farid@1323</td>
                        <td>
                          <a href="">wxJbwOfGG</a>
                        </td>
                        <td>14-12-2021 6:11 am</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-success table-btn"
                          >
                            Active
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
