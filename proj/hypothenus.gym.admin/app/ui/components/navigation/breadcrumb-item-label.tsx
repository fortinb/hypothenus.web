"use client";

import { useTranslations } from "next-intl";

type Props = {
  namespace: string;
  translationKey: string;
};

export function BreadcrumbItemLabel({ namespace, translationKey }: Props) {
  const t = useTranslations(namespace);
  const label = t ? t(translationKey) : translationKey; // safe fallback

  return <>{label}</>;
}