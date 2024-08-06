"use client"

import i18n, { useTranslation } from "@/app/i18n/i18n";
import GymsListPaging from "./gyms-list-paging";
import GymsMenu from "./gyms-menu";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { useEffect } from "react";
import { Crumb, pushBreadcrumb } from "@/app/lib/store/slices/breadcrumb-state-slice";

export default function Gyms() {
  const { t } = useTranslation("gym");
  const dispatch = useAppDispatch();

  useEffect(() => {
    const crumb: Crumb = {
      id: "gyms.page",
      href: `/${i18n.resolvedLanguage}/gyms`,
      crumb: t("breadcrumb")
    };

    dispatch(pushBreadcrumb(crumb));
  }, []);

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-5">
        <GymsMenu />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <GymsListPaging />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100">

      </div>
    </div>
  );
}