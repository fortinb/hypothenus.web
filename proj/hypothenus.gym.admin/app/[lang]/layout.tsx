import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Container from "react-bootstrap/Container";
import Footer from "@/app/ui/components/layout/footer";
import Header from "@/app/ui/components/layout/header";
import StoreProvider from '../lib/store/store-provider';
import "@/styles/hypothenus.scss";
import { getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

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
     console.log('not found');  
     notFound();
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
