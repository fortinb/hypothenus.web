import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest } from "next/server";

const handeI18nRouting = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  let response = handeI18nRouting(request);
 // console.log('Proxy hit for:', request.nextUrl.pathname, 'method:', request.method);
  return response;
} 

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};

