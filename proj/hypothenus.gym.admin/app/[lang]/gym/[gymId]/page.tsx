"use client"

import { useParams } from "next/navigation";
import GymForm from "./gym-form";
import GymMenu from "./gym-menu";
import GymResume from "./gym-resume";
export default function Gym() {
  const params = useParams<{ gymId: string }>();

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <GymMenu gymId={params.gymId} />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <GymForm gymId={params.gymId} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <GymResume />
      </div>
    </div>
  );
}
