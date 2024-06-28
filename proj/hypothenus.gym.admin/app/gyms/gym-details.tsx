"use client";

import { Gym } from "@/src//lib/entities/gym";

export default function GymDetails( { gym }: { gym: Gym }) {
 
  return (
    <div className="container pb-4">
      <div className="row g-4">
        <div>{gym.name}</div>
      </div>
    </div>
  );
}
