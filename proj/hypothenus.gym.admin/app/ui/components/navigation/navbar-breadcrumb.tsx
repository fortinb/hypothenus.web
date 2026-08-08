"use client"

import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { BreadcrumbState, updateBreadcrumbsLocale } from "@/app/lib/store/slices/breadcrumb-state-slice";
import Link from "next/link";
import { useEffect, useState } from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useSelector } from "react-redux";
import { BreadcrumbItemLabel } from "./breadcrumb-item-label";
import { useLocale } from "next-intl";

export default function NavbarBreadcrumb() {
  const breadcrumbState: BreadcrumbState = useSelector((state: any) => state.breadcrumbState);
  const locale = useLocale();
  const dispatch = useAppDispatch();

  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    // SSR Hydration complete, now we can use client-side features
    setIsClient(true);
  }, [isClient]);

  const renderedBreadcrumbs = isClient ? breadcrumbState.breadcrumbs : [];

  useEffect(() => {
    // Update breadcrumbs whenever locale changes
    dispatch(updateBreadcrumbsLocale(locale));
  }, [dispatch, locale]);

  return (
    <div className="d-flex flex-row justify-content-center text-secondary fw-bold pe-3">
      {renderedBreadcrumbs?.length > 1 &&
        <Breadcrumb>
          {renderedBreadcrumbs?.map((item, index) => {
            return index === renderedBreadcrumbs?.length - 1 ? (
              <Breadcrumb.Item key={item.id} active>
                <BreadcrumbItemLabel
                  namespace={item.namespace}
                  translationKey={item.key}
                  value={item.value}
                />
              </Breadcrumb.Item>
            ) : (
              <Breadcrumb.Item key={item.id} href={`/${item.locale}${item.href}`} linkAs={Link}>
                <BreadcrumbItemLabel
                  namespace={item.namespace}
                  translationKey={item.key}
                  value={item.value}
                />
              </Breadcrumb.Item>
            )
          })}
        </Breadcrumb>
      }
    </div>
  );
}
