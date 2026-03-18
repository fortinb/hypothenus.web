"use client";

import { useTranslations } from "next-intl";
import { MembershipPlan, getMembershipPlanDescription, getMembershipPlanName } from "@/src/lib/entities/membership-plan";
import { LanguageEnum } from "@/src/lib/entities/enum/language-enum";
import Link from "next/link";
import Card from "react-bootstrap/Card";

export default function MembershipPlanListDetails({ lang, membershipPlan }: { lang: string; membershipPlan: MembershipPlan }) {
  const t = useTranslations("membership-plan");

  return (
    <div className="col-6 p-2">
      <Card>
        <Card.Body className={"m-2" + (membershipPlan.isActive == false ? " card-body-inactive" : "")}>
          <Card.Title >
            <Link className="link-element" href={`/${lang}/admin/brands/${membershipPlan.brandUuid}/membership-plans/${membershipPlan.uuid}`}>
              {getMembershipPlanName(membershipPlan, lang as LanguageEnum)}
            </Link>
          </Card.Title>
          <Card.Text>
            <span className="text-primary"> {getMembershipPlanDescription(membershipPlan, lang as LanguageEnum)}</span><br />
            {membershipPlan.isActive == false &&
              <>
                <span className="font-weight-bold"><i className="bi bi-ban icon icon-danger pe-2"></i>{t("list.details.inactive")}</span><br />
              </>
            }
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}
