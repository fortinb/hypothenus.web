"use client"

import AddressInfo from "../contact/address-info";

export default function OrderShippingAddressInfo() {

    return (
        <AddressInfo id="order_shipping_address" formStatefield="shippingDetail.address" required={true} parent="shippingDetail"/>
    );
}
