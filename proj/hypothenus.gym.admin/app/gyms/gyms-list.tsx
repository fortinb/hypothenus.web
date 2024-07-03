"use client"

import { Gym } from "@/src/lib/entities/gym";
import { Page } from "@/src/lib/entities/page";
import GymDetails from "./gym-details";

export default function GymsList({ pageOfGyms }: { pageOfGyms: Page<Gym> | undefined; }) {

    return (

    <div className="d-flex flex-row flex-wrap w-100 h-100 mt-2 mb-2">
      {pageOfGyms?.content.map((gym: Gym) => {
        return <GymDetails key={gym.gymId} gym={gym}></GymDetails>
      })}
    </div>
  );
}