import React from "react";
import type { Metadata } from "next";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "/styles/hypothenus.scss";
import NextAuthProvider from "./lib/contexts/next-auth-provider";
import StoreProvider from './lib/store/store-provider'
import Header from "./lib/components/layout/header";
import Footer from "./lib/components/layout/footer";

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
                <div className="container-fluid overflow-hidden h-100"> 
                  {children}
                </div>
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
