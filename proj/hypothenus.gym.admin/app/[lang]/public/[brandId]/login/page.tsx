import Link from "next/link";
import { Container } from "react-bootstrap";
import { getTranslations } from "next-intl/server";
import LoginButton from "@/app/ui/components/navigation/LoginButton";
import { Breadcrumb } from '@/app/ui/components/navigation/breadcrumb';

interface PageProps {
  params: Promise<{ lang: string; brandId: string }>;
}

export default async function LoginPage({ params }: PageProps) {
  const { lang, brandId } = await params;

  const t = await getTranslations({
    locale: lang,
    namespace: "welcome"
  });

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <Breadcrumb
        crumb={{
          reset: false,
          id: "signin.page",
          locale: `${lang}`,
          href: `/public/${brandId}/login`,
          key: "breadcrumb.signin",
          namespace: "welcome"
        }}
      />
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
      </div>
      <div className="d-flex flex-row w-100 h-100">
        <div className="d-flex flex-column align-items-center w-100 h-100">
          <Container fluid="true">
            <div className="d-flex flex-column align-items-center w-100 h-100">
              <h1 className="text-tertiary">{t("header.welcomeMessage")}</h1>
              <h2 className="text-primary">{t("text.signinMessage")}</h2>
            </div>
          </Container>
          <br />
          <LoginButton lang={lang} brandId={brandId} />
          <span className="mt-4">{t("text.signupMessage")}</span>
          <Link className="link-element" href={`/${lang}/public/${brandId}/registration`}>
            {t("buttons.signup")}
          </Link>
        </div>
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
      </div>
    </div>
  );
}