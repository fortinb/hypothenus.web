"use client";

import { useTranslations } from "next-intl";
import { Member } from "@/src//lib/entities/member";
import Link from "next/link";
import Card from "react-bootstrap/Card";
import { formatPersonName } from "@/src/lib/entities/person";
import { formatDate } from "@/app/lib/utils/dateUtils";
import Image from 'next/image';
import { PhoneNumberTypeEnum } from "@/src/lib/entities/enum/phone-number-type-enum";

export default function MemberListDetails({ lang, member }: { lang: string; member: Member }) {
  const t = useTranslations("member");

  return (
    <div className="col-6 p-2">
      <Card className="card-min-height">
        <Card.Body className={"m-2" + (member.active == false ? " card-body-inactive" : "")}>
          <Card.Title >
            <Link className="link-element" href={`/${lang}/admin/brands/${member.brandUuid}/members/${member.uuid}`}> {formatPersonName(member.person)}</Link>
          </Card.Title>
          <Card.Text>
            <Link className="link-element" href={`mailto:${member.person.email}`}>{member.person.email}</Link><br />
            <span className="text-primary">{formatDate(member.person.dateOfBirth)}</span><br />
            <span className="text-primary">{member.person.phoneNumbers.find(item => item.type === PhoneNumberTypeEnum.mobile)?.number}</span><br />
            <span className="text-primary">{member.person.address.zipCode}</span><br />
            {member.active == false &&
              <>
                <span className="font-weight-bold"><i className="bi bi-ban icon icon-danger pe-2"></i>{t("list.details.inactive")}</span><br />
              </>
            }
          </Card.Text>
          <Image
            src={member.person?.photoUri ? (URL.canParse(member.person.photoUri) ? member.person.photoUri : "/images/person.png") : "/images/person.png"}
            width={100}
            height={100}
            alt="Member photo"
          />
        </Card.Body>
      </Card>
    </div>
  );
}