
"use client";

import { Brand } from "@/src/lib/entities/brand";
import NavbarBreadcrumb from "../navigation/navbar-breadcrumb";
import NavbarMenu from "../navigation/navbar-menu";
import { useEffect } from "react";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { updateBrandState } from "@/app/lib/store/slices/brand-state-slice";

export default function Header({ lang, brand }: { lang: string; brand: Brand }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(updateBrandState(brand));
  }, [dispatch, brand]);

  return (
    <div>
      <header className="navbar shadow sticky-top p-0">
        <NavbarMenu lang={lang} />
      </header>
      <div className="d-flex flex-row justify-content-start ms-5">
        <NavbarBreadcrumb />
      </div>
    </div>
  );
}
