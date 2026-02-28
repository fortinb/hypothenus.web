import { notFound } from "next/navigation";
import { debugLog } from "@/app/lib/utils/debug";

const namespaces = [
    "action",
    "brand",
    "user",
    "coach",
    "course",
    "entity",
    "errors",
    "gym",
    "member",
    "home",
    "layout",
    "navigation",
    "translation",
    "welcome"
] as const;

export async function loadMessages(locale: string) {
    try {
        const messages = await Promise.all(
            namespaces.map(async (ns) => ({
                [ns]: (await import(`../messages/${locale}/${ns}.json`)).default
            }))
        );

        return Object.assign({}, ...messages);
    } catch (error:any){
        debugLog('load i18n messages error:', error);
        notFound();
    }
}