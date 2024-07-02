"use client";

import { Gym } from "@/src//lib/entities/gym";
import Link from "next/link";

export default function GymDetails({ gym }: { gym: Gym }) {

  return (
    <div className="col-6 mb-2">
      <div className="card border-2">
        <div className="col-12 d-flex flex-column flex-nowrap">
          <div className="card card-body m-2">
            <h5 className="card-title">
              <Link href={"/gyms/" + gym.gymId}> {gym.name}</Link>
            </h5>
            <p className="card-text">
              <span className="text-primary">{gym.address.city}</span>
            </p>
          </div>
          <div className="card-footer">
            <Link href={"mailto:" + gym.email}>{gym.email}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

