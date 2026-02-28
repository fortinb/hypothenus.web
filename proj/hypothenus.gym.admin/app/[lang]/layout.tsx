import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Container from "react-bootstrap/Container";
import Footer from "@/app/ui/components/layout/footer";
import Header from "@/app/ui/components/layout/header";
import "@/styles/hypothenus.scss";
import { getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound, redirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import ErrorBoundary from "@/app/ui/components/errors/error-boundary";
import { debugLog } from "@/app/lib/utils/debug";
import Providers from "./providers";
import { Brand } from "@/src/lib/entities/brand";
import { getBrandByCode } from "../lib/services/brands-data-service";
import { failure } from "../lib/http/handle-result";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const localeValue = routing.locales.includes(locale as any)
    ? locale
    : routing.defaultLocale;

  const t = await getTranslations({
    locale: localeValue,
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
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!routing.locales.includes(lang as any)) {
    debugLog('not found');
    notFound();
  }

  let brand: Brand;

  try {
    brand = await getBrandByCode(process.env.NEXT_PUBLIC_BRAND_CODE as string);
  } catch (error: any) {
    failure(error);
    redirect(`/${lang}/error`);
  }

  return (

    <html lang={lang}>
      <head>
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Google Font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
        />
      </head>
      <body>
        <NextIntlClientProvider>
          <Providers>
            <div className="container-fluid overflow-hidden w-100 h-100 p-0">
              <div className="d-flex flex-row w-100 h-100 p-0">
                <div className="d-flex flex-column justify-content-between w-100 h-100">
                  <ErrorBoundary>
                    <Header lang={lang} brand={brand} />
                    <Container fluid={true} className="overflow-hidden h-100">
                      {children}
                    </Container>
                    <Footer />
                  </ErrorBoundary>
                </div>
              </div>
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html >
  );
}
