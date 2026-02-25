import { signOut } from '@/src/security/auth'

export async function GET() {
  return await signOut({ redirectTo: '/', redirect: true });
}

export async function POST() {
  return await signOut({ redirectTo: '/', redirect: true });
}
