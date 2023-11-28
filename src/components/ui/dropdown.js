import React from "react";
import { Link } from 'react-router-dom';

const DropdownList = ({ to,src,name, className1, className2,className3 }) => {
    return (

        <>
            <Link to={to} >
                <li className={className1}>
                    <img src={src} className={className2} />
                    <span className={className3}>
                        {name}
                    </span>
                </li>
            </Link>

        </>
    );
};

export default DropdownList;