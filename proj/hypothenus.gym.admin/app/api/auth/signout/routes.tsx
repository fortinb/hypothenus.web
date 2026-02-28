import { signOut } from '@/src/security/auth'
import { redirect } from 'next/navigation';

export async function GET() {
  await signOut({ redirect: false });
  redirect('/'); // Ensure redirection happens after sign-out
}

export async function POST() {
  await signOut({ redirect: false });
  redirect('/'); // Ensure redirection happens after sign-out
}
