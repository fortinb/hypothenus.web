"use client"

import { useTranslations } from "next-intl";

export default function Loader() {
  const t = useTranslations("navigation");
  
  return (
    <div className="d-flex flex-row justify-content-center text-secondary fw-bold pe-3">
      <div>
        <span className="text-secondary"><i className="icon icon-secondary spinner-border bi bi-triangle m-3"></i>{t("loader.loading")}</span>
      </div>
    </div>
  );
}
