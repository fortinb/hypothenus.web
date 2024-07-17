import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import type { Metadata } from "next";
import React from "react";
import Container from "react-bootstrap/Container";
import Footer from "./lib/components/layout/footer";
import Header from "./lib/components/layout/header";
import StoreProvider from './lib/store/store-provider';
import "/styles/hypothenus.scss";

export const metadata: Metadata = {
  title: "Isoceles Hypothenus",
  description: "Gym management experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="fr">
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
