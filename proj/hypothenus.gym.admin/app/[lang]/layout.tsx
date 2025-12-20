import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Container from "react-bootstrap/Container";
import Footer from "../ui/components/layout/footer";
import Header from "../ui/components/layout/header";
import StoreProvider from '../lib/store/store-provider';
import "/styles/hypothenus.scss";
import { getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props) {
  const locale = routing.locales.includes(params.locale as any)
    ? params.locale
    : routing.defaultLocale;

  const t = await getTranslations({
    locale,
    namespace: "translation"
  });

  return {
    title: t("html.head.title"),
    description: t("html.head.description")
  };
}


export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  if (!routing.locales.includes(params.lang as any)) notFound();

  return (

    <html lang={params.lang}>
      <body>
        <NextIntlClientProvider>
          <StoreProvider>
            <div className="container-fluid overflow-hidden w-100 h-100 p-0">
              <div className="d-flex flex-row w-100 h-100 p-0">
                <div className="d-flex flex-column justify-content-between w-100 h-100">
                  <Header />
                  <Container fluid={true} className="overflow-hidden h-100">
                    {children}
                  </Container>
                  <Footer />
                </div>
              </div>
            </div>
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html >
  );
}
