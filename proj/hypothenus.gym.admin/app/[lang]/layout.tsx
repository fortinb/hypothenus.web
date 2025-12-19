"use client"

import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Container from "react-bootstrap/Container";
import Footer from "../ui/components/layout/footer";
import Header from "../ui/components/layout/header";
import StoreProvider from '../lib/store/store-provider';
import "/styles/hypothenus.scss";
import { useParams } from "next/navigation";
import {useTranslation} from "../i18n/i18n";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useParams<{ lang: string }>();
  const { t } = useTranslation("translation", params.lang);

  return (

    <html lang={params.lang}>
      <head>
      <title>{t("html.head.title")}</title>
      </head>
      <body>
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
      </body>
    </html >
  );
}
//    <NextAuthProvider> </NextAuthProvider> 
