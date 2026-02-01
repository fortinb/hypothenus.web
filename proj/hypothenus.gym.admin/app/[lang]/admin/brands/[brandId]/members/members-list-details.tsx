"use client";

import { useTranslations } from "next-intl";
import { Member } from "@/src//lib/entities/member";
import Link from "next/link";
import Card from "react-bootstrap/Card";
import { formatPersonName } from "@/src/lib/entities/person";
import { formatDate } from "@/app/lib/utils/dateUtils";
import { PhoneNumberTypeEnum } from "@/src/lib/entities/phoneNumber";

export default function MemberListDetails({ lang, member }: { lang: string; member: Member }) {
  const t = useTranslations("member");
  
  return (
    <div className="col-6 p-2">
      <Card>
        <Card.Body className={"m-2" + (member.isActive == false ? " card-body-inactive" : "")}>
          <Card.Title >
            <Link className="link-element" href={`/${lang}/admin/brands/${member.brandUuid}/members/${member.uuid}`}> {formatPersonName(member.person)}</Link>
          </Card.Title>
          <Card.Text>
            <Link className="link-element" href={`mailto:${member.person.email}`}>{member.person.email}</Link><br />
            <span className="text-primary">{formatDate(member.person.dateOfBirth)}</span><br />
            <span className="text-primary">{member.person.phoneNumbers.find(item => item.type === PhoneNumberTypeEnum.Mobile)?.number}</span><br />
            <span className="text-primary">{member.person.address.zipCode}</span><br />
            {member.isActive == false &&
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