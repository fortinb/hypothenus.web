"use client"

import Link from "next/link";
import { ChangeEvent } from "react";
import Form from "react-bootstrap/Form";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../lib/hooks/useStore";
import { GymsStatePaging, includeInactive } from "../../lib/store/slices/gyms-state-paging-slice";

export default function GymsMenu() {
  const gymsStatePaging: GymsStatePaging = useSelector((state: any) => state.gymsStatePaging);
  const dispatch = useAppDispatch();

  function onIncludeDeactivated(e: ChangeEvent<HTMLInputElement>) {
    dispatch(includeInactive(e.currentTarget.checked));
  }

  return (

    <div className="d-flex flex-column justify-content-start w-100 h-50 page-menu">
      <div className="d-flex flex-row justify-content-center">
        <h2 className="text-secondary pt-4 ps-2">Gyms</h2>
      </div>
      <div className="ps-2 pe-2">
        <hr />
      </div>
      <div className="d-flex flex-row justify-content-end">

      </div>
      <div className="d-flex flex-row h-100">
        <div className="col btn-navigation m-2">
          <div className="d-flex flex-column justify-content-center h-100">
            <div className="d-flex flex-row justify-content-center">
              <Link className="link-element" href={"/gym/new"}><i className="icon icon-secondary bi bi-plus-square h1 m-0"></i></Link>
            </div>
            <div className="d-flex flex-row justify-content-center">
              <span className="text-primary mt-3">Add new gym</span>
            </div>
          </div>
        </div>
        <div className="col pt-2 m-2">
          <div className="form-check form-switch pe-2">
            <Form.Control className="form-check-input form-check-input-lg" type="checkbox" role="switch" name="includeDeactivate"
              id="flexSwitchCheckChecked" onChange={onIncludeDeactivated} checked={gymsStatePaging.includeInactive} />
            <label className="text-primary ps-2" htmlFor="flexSwitchCheckChecked">Include inactive</label>
          </div>
        </div>
      </div>
    </div>
  );
}
