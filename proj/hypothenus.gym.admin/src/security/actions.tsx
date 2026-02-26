"use server"

import { signOut, } from "@/src/security/auth"

export async function logout() {
   await signOut({ redirectTo: "/", redirect: true });
}
