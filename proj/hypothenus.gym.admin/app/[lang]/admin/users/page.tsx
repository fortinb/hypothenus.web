import { Breadcrumb } from "@/app/ui/components/navigation/breadcrumb";
import { auth } from "@/src/security/auth";
import { redirect } from "next/navigation";
import UsersMenu from "./users-menu";
import UsersListPaging from "./users-list-paging";


interface PageProps {
  params: Promise<{ lang: string }>; // params is now a Promise
}

export default async function UsersPage({ params }: PageProps) {
  const { lang } = await params;
  const session = await auth();

  if (!session) {
    redirect("/");
  }

   return (
    <div className="d-flex justify-content-between w-100 h-100">
      <Breadcrumb
        crumb={{
          reset: false,
          id: "users.page",
          locale: `${lang}`,
          href: "/admin/users",
          key: "breadcrumb",
          namespace: "user"
        }}
      />

      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-5">
        <UsersMenu lang={lang} />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <UsersListPaging lang={lang} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100">
      </div>
    </div>
  );
}
