"use client"

import i18n, { useTranslation } from "@/app/i18n/i18n";
import { GymState } from "@/app/lib/store/slices/gym-state-slice";
import Link from "next/link";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useSelector } from "react-redux";

export default function CoachMenu({ gymId, coachId }: { gymId: string, coachId: string }) {
  const gymState: GymState = useSelector((state: any) => state.gymState);
  const { t } = useTranslation("coach");

  return (

    <div className="d-flex flex-column justify-content-start w-100 h-50 page-menu">
      <div className="d-flex flex-row justify-content-center">
        <h2 className="text-secondary pt-4 ps-2">{t("menu.gym", { name: gymState.gym.name })}</h2>
      </div>
      <div className="ps-2 pe-2">
        <hr />
      </div>
      <div className="d-flex flex-row h-50">
        <div className="col btn-navigation m-2">
          <div className="d-flex flex-column justify-content-center h-100">
            <div className="d-flex flex-row justify-content-center">
              <Link className={"link-element" + (coachId == "new" ? " link-element-disabled" : "")} href={`/${i18n.resolvedLanguage}/gym/${gymId}/coachs/${coachId}`}><i className="icon icon-secondary bi-person-arms-up h1 m-0"></i></Link>
            </div>
            <div className="d-flex flex-row justify-content-center">
              <span className="text-primary mt-3">{t("menu.info")}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex flex-row flex-fill align-items-center justify-content-center">
        <OverlayTrigger placement="top" overlay={<Tooltip style={{ position: "fixed" }} id="coach_menu_back_tooltip">{t("menu.managementTooltip")}</Tooltip>}>
          <Link className="btn btn-primary ms-2" href={`/${i18n.resolvedLanguage}/gym/${gymId}/coachs`} ><i className="icon icon-light bi bi-backspace me-2"></i>
            {t("menu.management")}
          </Link>
        </OverlayTrigger>
      </div>
    </div>
  );
}
