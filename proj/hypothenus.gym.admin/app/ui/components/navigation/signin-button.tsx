"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "react-bootstrap";
import { signIn } from "next-auth/react";

export default function SigninButton() {
  const router = useRouter();
  const t = useTranslations("welcome" );

  const handleSignin = () => {
     signIn("entra"); 
  };

  return (
    <Button className="btn btn-icon btn-sm" onClick={handleSignin}>
      <i className="icon bi bi-person h5 pe-2"></i>{t("buttons.signin")}
    </Button>
  );
}