"use client";

import { useTranslation } from "@/app/i18n/i18n";
import { Coach } from "@/src//lib/entities/coach";
import { formatName } from "@/src/lib/entities/person";
import Link from "next/link";
import Card from "react-bootstrap/Card";

export default function CoachListDetails({ coach }: { coach: Coach }) {
  const { t } = useTranslation("coach");

  return (
    <div className="col-6 p-2">
      <Card>
        <Card.Body className={"m-2" + (coach.active == false ? " card-body-inactive" : "")}>
          <Card.Title >
            <Link className="link-element" href={`/gym/${coach.gymId}/coachs/${coach.id}`}> {formatName(coach.person)}</Link>
          </Card.Title>
          <Card.Text>
            <Link className="link-element" href={`mailto:${coach.person.email}`}>{coach.person.email}</Link><br />

            {coach.active == false &&
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