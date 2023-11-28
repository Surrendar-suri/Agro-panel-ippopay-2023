import React, { useState, useEffect } from 'react';
import { Form, Input, Card, Select } from 'antd';
import { useParams, useHistory, } from 'react-router-dom';
import ApiCall from "../../helpers/apicall";
import { useDispatch } from 'react-redux';
import { isInvalidName, toastError, toastSuccess, Toaster } from '../../helpers/Utils';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

// import  phone_icon from "../../images/"
import { myprofile, addProfile } from "../../store/actions/profile";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/selectField";


function BusinessDetail() {
    const { TextArea } = Input;
    const history = useHistory()
    const dispatch = useDispatch();
    const params = useParams();
    const { Option } = Select;
    const file = document.getElementById('upload');
    const [state, setState] = useState({
        name: "",
        email: "",
        phone: "",
        bill_add_1: "",
        bill_zipcode: "",
        bill_city: "",
        bill_state: "",
        bill_country: "",
        ship_add_1: "",
        ship_zipcode: "",
        ship_city: "",
        ship_state: "",
        ship_country: "",
        checkbox: true,
        merchant_id: "",
    })
    let [loading, setLoading] = useState(false);
    const [verifyModal, setVerifyModal] = useState(false);
    const [verifyPhoneNumber, setVerifyPhoneNumber] = useState(false);
    const [data, setData] = useState('');
    const [stateName, setStateName] = useState([]);
    const [cityName, setCityName] = useState([]);


    useEffect(() => {
        profiles();
        cityList();
        stateList();
    }, [])

    const profiles = () => {
        dispatch(myprofile((result) => {
            
            if (result) {
                setData(result?.merchant);


                var data = result?.merchant;
                let billing = data?.address?.billing;
                let shipping = data?.address?.shipping;
                let address = data?.address;
                let check = address?.is_same_billing === false;

                setState({
                    ...state,
                    name: data?.name?.full ?? '',

                    bill_add_1: billing?.line_1 ?? '',
                    bill_add_2: billing?.line_2 ?? '',
                    bill_zipcode: billing?.zipcode ?? '',
                    bill_city: billing?.city?.name ?? '',
                    bill_state: billing?.state?.name ?? '',
                    bill_country: billing?.country?.name ?? '',
                    checkbox: address?.is_same_billing ?? '',
                    ship_add_1: check && (shipping?.line_1) || '',
                    ship_add_2: check && (shipping?.line_2) || '',
                    ship_zipcode: check && (shipping?.zipcode) || '',
                    ship_city: check && (shipping?.city?.name) || '',
                    ship_state: check && (shipping?.state?.name) || '',
                    ship_country: check && (shipping?.country?.name) || '',
                    merchant_id: data.merchant_id,
                    business_id: data.business_id,
                })
                setLoading(true);

            }
        }))
    }

    const checkOnchange = (event) => {
        setState({ ...state, checkbox: event.target.checked })
    }

    const back = () => {

        history.push('/profile');

    }

    const antIcon = (
        <LoadingOutlined
            style={{
                fontSize: 24,
            }}
            spin
        />
    );

    const handleChange = (e) => {
        setState(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))

        // setState({ ...state, bill_state: e.target.value })

    }
    const handleChangeCountry = (e) => {
        // setState(prevState => ({
        //     ...prevState,
        //     [e.target.name]: e.target.value
        // }))
        setState({ ...state, bill_country: e })
    }

    const handleStateChange = (e) => {
        setState({ ...state, bill_state: e })

    }

    const handleChangeNumber = (e) => {
        let REGEX = /^\d+$/;
        if (e.target.value === "" || REGEX.test(e.target.value)) {
            setState(prevState => ({
                ...prevState,
                [e.target.name]: e.target.value
            }))
        }
    }
    const stateList = () => {
        ApiCall.get('properties/state/list', (response) => {
            if (response.success) {
               
                setStateName(response?.data?.states)
            }
        })
    }

    const cityList = () => {
        ApiCall.get('properties/city/list', (response) => {
            if (response.success) {
              
                setCityName(response?.data?.cities)
            }
        })
    }
    const updateProfile = () => {
        const { name, email, phone, business_owner, bill_add_1, bill_add_2, bill_zipcode, bill_city, bill_state, bill_country, ship_add_1, ship_add_2, ship_zipcode, ship_city, ship_state, ship_country, checkbox } = state;

        if (name === "" || name === null) {
            toastError("Please enter the name");
        } else if (name.length < 3) {
            toastError("Please enter the name minimum 3 characters");
        } else if (isInvalidName(name)) {
            toastError("Please enter the name in alphabets only");
        }
        else if (bill_add_1 === "" || bill_add_1 === null) {
            toastError("Please enter the billing address")
        } else if (bill_zipcode === "" || bill_zipcode === null) {
            toastError("Please enter the billing zipcode")
        } else if (bill_city === "" || bill_city === null) {
            toastError("Please select the billing city")
        }


        else if (bill_state === "" || bill_state === null) {
            toastError("Please select the billing state")
        }
    
        else if (!checkbox && (ship_add_1 === "" || ship_add_1 === null)) {
            toastError("Please enter the shipping addresss")
        }
        else if (!checkbox && (ship_zipcode === "" || ship_zipcode === null)) {
            toastError("Please enter the shipping zipcode")
        }

        else if (!checkbox && (ship_city === "" || ship_city === null)) {
            toastError("Please select the shipping city")
        }

        else if (!checkbox && (ship_state === "" || ship_state === null)) {
            toastError("Please select the shipping state")
        }
       
        else {
            let billing = {
                line_1: bill_add_1,
                zipcode: bill_zipcode,
                city: {
                    name: bill_city
                },
                state: {
                    name: bill_state
                },
                country: {
                    name: bill_country
                }

            }

            let shipping = {
                line_1: ship_add_1,

                zipcode: ship_zipcode,
                city: {
                    name: ship_city
                },
                state: {
                    name: ship_state
                },
                country: {
                    name: ship_country
                }

            }

            let shipping_same = {
                line_1: bill_add_1,
                zipcode: bill_zipcode,
                city: {
                    name: bill_city
                },
                state: {
                    name: bill_state
                },
                country: {
                    name: bill_country
                }


            }

            let data = {
                name: {
                    full: name,
                },
                address: {
                    billing,
                    is_same_billing: checkbox,
                    shipping: checkbox ? billing : shipping,
                }
            }

            

            dispatch(addProfile(data, (result) => {
                if (result) {
                    setTimeout(() => {
                        history.push(`/profile`)

                    },1000)
                    
                }
                
            }))

        }
    }


    const handleSelectChange = (selectedValue) => {
        setCityName({
            ...cityName,
            selectedValue: selectedValue
        });
    }

    function onSelectChange(event) {
       
    }
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );


   
    return (<>

        <>
            <Toaster />
            
            <div className="main-content app-content mt-0" >
                <div className="side-app">
                    <div className="container-fluid main-container p-0 ">
                        <div className="business_top">
                            <div className="business_top agro_card">
                                <Card>
                                    <Form
                                        name="basic"
                                        layout="vertical"

                                        initialValues={{ remember: true }}
                                        autoComplete="off">
                                        <div className="flex" style={{ marginTop: 10 }}>

                                            <InputField name="name" value={state.name} label="Name" placeholder="Business Owner Name" handleChange={handleChange} className1="business_form_input ant-form-item-required" className2="business_input"/>

                                            <InputField name="bill_add_1" value={state.bill_add_1} label="Address" placeholder="Enter Billing Address" handleChange={handleChange} className1="business_form_input ant-form-item-required" className2="business_input" />

                                        </div>
                                        <div className="flex">

                                            <InputField name="bill_zipcode" value={state.bill_zipcode} label="Zip Code" placeholder="Billing Zipcode" handleChange={handleChangeNumber} className1="business_form_input ant-form-item-required" className2="business_input" />

                                            <SelectField value={state.bill_city || undefined} name="bill_city"
                                                placeholder="Select By" handleChange={(value) => {
                                                    setState({
                                                        ...state,
                                                        bill_city: JSON.parse(value).name,
                                                    });
                                                }} data={cityName} label="City" className="business_form_input ant-form-item-required" selectClass="city_select" />

                                        </div>

                                        <div className="flex" style={{width:"96%"}}>

                                            <SelectField value={state.bill_state || undefined} name="bill_state"
                                                placeholder="Select By" handleChange={(value) => {
                                                    setState({
                                                        ...state,
                                                        bill_state: JSON.parse(value).name,
                                                    });
                                                }} data={stateName} label="State"  className="business_form_input ant-form-item-required" selectClass="city_select" />

                                        </div>

                                        <div className="business_check">
                                            <input type="checkbox" name="check" checked={state.checkbox}
                                                style={{ marginRight: 10 }}

                                                onChange={checkOnchange}
                                            />  Same as billing address
                                        </div>

                                        {state.checkbox ? ("") : (
                                            <>
                                                <div className="flex">

                                                    <InputField name="ship_add_1" value={state.ship_add_1} label="Address" placeholder="Enter Shipping Address" handleChange={handleChange} className1="business_form_input ant-form-item-required" className2="business_input"/>

                                                    <InputField name="ship_zipcode" value={state.ship_zipcode} label="Zip Code" placeholder="Shipping Zipcode" handleChange={handleChangeNumber} className1="business_form_input ant-form-item-required" className2="business_input" />


                                                </div>

                                                <div className="flex">

                                                    <SelectField value={state.ship_city || undefined} name="ship_city"
                                                        placeholder="Select By" handleChange={(value) => {
                                                            setState({
                                                                ...state,
                                                                ship_city: JSON.parse(value).name,
                                                            });
                                                        }} data={cityName} label="City" className="business_form_input ant-form-item-required" selectClass="city_select"/>

                                                    <SelectField value={state.ship_state || undefined} name="ship_state"
                                                        placeholder="Select By" handleChange={(value) => {
                                                            setState({
                                                                ...state,
                                                                ship_state: JSON.parse(value).name,
                                                            });
                                                        }} data={stateName} label="State" className="business_form_input ant-form-item-required" selectClass="city_select"/>
                                                </div>

                                            </>
                                        )}
                                        <div>
                                            <button className="cancel_btn btn btn-default" style={{ marginRight: "10px" }} onClick={() => back()}>Cancel</button>
                                            <button className="create_btn " onClick={updateProfile}>Update</button>
                                        </div>
                                    </Form>

                                </Card>
                            </div>



                        </div>
                    </div>
                </div>
            </div>
        </>

        {/* <>
                
                <div className="main-content app-content mt-0" >
                    <div className="side-app">
                        <div className="container-fluid main-container p-0 ">
                            <div className="business_top">
                                <div className="business_header" style={{ display: 'flex', justifyContent: 'center', marginTop: 150 }}>
                                    <Spin indicator={antIcon} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </> */}


    </>
    );
}

export default BusinessDetail;