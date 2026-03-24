"use client"

import AddressInfo from "../contact/address-info";

export default function GymAddressInfo() {

    return (
        <AddressInfo id="gym_address" formStatefield="gym.address" required={true} parent="gym"/>
    );
}
