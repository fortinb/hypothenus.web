"use client"

import { useTranslations } from "next-intl";
import { BrandState } from "@/app/lib/store/slices/brand-state-slice";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Member } from "@/src/lib/entities/member";

export default function MemberMenu({ lang, member }: { lang: string; member: Member }) {
  const brandState: BrandState = useSelector((state: any) => state.brandState);
  const t = useTranslations("member");

  return (

    <div className="d-flex flex-column justify-content-start w-100 h-50 page-menu">
      <div className="d-flex flex-row justify-content-center">
        <h2 className="text-secondary pt-4 ps-2">{t("menu.brand", { name: brandState.brand.name })}</h2>
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
              <Link className={"link-element" + (member.uuid === null ? " link-element-disabled" : "")} href={`/${lang}/admin/brands/${member.brandUuid}/members/${member.uuid}`}><i className="icon icon-secondary bi-person h1 m-0"></i></Link>
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
