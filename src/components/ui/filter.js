import React from "react";
import { Form, Input, Select, DatePicker, Layout, Col, Row } from 'antd';
const { Option } = Select;

const Filter = ({ statusSelect, statusName, searchSelect, searchName, searchInput, searchInputName, fromDate, toDate, fromName, toName, handleOnToChange, handleOnFromChange, searchData, statusData, clearFilter, applyFilter, statusOnChange, searchOnchangeInput, searchOption }) => {
    return (

        <Layout>
            <Row>
                <Col span={6}>
                    <Input.Group
                        compact
                        style={{ width: "100%", display: "flex" }}
                    >
                        <Select
                            name={searchName}
                            onChange={searchOption}
                            value={searchSelect || undefined}
                            className="filter-status"
                            placeholder="Select By"
                            autoComplete="off"
                            optionFilterProp="children"
                            showSearch
                            removeIcon
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            style={{
                                width: "300px"
                            }}
                        >
                            {searchData && searchData.map((search, s) => (
                                <Option key={s} value={search.key} style={{ textTransform: "capitalize" }}>{search.value}</Option>
                            ))}

                        </Select>

                        <Input
                            placeholder="Search..."
                            name={searchInputName}
                            value={searchInput}
                            onChange={searchOnchangeInput}
                            autoComplete="off"
                        />

                    </Input.Group>
                </Col>
                <Col span={6}>
                    <Select
                        name={statusName}
                        value={statusSelect || undefined}
                        onChange={statusOnChange}
                        className="filter-status"
                        placeholder="Select By"
                        autoComplete="off"
                        optionFilterProp="children"
                        showSearch
                        removeIcon
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        style={{
                            width: "255px",
                            marginLeft: "40px"
                        }}
                    >
                        {statusData && statusData.map((status, s) => (
                            <Option key={s} value={status.key}>{status.value}</Option>

                        ))}
                    </Select>
                </Col>
                <Col span={4}>
                    <DatePicker
                        selected={fromDate}
                        dateFormat="MM-dd-yyyy"
                        placeholder="From"
                        name={fromName}
                        id="from"
                        value={fromDate}
                        className="date-filter"

                        style={{ fontWeight: "500", margin: "0" }}
                        showYearDropdown
                        showMonthDropdown
                        ariaDescribedBy="basic-addon2"
                        onChange={handleOnFromChange}
                    />
                </Col>
                <Col span={4}>
                    <DatePicker
                        selected={toDate}
                        dateFormat="MM-dd-yyyy"
                        placeholder="To"
                        name={toName}
                        id="to"
                        value={toDate}
                        className="date-filter"
                        style={{ fontWeight: "500", marginLeft: "0px" }}
                        showYearDropdown
                        showMonthDropdown
                        ariaDescribedBy="basic-addon2"
                        onChange={handleOnToChange}
                    />
                </Col>
                <Col span={4}>
                    <button className="filter-button-color bg-teal" onClick={applyFilter}>Apply</button>
                    <button className="filter-button-color bg-yellow" style={{ marginLeft: "15px" }} onClick={clearFilter}>Clear</button>
                </Col>

            </Row>
        </Layout>
    );
};
export default Filter;