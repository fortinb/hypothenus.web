"use client";

import { Gym } from "@/src//lib/entities/gym";
import { formatAddress } from "@/src/lib/entities/address";
import Link from "next/link";

export default function GymDetails({ gym }: { gym: Gym }) {

  return (
    <div className="col-6 p-2">
      <div className="card">
        <div className="d-flex flex-column flex-nowrap">
          <div className={"card card-body m-2" + (gym.active == false ? " card-body-inactive" : "")}>
            <h5 className="card-title">
              <Link href={"/gyms/" + gym.gymId}> {gym.name}</Link>
            </h5>
            <p className="card-text">
              <span className="text-primary">{formatAddress(gym.address)}</span><br />
              <Link href={"mailto:" + gym.email}>{gym.email}</Link>
            </p>
          </div>
          <div className={"card-footer ms-2 me-2 mb-2" + (gym.active == false ? " card-footer-inactive" : "")}>

            {gym.active == false &&
              <div>
                <span className="text-secondary font-weight-bold"><i className="bi bi-ban icon icon-danger pe-2"></i>Inactive</span><br />
              </div>
            }

          </div>
        </div>
      </div>
    </div>
  );
}

