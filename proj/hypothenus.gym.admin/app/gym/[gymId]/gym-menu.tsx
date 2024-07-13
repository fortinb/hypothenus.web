"use client"

import Link from "next/link";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

export default function GymMenu({ gymId }: { gymId: string }) {

  return (

    <div className="d-flex flex-column justify-content-start w-100 h-50 page-menu">
      <div className="d-flex flex-row justify-content-center">
        <h2 className="text-secondary pt-4 ps-2">Sections</h2>
      </div>
      <div className="ps-2 pe-2">
        <hr />
      </div>

      <div className="d-flex flex-row h-50">
        <div className="col btn-navigation m-2">
          <div className="d-flex flex-column justify-content-center h-100">
            <div className="d-flex flex-row justify-content-center">
              <Link className="link-element" href={"/gym/" + gymId}><i className="icon icon-secondary bi bi-building h1 m-0"></i></Link>
            </div>
            <div className="d-flex flex-row justify-content-center">
              <span className="text-primary mt-3">Gym info</span>
            </div>
          </div>
        </div>
        <div className="col btn-navigation m-2">
          <div className="d-flex flex-column justify-content-center h-100">
            <div className="d-flex flex-row justify-content-center">
              <Link className="link-element" href={"/gym/" + gymId + "/contacts"}><i className="icon icon-secondary bi bi-telephone h1 m-0"></i></Link>
            </div>
            <div className="d-flex flex-row justify-content-center">
              <span className="text-primary mt-3">Contacts</span>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex flex-row flex-fill align-items-center justify-content-center">
        <OverlayTrigger placement="top" overlay={<Tooltip style={{position:"fixed"}} id="gym_menu_back_tooltip">Back to gyms management</Tooltip>}>
          <Link className="btn btn-primary ms-2" href="/gyms" ><i className="icon icon-light bi bi-backspace me-2"></i>Gyms
          </Link>
        </OverlayTrigger>
      </div>
    </div>
  );
}
