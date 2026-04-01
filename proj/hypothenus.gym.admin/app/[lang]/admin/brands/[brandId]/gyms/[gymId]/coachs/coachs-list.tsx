"use client"

import { Coach } from "@/src/lib/entities/coach";
import CoachListDetails from "./coachs-list-details";
import { useSelector } from "react-redux";
import { GymState } from "@/app/lib/store/slices/gym-state-slice";

export default function CoachsList({ lang }: { lang: string }) {
  const gymState: GymState = useSelector((state: any) => state.gymState);

  const sortedCoachs = gymState.gym?.coachs
    .slice()
    .sort((a, b) => a.person.lastname.localeCompare(b.person.lastname));

  return (
    <div className="overflow-auto flex-fill w-100 h-100">
      <div className="d-flex flex-row flex-wrap mb-2">

        {sortedCoachs?.map((coach: Coach) => {
          return <CoachListDetails key={coach.uuid} lang={lang} coach={coach}></CoachListDetails>
        })}

      </div>
    </div>
  );
}