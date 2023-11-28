import React from "react";
import { Form, Input } from 'antd';

const InputField = ({ name, label, value, placeholder, handleChange, id ,className1,className2}) => {
    return (

        <>
            {id === "password" ? (
                <Form.Item
                    label={label}
                >
                    <Input.Password name={name} placeholder={placeholder} value={value} onChange={handleChange} />
                </Form.Item>

            ) : (
                <Form.Item className={className1} label={label}>
                    <Input name={name} value={value} className={className2} placeholder={placeholder} onChange={handleChange} />
                </Form.Item>
            )
            }

        </>
    );
};
export default InputField;