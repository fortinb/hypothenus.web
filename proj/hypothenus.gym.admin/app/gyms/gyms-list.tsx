"use client";
import { Gym } from "@/src//lib/entities/gym";
import GymDetails from "./gym-details";
import { useGymsDataContext } from "../lib/contexts/gyms-data-provider";

export default function GymsList( ) {
 
  const { gymsState } = useGymsDataContext();

  //const pageOfGyms = useSelector((state: gymState) => state.pageofGym);
  //const dispatch = useDispatch();
  
  return (
    <div className="container pb-4">
      <div className="row g-4">
        {gymsState.pageOfGyms.content.map((gym: Gym) => {
          return <GymDetails key={gym.gymId} gym={gym}></GymDetails>
        })}
      </div>
    </div>
  );
}
