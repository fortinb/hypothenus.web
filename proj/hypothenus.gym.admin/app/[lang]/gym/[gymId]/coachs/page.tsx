"use client"

import { useParams } from "next/navigation";
import CoachsListPaging from "./coachs-list-paging";
import CoachsMenu from "./coachs-menu";


export default function Coachs() {
  const params = useParams<{ gymId: string }>();

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-5">
        <CoachsMenu gymId={params.gymId} />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <CoachsListPaging gymId={params.gymId} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100">

      </div>
    </div>
  );
}

