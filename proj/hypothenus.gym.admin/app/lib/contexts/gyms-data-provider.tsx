"use client";

import { Gym } from "@/src/lib/entities/gym";
import { Page } from "@/src/lib/entities/page";
import { ReactNode, createContext, useContext, useState } from "react";

export interface GymsState {
  pageOfGyms: Page<Gym>;
}

interface GymsDataContextProps {
  gymsState: GymsState;
  setGymsState: React.Dispatch<React.SetStateAction<GymsState>>;
}

// Create the context with the defined shape
const GymsDataContext = createContext<GymsDataContextProps | undefined>(
  undefined,
);

export default function GymsDataProvider({
  children,
  pageOfGym,
}: {
  children: ReactNode;
  pageOfGym: Page<Gym>;
}) {

  const initialState: GymsState = {
    pageOfGyms: pageOfGym
  };

  const [gymsState, setGymsState] = useState<GymsState>(initialState);

  const value = {
    gymsState,
    setGymsState
  };

  return (
    <GymsDataContext.Provider value={value}>
      {children}
    </GymsDataContext.Provider>
  );
}

export function useGymsDataContext() {
  const context = useContext(GymsDataContext);
  if (!context) {
    throw new Error(
      "useGymsDataContext must be used within a GymsDataProvider",
    );
  }
  return context;
}