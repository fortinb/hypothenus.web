"use client"

import { Coach } from "@/src/lib/entities/coach";
import { Page } from "@/src/lib/entities/page";
import CoachListDetails from "./coachs-list-details";

export default function CoachsList({ lang, pageOfCoachs }: { lang: string; pageOfCoachs?: Page<Coach> }) {

  return (

    <div className="d-flex flex-row flex-wrap mt-2 mb-2">

      {pageOfCoachs?.content.map((coach: Coach) => {
        return <CoachListDetails key={coach.uuid} lang={lang} coach={coach}></CoachListDetails>
      })}

    </div>
  );
}