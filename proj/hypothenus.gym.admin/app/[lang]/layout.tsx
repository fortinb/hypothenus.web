"use client"

import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Container from "react-bootstrap/Container";
import Footer from "./components/layout/footer";
import Header from "./components/layout/header";
import StoreProvider from '../lib/store/store-provider';
import "/styles/hypothenus.scss";
import "../i18n/i18n";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="en">
      <head>
      <title>Hypothenus - Good job !</title>
      </head>
      <body>
        <StoreProvider>
          <div className="container-fluid overflow-hidden w-100 h-100">
            <div className="d-flex flex-row w-100 h-100 p-1">
              <div className="d-flex flex-column justify-content-between w-100 h-100 pt-2">
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
