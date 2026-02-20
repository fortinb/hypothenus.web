"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { MouseEvent } from "react";
import { useSession, signOut, signIn } from "next-auth/react";

export default function SigninButton({ lang }: { lang: string }) {
  const router = useRouter();
  const t = useTranslations("welcome");
  const { data: session, status } = useSession();

  const onSignin = (e: MouseEvent<HTMLButtonElement>) => {

    switch (status) {
      case "loading":
        return;
      case "unauthenticated":
        // Signin is handled by NextAuth's signIn function, which will redirect to the Azure AD login page
        signIn("entra"); 
        
        break;
      case "authenticated":
        signOut();
        router.push(`/${lang}`);
        break;
      default:
        console.warn("Unhandled session status:", status);
    }
  }

  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip style={{ position: "fixed" }} id="navbar_action_signin">{status === "authenticated" ? `${session?.user.name}` : t("text.signinMessage")}</Tooltip>}>
      <Button className="btn btn-icon" onClick={onSignin}>
        <i className={"icon bi h5 pe-2 " + (session ? "bi-person-fill" : "bi-person")}></i>
          <span className="">{status === "authenticated" ? `${t("buttons.signout")}`: t("buttons.signin")}</span>
      </Button>
    </OverlayTrigger>

  );
}