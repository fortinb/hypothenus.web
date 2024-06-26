import React from "react";
import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "/styles/styles.css";
import NextAuthProvider from "./lib/contexts/next-auth-provider";
import StoreProvider from './lib/store/store-provider'

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
          <StoreProvider>
            {children}
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}
//    <NextAuthProvider> </NextAuthProvider> 
