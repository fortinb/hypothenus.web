"use client";

import { SessionProvider } from "next-auth/react";
import StoreProvider from "../lib/store/store-provider";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode}) {

  return (
    <StoreProvider>
      <SessionProvider>
        {children}
      </SessionProvider>
    </StoreProvider>
  );
}