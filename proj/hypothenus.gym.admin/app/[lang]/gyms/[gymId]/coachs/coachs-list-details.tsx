"use client";

import i18n, { useTranslation } from "@/app/i18n/i18n";
import { Coach } from "@/src//lib/entities/coach";
import { formatName } from "@/src/lib/entities/person";
import Link from "next/link";
import Card from "react-bootstrap/Card";
import Image from 'next/image';

export default function CoachListDetails({ coach }: { coach: Coach }) {
  const { t } = useTranslation("coach");

  return (
    <div className="col-6 p-2">
      <Card>
        <Card.Body className={"m-2" + (coach.isActive == false ? " card-body-inactive" : "")}>
          <Card.Title >
            <Link className="link-element" href={`/${i18n.resolvedLanguage}/gyms/${coach.gymId}/coachs/${coach.id}`}> {formatName(coach.person)}</Link>
          </Card.Title>
          <Card.Text>
            <Link className="link-element" href={`mailto:${coach.person.email}`}>{coach.person.email}</Link><br />

            {coach.isActive == false &&
              <div>
                <span className="font-weight-bold"><i className="bi bi-ban icon icon-danger pe-2"></i>{t("list.details.inactive")}</span><br />
              </div>
            }

          </Card.Text>
          <Image
            src={coach.person?.photoUri ? (URL.canParse(coach.person.photoUri) ? coach.person.photoUri : "/images/person.png") : "/images/person.png"}
            width={100}
            height={100}
            alt="Coach photo"
        />
        </Card.Body>
      </Card>
      
    </div>
  );
}