"use client";

import { useTranslations } from "next-intl";
import { redirect, useRouter } from "next/navigation";
import Dropdown from "react-bootstrap/Dropdown";
import { Authorize } from "../security/authorize";
import { BrandState } from "@/app/lib/store/slices/brand-state-slice";
import { useSelector } from "react-redux";

export default function AdminButton({ lang }: { lang: string }) {
  const router = useRouter();
  const t = useTranslations("layout");
  const brandState: BrandState = useSelector((state: any) => state.brandState);
  
  return (
    <Dropdown>
      <Dropdown.Toggle id="navbar-admin-dropdown">
        {t("navbar.admin.title")}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Authorize roles="admin">
          <Dropdown.Item onClick={() => redirect(`/${lang}/admin/brands`)}>
            {t("navbar.brands.title")}
          </Dropdown.Item>
        </Authorize>
        <Authorize roles="manager">
          <Dropdown.Item onClick={() => redirect(`/${lang}/admin/brands/${brandState?.brand?.uuid}`)}>
            {t("navbar.brands.title")}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => redirect(`/${lang}/admin/brands/${brandState?.brand?.uuid}/gyms`)}>
            {t("navbar.gyms.title")}
          </Dropdown.Item>
        </Authorize>
      </Dropdown.Menu>
    </Dropdown>
  );
}