"use client"

import { useParams, usePathname } from "next/navigation";
import CoachsListPaging from "./coachs-list-paging";
import CoachsMenu from "./coachs-menu";
import { useEffect } from "react";
import { Crumb, pushBreadcrumb } from "@/app/lib/store/slices/breadcrumb-state-slice";
import { useTranslation } from "@/app/i18n/i18n";
import { useAppDispatch } from "@/app/lib/hooks/useStore";


export default function Coachs() {
  const { t } = useTranslation("coach");
  const params = useParams<{ gymId: string }>();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    const crumb: Crumb = {
      id: "coachs.page",
      href: pathname,
      crumb: t("breadcrumb")
    };

    dispatch(pushBreadcrumb(crumb));
  }, []);
  
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

