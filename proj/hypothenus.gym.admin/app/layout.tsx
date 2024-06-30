import React from "react";
import type { Metadata } from "next";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "/styles/hypothenus.scss";
import NextAuthProvider from "./lib/contexts/next-auth-provider";
import StoreProvider from './lib/store/store-provider'
import Header from "./lib/components/layout/header";

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
   
    <html lang="en">
      <body>
        <div className="container-fluid">
         <div className="overflow-hidden">
         <StoreProvider>
              <Header />
                {children}
          </StoreProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
//    <NextAuthProvider> </NextAuthProvider> 
