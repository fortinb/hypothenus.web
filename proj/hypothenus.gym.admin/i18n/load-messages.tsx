import { notFound } from "next/navigation";

const namespaces = [
    "action",
    "brand",
    "coach",
    "course",
    "entity",
    "gym",
    "home",
    "layout",
    "navigation",
    "translation"
] as const;

export async function loadMessages(locale: string) {
    try {
        const messages = await Promise.all(
            namespaces.map(async (ns) => ({
                [ns]: (await import(`@/messages/${locale}/${ns}.json`)).default
            }))
        );

        return Object.assign({}, ...messages);
    } catch {
        notFound();
    }
}