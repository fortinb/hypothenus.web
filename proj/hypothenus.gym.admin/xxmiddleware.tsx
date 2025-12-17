import { NextRequest, NextResponse } from "next/server";
import i18n, {changeLanguage, fallbackLanguage, languageCookieName, supportedLanguages} from "./app/i18n/i18n";


export function xxmiddleware(req: NextRequest) {
    if (req.nextUrl.pathname.indexOf('icon') > -1 || req.nextUrl.pathname.indexOf('chrome') > -1) {
        return NextResponse.next();
    }

    const pathname = req.nextUrl.pathname;
   
    const pathnameIsMissingLocale = supportedLanguages.every(
        (locale) => 
            !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );
   
    if (pathnameIsMissingLocale) {
        const locale = i18n.resolvedLanguage ?? fallbackLanguage;
    
        return NextResponse.redirect(
            new URL(
                `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
                req.url,
            ),
        );
    }
 
    const languageRequested = supportedLanguages.find((language) => pathname.startsWith(`/${language}`)) ?? fallbackLanguage;
    if (languageRequested && languageRequested !== i18n.resolvedLanguage) {
        changeLanguage(languageRequested);
    }

    const response = NextResponse.next();
    response.cookies.set(languageCookieName, languageRequested);
    return response;
}

export const config = {
    matcher: ["/((?!api|images_next/|static|.*\\..*|_next/images|favicon.ico).*)"]
}