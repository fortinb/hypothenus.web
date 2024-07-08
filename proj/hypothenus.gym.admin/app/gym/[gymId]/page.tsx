"use client"

import React from "react";
import { useParams } from 'next/navigation'
import GymMenu from "./gym-menu";
import GymForm from "./gym-form";

export default function Gym() {
  const params = useParams<{ gymId: string }>();

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-5">
       <GymMenu gymId={params.gymId} />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <GymForm gymId={params.gymId} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100">

      </div>
    </div>
  );
}
/*<i className="icon-primary material-symbols-outlined align-middle">search</i>
<span className="text-primary">Hello world 1</span>
<i className="icon-primary bi bi-search"></i>
<a className="" href="/gyms">Gym list</a>
*/
