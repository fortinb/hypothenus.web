"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Card from "react-bootstrap/Card";

export default function UserListDetails({ lang, user }: { lang: string; user: any }) {
  const t = useTranslations("user");

  const fullName = `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim();
  const roles = (user.roles ?? []).join(", ");

  return (
    <div className="col-6 p-2">
      <Card>
        <Card.Body className={"m-2"}>
          <Card.Title>
            <Link className="link-element" href={`/${lang}/admin/users/${user.uuid}`}>
              {fullName || user.email}
            </Link>
          </Card.Title>
          <Card.Text>
            <Link className="link-element" href={`mailto:${user.email}`}>{user.email}</Link><br />
            <span className="text-primary">{roles}</span><br />

            {user.isActive == false &&
              <div>
                <span className="font-weight-bold"><i className="bi bi-ban icon icon-danger pe-2"></i>{t("list.details.inactive")}</span><br />
              </div>
            }

          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}
