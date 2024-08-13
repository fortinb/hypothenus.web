"use client"

import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { BreadcrumbState, initBreadcrumbs } from "@/app/lib/store/slices/breadcrumb-state-slice";
import Link from "next/link";
import { useEffect } from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useSelector } from "react-redux";

export default function NavBreadcrumb() {
  const breadcrumbState: BreadcrumbState = useSelector((state: any) => state.breadcrumbState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (breadcrumbState.breadcrumbs.length === 0) {
       dispatch(initBreadcrumbs());
    }
  }, []);

  return (
    <div className="d-flex flex-row justify-content-center text-secondary fw-bold pe-3">
      <Breadcrumb>
        {breadcrumbState.breadcrumbs?.map((item, index) =>
          index === breadcrumbState?.breadcrumbs?.length - 1 ? (
            <Breadcrumb.Item key={item.id} active>
              {item.crumb}
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item key={item.id} href={item.href} linkAs={Link}>
              {item.crumb}
            </Breadcrumb.Item>
          )
        )}
      </Breadcrumb>
    </div>
  );
}
