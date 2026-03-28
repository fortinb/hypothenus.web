"use client"

import { useTranslations } from "next-intl";
import { CoachsStatePaging } from "@/app/lib/store/slices/coachs-state-paging-slice";
import { GymState } from "@/app/lib/store/slices/gym-state-slice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/app/lib/hooks/useStore";

export default function CoachsMenu({ lang }: { lang: string; }) {
  const coachsStatePaging: CoachsStatePaging = useSelector((state: any) => state.coachsStatePaging);
  const gymState: GymState = useSelector((state: any) => state.gymState);

  const dispatch = useAppDispatch();
  const t = useTranslations("coach");

  return (

    <div className="d-flex flex-column justify-content-start w-100 h-50 page-menu">
      <div className="d-flex flex-row justify-content-center">
        <h2 className="text-secondary pt-4 ps-2">{t("list.menu.gym", { name: gymState.gym.name })}</h2>
      </div>
      <div className="d-flex flex-row justify-content-center">
        <h3 className="text-secondary pt-0 ps-2">{t("list.menu.title")}
          <i className="icon icon-secondary bi-person-arms-up m-0"></i>
        </h3>
      </div>
      <div className="ps-2 pe-2">
        <hr />
      </div>
      <div className="d-flex flex-column h-100">
      </div>
    </div>
  );
}
