"use client"

import { Gym } from "@/src/lib/entities/gym";
import { Page } from "@/src/lib/entities/page";
import GymListDetails from "./gyms-list-details";

export default function GymsList({ pageOfGyms }: { pageOfGyms: Page<Gym> | undefined; }) {

  return (

    <div className="d-flex flex-row flex-wrap mt-2 mb-2">
      {pageOfGyms?.content.map((gym: Gym) => {
        return <GymListDetails key={gym.gymId} gym={gym}></GymListDetails>
      })}
    </div>
  );
}