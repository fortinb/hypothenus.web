"use client";

import { useTranslations } from "next-intl";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { MouseEvent, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import ModalConfirmation from "../actions/modal-confirmation";
import { logout } from "@/src/security/actions";
import { signOut as clientSignOut } from "next-auth/react";

export default function SigninButton({ lang }: { lang: string }) {
  const t = useTranslations("welcome");
  const { data: session, status } = useSession();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const onSignin = async (e: MouseEvent<HTMLButtonElement>) => {

    switch (status) {
      case "loading":
        return;
      case "unauthenticated":
        // Signin is handled by NextAuth's signIn function, which will redirect to the Azure AD login page
        await signIn("entra");
        break;
      case "authenticated":
        setShowDeleteConfirmation(true);
        break;
      default:
        console.warn("Unhandled session status:", status);
    }
  }

  const onSignOut = async (confirmation: boolean) => {
    if (confirmation) {
      setIsSigningOut(true);
      setShowDeleteConfirmation(false);
      try {
        await logout();
      } catch (error) {
        // Refresh the SessionProvider's session state to ensure it reflects the signed-out status
        await clientSignOut({ redirect: false });
        throw error;
      }
    } else {
      setShowDeleteConfirmation(false);
    }
  }

  return (
    <>
      <OverlayTrigger placement="bottom" overlay={<Tooltip style={{ position: "fixed" }} id="navbar_action_signin">{status === "authenticated" ? `${session?.user.name}` : t("text.signinMessage")}</Tooltip>}>
        <Button className="btn btn-icon" onClick={onSignin}>
          <i className={"icon bi h5 pe-2 " + (session ? "bi-person-fill" : "bi-person")}></i>
          <span className="">{status === "authenticated" ? `${t("buttons.signout")}` : t("buttons.signin")}</span>
        </Button>
      </OverlayTrigger>
      <ModalConfirmation title={t("signoutConfirmation.title")} text={t("signoutConfirmation.text")}
        yesText={t("signoutConfirmation.yes")} noText={t("signoutConfirmation.no")}
        actionText={t("signoutConfirmation.action")}
        isAction={isSigningOut}
        show={showDeleteConfirmation} handleResult={onSignOut} />
    </>
  );
}