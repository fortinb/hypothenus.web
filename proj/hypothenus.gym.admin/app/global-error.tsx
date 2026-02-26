"use client";

import { useRouter } from "next/navigation";

export default function GlobalError() {
  const router = useRouter();   
  router.push("/error");    
}