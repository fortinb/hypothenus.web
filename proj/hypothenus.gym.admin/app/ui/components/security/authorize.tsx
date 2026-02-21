"use client";

import { hasAuthorization } from "@/app/lib/security/roles";
import { useSession } from "next-auth/react";

type Props = {
  roles: string | string[];
  children: React.ReactNode;
};

export function Authorize({ roles, children }: Props) {
  const { data: session, status } = useSession();

  if (status === "loading") return null;
  if (!session) return null;

  if (!hasAuthorization(session.user.roles, roles)) return null;

  return <>{children}</>;
}
