"use client"

import { useTranslation } from "@/app/i18n/i18n";

export default function Loader() {
  const { t } = useTranslation("navigation");
  
  return (
    <div className="d-flex flex-row justify-content-center text-secondary fw-bold pe-3">
      <div>
        <span className="text-secondary"><i className="icon icon-secondary spinner-border bi bi-triangle m-3"></i>{t("loader.loading")}</span>
      </div>
    </div>
  );
}
