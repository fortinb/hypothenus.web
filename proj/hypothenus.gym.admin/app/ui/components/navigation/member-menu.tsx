"use client";

import { BrandState } from "@/app/lib/store/slices/brand-state-slice";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Nav from "react-bootstrap/Nav";
import { useSelector } from "react-redux";
import { Authorize } from "../security/authorize";

export default function MemberMenu({ lang }: { lang: string }) {
  const t = useTranslations("layout");
  const brandState: BrandState = useSelector((state: any) => state.brandState);

  return (
    <div className="d-flex flex-row align-items-center">
      <Authorize roles="member">
        <div className="d-flex align-items-center">
          <Nav.Link as={Link} href={`/${lang}/members/${brandState?.brand?.uuid}/reservations`}>{t("navbar.member.reservations")}</Nav.Link>
        </div>
      </Authorize>
      <div className="d-flex align-items-center">
        <Nav.Link as={Link} href={`/${lang}/members/${brandState?.brand?.uuid}/memberships`}>{t("navbar.member.memberships")}</Nav.Link>
      </div>
      <Authorize roles="member">
        <div className="d-flex align-items-center">
          <Nav.Link as={Link} href={`/${lang}/members/${brandState?.brand?.uuid}/payments`}>{t("navbar.member.payments")}</Nav.Link>
        </div>
      </Authorize>
      <Authorize roles="member">
        <div className="d-flex align-items-center">
          <Nav.Link as={Link} href={`/${lang}/members/${brandState?.brand?.uuid}/profile`}>{t("navbar.member.profile")}</Nav.Link>
        </div>
      </Authorize>
    </div>
  );
}