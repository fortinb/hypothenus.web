"use client";

import { useEffect } from "react";
import { useAppDispatch } from '@/app/lib/hooks/useStore';
import { Crumb, pushBreadcrumb, resetBreadcrumbs } from '@/app/lib/store/slices/breadcrumb-state-slice';

interface Props {
  crumb: Crumb;
}

export function Breadcrumb({ crumb }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (crumb.reset) {
      dispatch(resetBreadcrumbs(crumb));
      return;
    }
    
    dispatch(pushBreadcrumb(crumb));
  }, [dispatch, crumb]);

  return null; // side-effect only
}