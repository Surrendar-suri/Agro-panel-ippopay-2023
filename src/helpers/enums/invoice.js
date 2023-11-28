const INVOICE_TYPES = {
    CURRENCY: 'rs',
    PERCENTAGE: 'percentage',
    farmer:'Select a farmer',
    customer:'Select a business',
}

export const farmerAddress=(state,farmerBillingAddress) => (
   
  <>
        {state.farmer_f2m === "f2m" && (
            <div className="customer_address">
                <span className="bill_add_deatils">
                    Bill to
                </span>
                <span className="bill_add_name">
                    {state.farmer_name}
                </span>
                <span className="bill_add_deatils">
                    {state.farmer_line1}
                </span>
                <span className="bill_add_deatils">
                    {state.farmer_line2}
                </span>
                <span className="bill_add_deatils">

                    {farmerBillingAddress}
                </span>
                <span className="bill_add_deatils">
                    {state.farmer_state}
                </span>

            </div>
        )}
    </>
)

export const merchantAddress =(state,merchantBillingAddress) =>{
    
    <>
         <div className="bill_left">
            <span className="bill_add_deatils">
                Address
            </span>
            {/* {state.is_same_merchant_billing === false && (
                <span className="bill_add_deatils">
                    Billing To
                </span>
            )} */}

            <span className="bill_add_name">
                {state.merchant_name}
            </span>
            <span className="bill_add_deatils">
                {state.merchant_billing_add_line1}
            </span>
            <span className="bill_add_deatils">
                {state.merchant_billing_add_line2}
            </span>

            {merchantBillingAddress}
            <span className="bill_add_deatils">
                {state.merchant_billing_state}
            </span>
        </div>
    </>
}

export const business_billing_address =(state,businessBillingAddress)=>{
    {state.business_m2b === "m2b" && (
        <div className="customer_address">
            <span className="bill_add_deatils">
                Bill to
            </span>
            <span className="bill_add_name">
                {state.business_name}
            </span>
            <span className="bill_add_deatils">
                {state.business_billing_add_line1}
            </span>
            <span className="bill_add_deatils">
                {state.business_billing_add_line2}
            </span>
            {businessBillingAddress}
            <span className="bill_add_deatils">
                {state.business_billing_state}
            </span>

        </div>
    )}
}
export {
    INVOICE_TYPES
}