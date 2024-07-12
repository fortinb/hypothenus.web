"use client";

import { Gym } from "@/src//lib/entities/gym";
import { formatAddress } from "@/src/lib/entities/address";
import Link from "next/link";

export default function GymListDetails({ gym }: { gym: Gym }) {

  return (
    <div className="col-6 p-2">
      <div className="card">
        <div className="d-flex flex-column flex-nowrap">
          <div className={"card card-body m-2" + (gym.active == false ? " card-body-inactive" : "")}>
            <h6 className="card-title">
              <Link className="link-element" href={"/gym/" + gym.gymId}> {gym.name}</Link>
            </h6>
            <p className="card-text">
              <span className="text-primary">{formatAddress(gym.address)}</span><br />
              <Link className="link-element" href={"mailto:" + gym.email}>{gym.email}</Link><br />
              <span className="text-primary">{gym.gymId}</span><br />
            </p>

            {gym.active == false &&
                <div>
                  <span className="font-weight-bold"><i className="bi bi-ban icon icon-danger pe-2"></i>Inactive</span><br />
                </div>
            }

          </div>
        </div>
      </div>
    </div>
  );
}

