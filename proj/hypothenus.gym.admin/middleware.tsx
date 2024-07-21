import { NextRequest, NextResponse } from "next/server";
import i18n, {supportedLanguages} from "./app/i18n/i18n";


export function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;
  
    const pathnameIsMissingLocale = supportedLanguages.every(
        (locale) => 
            !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );
    console.log ("pathname : " + pathname);
    console.log ("missing locale: " + pathnameIsMissingLocale);
    if (pathnameIsMissingLocale) {
        const locale = i18n.resolvedLanguage;

        return NextResponse.redirect(
            new URL(
                `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
                req.url,
            ),
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|images_next/|static|.*\\..*|_next/images|favicon.ico).*)"]
}