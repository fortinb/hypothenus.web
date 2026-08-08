"use client"

import AddressInfo from "../contact/address-info";

export default function OrderBillingAddressInfo() {

    return (
        <AddressInfo id="order_billing_address" formStatefield="billingDetail.address" required={true} parent="billingDetail"/>
    );
}
