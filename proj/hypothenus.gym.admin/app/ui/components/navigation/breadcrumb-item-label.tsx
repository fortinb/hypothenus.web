"use client";

import { useTranslations } from "next-intl";

type Props = {
  namespace: string;
  translationKey: string;
  value?: string;
};

export function BreadcrumbItemLabel({ namespace, translationKey, value }: Props) {
  if (namespace == "" && translationKey == "" && value && value.trim().length > 0) {
    return <>{value}</>;
  }

  const t = useTranslations(namespace);
  const label = t ? t(translationKey) : translationKey; // safe fallback

  return <>{label}</>;
}