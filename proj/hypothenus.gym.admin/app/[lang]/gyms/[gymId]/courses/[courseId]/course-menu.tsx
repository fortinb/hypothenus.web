"use client"

import i18n, { useTranslation } from "@/app/i18n/i18n";
import { GymState } from "@/app/lib/store/slices/gym-state-slice";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function CourseMenu({ gymId, courseId }: { gymId: string, courseId: string }) {
  const gymState: GymState = useSelector((state: any) => state.gymState);
  const { t } = useTranslation("course");

  return (

    <div className="d-flex flex-column justify-content-start w-100 h-50 page-menu">
      <div className="d-flex flex-row justify-content-center">
        <h2 className="text-secondary pt-4 ps-2">{t("menu.gym", { name: gymState.gym.name })}</h2>
      </div>
      <div className="d-flex flex-row justify-content-center">
        <h3 className="text-secondary pt-0 ps-2">{t("menu.sections")}
        </h3>
      </div>
      <div className="ps-2 pe-2">
        <hr />
      </div>
      <div className="d-flex flex-row h-50">
        <div className="col btn-navigation m-2">
          <div className="d-flex flex-column justify-content-center h-100">
            <div className="d-flex flex-row justify-content-center">
              <Link className={"link-element" + (courseId == "new" ? " link-element-disabled" : "")} href={`/${i18n.resolvedLanguage}/gyms/${gymId}/courses/${courseId}`}><i className="icon icon-secondary bi-bicycle h1 m-0"></i></Link>
            </div>
            <div className="d-flex flex-row justify-content-center">
              <span className="text-primary mt-3">{t("menu.info")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
