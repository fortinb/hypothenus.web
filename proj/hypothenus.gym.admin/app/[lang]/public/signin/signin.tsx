"use client";

import Link from "next/link";
import { Container } from "react-bootstrap";
import { BrandState } from "@/app/lib/store/slices/brand-state-slice";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import SigninButton from "@/app/ui/components/security/signin-button";
import { useSession } from "next-auth/react";

export default function Signin({ lang }: { lang: string }) {
    const t = useTranslations("welcome");
    const { data: session } = useSession();
    const brandState: BrandState = useSelector((state: any) => state.brandState);

    return (
        <div className="d-flex flex-column align-items-center w-100 h-100">
            <Container fluid="true">
                <div className="d-flex flex-column align-items-center w-100 h-100">
                    <h1 className="text-tertiary">{t("header.welcomeMessage")}</h1>
                    {!session && <>
                        <h2 className="text-primary">{t("text.signinMessage")}</h2>
                    </>}
                       {session && <>
                        <h2 className="text-primary">{t("text.welcomeMessage", { name: session?.user?.name || "" })}</h2>
                    </>}
                </div>
            </Container>
            <br />
            {!session && <>
                <SigninButton lang={lang} />
                <span className="mt-4">{t("text.signupMessage")}</span>
                <Link className="link-element" href={`/${lang}/public/${brandState?.brand?.uuid}/registration`}>
                    {t("buttons.signup")}
                </Link>
            </>}
        </div>
    );
}