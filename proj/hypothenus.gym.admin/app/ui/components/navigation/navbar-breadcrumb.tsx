"use client"

import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { BreadcrumbState, initBreadcrumbs } from "@/app/lib/store/slices/breadcrumb-state-slice";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useSelector } from "react-redux";
import { BreadcrumbItemLabel } from "./breadcrumb-item-label";

export default function NavbarBreadcrumb() {
  const breadcrumbState: BreadcrumbState = useSelector((state: any) => state.breadcrumbState);
  const dispatch = useAppDispatch();

  const translationNamespaces = useMemo(
    () => Array.from(new Set(breadcrumbState.breadcrumbs
      .filter(item => item.namespace.trim().length > 0)))
      .map(ns => ns.namespace),
    [breadcrumbState.breadcrumbs]
  );

  useEffect(() => {
    if (breadcrumbState.breadcrumbs.length === 0) {
      dispatch(initBreadcrumbs());
    }
  }, [breadcrumbState.breadcrumbs.length, dispatch]);

  return (
    <div className="d-flex flex-row justify-content-center text-secondary fw-bold pe-3">
      <Breadcrumb>
        {breadcrumbState.breadcrumbs?.map((item, index) => {
          return index === breadcrumbState?.breadcrumbs?.length - 1 ? (
            <Breadcrumb.Item key={item.id} active>
              <BreadcrumbItemLabel
                namespace={item.namespace}
                translationKey={item.key}
              />
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item key={item.id} href={item.href} linkAs={Link}>
              <BreadcrumbItemLabel
                namespace={item.namespace}
                translationKey={item.key}
              />
            </Breadcrumb.Item>
          )
        })}
      </Breadcrumb>
    </div>
  );
}
