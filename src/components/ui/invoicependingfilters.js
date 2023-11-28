import React from "react";
import moment from "moment";
import { Form, Input, Select, DatePicker, Layout, Col, Row, Button } from 'antd';
const { Option } = Select;

const Filter = ({ statusSelect, statusName, searchSelect, searchName, searchInput, searchInputName, fromDate, toDate, fromName, toName, handleOnToChange, handleOnFromChange, searchData, statusData, clearFilter, applyFilter, statusOnChange, searchOnchangeInput, searchOption, }) => {
    const style = { background: '#0092ff', padding: '8px 0' };
    const disabledDate = (current) => {
        return current > moment().endOf("day");
    }

    return (


        <>
            <div className="col-xs-10 p-0">
                    <Input.Group
                        compact
                        style={{ width: "250px", display: "flex" ,float:"left",margin:"10px 0 10px 0"}}
                    >
                        <Select

                            name={searchName}
                            onChange={searchOption}
                            value={searchSelect || undefined}
                            className="filter-status name-select"
                            placeholder="Select By"
                            autoComplete="off"
                            optionFilterProp="children"
                            showSearch
                            removeIcon
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {searchData && searchData.map((search, s) => (
                                <Option key={s} value={search.key} style={{ textTransform: "capitalize" }}>{search.value}</Option>
                            ))}

                        </Select>

                        <Input
                            placeholder="Search"
                            name={searchInputName}
                            value={searchInput}
                            onChange={searchOnchangeInput}
                            autoComplete="off"
                        />

                    </Input.Group>
                    <DatePicker
                        selected={fromDate}
                        dateFormat="MM-dd-yyyy"
                        placeholder="From"
                        name={fromName}
                        id="from"
                        value={fromDate}
                        className="date-filter"

                        style={{ fontWeight: "500", width: "150px", float: "left" ,margin:"10px 0px 10px 15px" }}
                        showYearDropdown
                        showMonthDropdown
                        ariaDescribedBy="basic-addon2"
                        onChange={handleOnFromChange}
                        disabledDate={disabledDate}
                    />

                    <DatePicker
                        selected={toDate}
                        dateFormat="MM-dd-yyyy"
                        placeholder="To"
                        name={toName}
                        id="to"
                        value={toDate}
                        className="date-filter"
                        style={{ fontWeight: "500", width: "150px", float: "left",margin:"10px 15px 10px 15px" }}
                        showYearDropdown
                        showMonthDropdown
                        ariaDescribedBy="basic-addon2"
                        onChange={handleOnToChange}
                        disabledDate={disabledDate}
                    />
                <div className="filter_btn" style={{float: "left", width: "auto",margin:"10px 0 10px 0"}}>
                    <button className="filter-button-color bg-teal" onClick={applyFilter}>Apply</button>
                    <button className="filter-button-color bg-yellow" style={{ marginLeft: "15px" }} onClick={clearFilter}>Clear</button>
                </div>
            </div>

        </>
        // <Row gutter={{
        //     xs: 8,
        //     sm: 16,
        //     md: 24,
        //     lg: 32,
        // }}>
        //     <Col className="group_search" span={6}>
        //         <Row>
        //             <Input.Group
        //                 compact
        //                 style={{ display: "flex" }}
        //             >
        //                 <Select

        //                     name={searchName}
        //                     onChange={searchOption}
        //                     value={searchSelect || undefined}
        //                     className="filter-status"
        //                     placeholder="Select By"
        //                     autoComplete="off"
        //                     optionFilterProp="children"
        //                     showSearch
        //                     filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
        //                 // style={{
        //                 //     width: "300px"
        //                 // }}
        //                 >
        //                     {searchData && searchData.map((search, s) => (
        //                         <Option key={s} value={search.key} style={{ textTransform: "capitalize" }}>{search.value}</Option>
        //                     ))}

        //                 </Select>

        //                 <Input
        //                     placeholder="Search"
        //                     name={searchInputName}
        //                     value={searchInput}
        //                     onChange={searchOnchangeInput}
        //                     autoComplete="off"
        //                 />

        //             </Input.Group>
        //         </Row>
        //     </Col>
        //     <Col span={3}>
        //         <Select
        //             name={statusName}
        //             value={statusSelect || undefined}
        //             onChange={statusOnChange}
        //             className="filter-status"
        //             placeholder="Select By"
        //             autoComplete="off"
        //             optionFilterProp="children"
        //             showSearch
        //             filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
        //         // style={{
        //         //     width: "200px"
        //         // }}
        //         >
        //             {statusData && statusData.map((status, s) => (
        //                 <Option key={s} value={status.key}>{status.value}</Option>

        //             ))}
        //         </Select>
        //     </Col>

        //     <Col span={5} style={{ marginLeft: "60px" }}>

        //         <DatePicker
        //             selected={fromDate}
        //             dateFormat="MM-dd-yyyy"
        //             placeholder="From"
        //             name={fromName}
        //             id="from"
        //             value={fromDate}
        //             className="date-filter"

        //             style={{ fontWeight: "500", margin: "0" }}
        //             showYearDropdown
        //             showMonthDropdown
        //             ariaDescribedBy="basic-addon2"
        //             onChange={handleOnFromChange}
        //         />


        //     </Col>

        //     <Col span={5}>

        //         <DatePicker
        //             selected={toDate}
        //             dateFormat="MM-dd-yyyy"
        //             placeholder="To"
        //             name={toName}
        //             id="to"
        //             value={toDate}
        //             className="date-filter"
        //             style={{ fontWeight: "500", marginLeft: "0px" }}
        //             showYearDropdown
        //             showMonthDropdown
        //             ariaDescribedBy="basic-addon2"
        //             onChange={handleOnToChange}
        //         />

        //     </Col>
        //     <Col className="filter_btn " span={3}>

        //         <Button className="filter-button-color bg-teal" onClick={applyFilter}>Apply</Button>
        //         <Button className="filter-button-color bg-yellow" style={{ marginLeft: "15px" }} onClick={clearFilter}>Clear</Button>

        //     </Col>
        // </Row>
    );
};
export default Filter;