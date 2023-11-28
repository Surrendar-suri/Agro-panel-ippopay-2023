import React, { useState } from "react";
import { Form, Input, Card, Select } from 'antd';
const { Option } = Select;

const SelectField = ({ name, label, value, placeholder, handleChange,data,className,selectClass }) => {

    return (
        <Form.Item className={className} label={label} >
            {label === "City" ? (
                 <Select
                 value={value}
                 name={name}
                 placeholder={placeholder}
                 optionFilterProp="children"
                 showSearch
                 removeIcon
                 filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                 onChange={handleChange}
                 className={selectClass}
             >
 
                 {data && data.map((city, c) => (
                     <Option
                         key={city.city_id}
                         value={JSON.stringify({
                             name: city.name,
                             city_id: city.city_id,
                         })}>{city.name}</Option>
 
                 ))}
             </Select>
            ):(
                <Select
                value={value}
                name={name}
                placeholder={placeholder}
                optionFilterProp="children"
                showSearch
                removeIcon
                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                onChange={handleChange}
                className={selectClass}

            >

                {data && data.map((state, c) => (
                    <Option
                        key={state.state_id}
                        value={JSON.stringify({
                            name: state.name,
                            state_id: state.state_id,
                        })}>{state.name}</Option>

                ))}
            </Select>
            )}
           
        </Form.Item>
    );
}
export default SelectField;
