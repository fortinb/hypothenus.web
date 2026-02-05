"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "react-bootstrap";

interface LoginButtonProps {
  lang: string;
  brandId: string;
}

export default function LoginButton({ lang, brandId }: LoginButtonProps) {
  const router = useRouter();
  const t = useTranslations("welcome" );

  const handleLogin = () => {
    router.push(`/${lang}/public/${brandId}/login`);
  };

  return (
    <Button className="btn btn-icon btn-sm" onClick={handleLogin}>
      <i className="icon bi bi-person h5 pe-2"></i>{t("buttons.signin")}
    </Button>
  );
}