import { RoleEnum, User, newUser } from "@/src/lib/entities/user";
import UserForm from "./user-form";
import UserMenu from "./user-menu";
import { getUser } from "@/app/lib/services/users-data-service";
import { Breadcrumb } from "@/app/ui/components/navigation/breadcrumb";
import { redirect } from "next/navigation";
import { auth } from "@/src/security/auth";
import { RoleSelectedItem } from "@/src/lib/entities/ui/role-selected-item";
import { getTranslations } from "next-intl/server";
import { failure } from "@/app/lib/http/handle-result";

interface PageProps {
    params: Promise<{ lang: string; userId: string }>;
}

export default async function UserPage({ params }: PageProps) {
    const { lang, userId } = await params;

    const session = await auth();
    if (!session) {
        redirect('/');
    }
    const t = await getTranslations({
        locale: lang,
        namespace: "entity"
    });

    let user: User;

    try {
        if (userId === "new") {
            user = newUser();
        } else {
            user = await getUser(userId);
        }
    } catch (error: any) {
        failure(error);
        redirect(`/${lang}/error`);
    }

    const availableRoleItems: RoleSelectedItem[] = (Object.values(RoleEnum) as RoleEnum[]).map((role: RoleEnum) => ({
        role: role,
        label: t(`user.roles.${role}`),
        value: role,
    } as RoleSelectedItem));

    const initialSelectedRoleItems = availableRoleItems
        .filter((item) => user.roles?.some((selected) => selected === item.role))
        .sort((a, b) => a.label.localeCompare(b.label));

    return (
        <div className="d-flex justify-content-between w-100 h-100">
            <Breadcrumb
                crumb={{
                    reset: false,
                    id: "user.[userId].page",
                    locale: `${lang}`,
                    href: `/admin/users/${userId}`,
                    key: "",
                    value: user.firstname + ' ' + (user.lastname ?? ''),
                    namespace: ""
                }}
            />

            <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
                <UserMenu lang={lang} user={user} />
            </div>
            <div className="d-flex flex-column justify-content-between w-50 h-100">
                <UserForm lang={lang} user={user} initialAvailableRoleItems={availableRoleItems} initialSelectedRoleItems={initialSelectedRoleItems} />
            </div>
            <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
            </div>
        </div>
    );
}
