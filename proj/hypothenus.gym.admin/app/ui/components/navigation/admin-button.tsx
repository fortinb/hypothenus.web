"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
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
        <Authorize roles={["admin", "manager"]}>
          <Dropdown.Item onClick={() => router.push(`/${lang}/admin/users`)}>
            {t("navbar.users.title")}
          </Dropdown.Item>
          <Authorize roles={["admin"]}>
            <Dropdown.Item onClick={() => router.push(`/${lang}/admin/brands`)}>
              {t("navbar.brands.title")}
            </Dropdown.Item>
          </Authorize>
        </Authorize>
        <Authorize roles={["manager"]}>
          <Dropdown.Item onClick={() => router.push(`/${lang}/admin/brands/${brandState?.brand?.uuid}`)}>
            {brandState?.brand?.name}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => router.push(`/${lang}/admin/brands/${brandState?.brand?.uuid}/gyms`)}>
            {t("navbar.gyms.title")}
          </Dropdown.Item>
        </Authorize>
      </Dropdown.Menu>
    </Dropdown>
  );
}