"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import Dropdown from "react-bootstrap/Dropdown";

export default function LanguageButton({ lang }: { lang: string }) {
  const router = useRouter();
  const t = useTranslations("layout");
  const pathname = usePathname();

  function changeLanguage(language: string) {
    router.push(`/${language}${pathname.substring(3)}`);
  }

  return (
    <Dropdown>
      <Dropdown.Toggle id="navbar-languages-dropdown">
        {t("navbar.language.title")}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => changeLanguage("en")}>
          {t("navbar.language.en")}
          {lang == "en" &&
            <i className="bi bi-check"></i>
          }
        </Dropdown.Item>
        <Dropdown.Item onClick={() => changeLanguage("fr")}>
          {t("navbar.language.fr")}
          {lang == "fr" &&
            <i className="bi bi-check"></i>
          }
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}