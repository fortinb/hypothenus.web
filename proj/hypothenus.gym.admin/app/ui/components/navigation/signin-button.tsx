"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "react-bootstrap";

interface SigninButtonProps {
  lang: string;
}

export default function SigninButton({ lang }: SigninButtonProps) {
  const router = useRouter();
  const t = useTranslations("welcome" );

  const handleSignin = () => {
    router.push(`/${lang}/public/signin`);
  };

  return (
    <Button className="btn btn-icon btn-sm" onClick={handleSignin}>
      <i className="icon bi bi-person h5 pe-2"></i>{t("buttons.signin")}
    </Button>
  );
}