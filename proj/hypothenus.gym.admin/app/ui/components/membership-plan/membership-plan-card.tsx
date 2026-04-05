"use client"

import { MembershipPlan, getMembershipPlanDescription, getMembershipPlanName, getMembershipPlanPrice, getMembershipPlanTitle } from "@/src/lib/entities/membership-plan";
import { LanguageEnum } from "@/src/lib/entities/enum/language-enum";
import { LocaleTranslator } from "@/i18n/create-translators";
import Card from "react-bootstrap/Card";
import Link from "next/link";

export default function MembershipPlanCard({ membershipPlan, locale, tLocale, linkActive = false }: {
    membershipPlan: MembershipPlan;
    locale: string;
    tLocale: LocaleTranslator["t"];
    linkActive?: boolean;
}) {

    function getMembershipPlanPeriod(membershipPlan: MembershipPlan): string {
        return `${tLocale(`membershipPlan.period.descriptions.${membershipPlan.period}`, { classes: membershipPlan.numberOfClasses })}`;
    }

    function getMembershipPlanBilling(membershipPlan: MembershipPlan, locale: LanguageEnum): string {
        return `${tLocale(`membershipPlan.billingFrequency.descriptions.${membershipPlan.billingFrequency}`)}`;
    }

    return (
        <Card className="card-membership-plan mb-2">
            <Card.Body className={"m-2" + (membershipPlan.active == false ? " card-body-inactive" : "")}>
                <div className="d-flex flex-column justify-content-center mb-3">
                    <Card.Title className="card card-title-membership-plan">
                        <span className="m-1">{getMembershipPlanTitle(membershipPlan, locale as LanguageEnum)}</span>
                    </Card.Title>
                    <Card.Text>
                        {linkActive == true &&
                            <Link className="link-element"
                                href={`/${locale}/admin/brands/${membershipPlan.brandUuid}/membership-plans/${membershipPlan.uuid}`}>
                                <span className="my-2 text-tertiary card-text-bolder h5">{getMembershipPlanName(membershipPlan, locale as LanguageEnum)}</span><br />
                            </Link>
                        }
                        
                        {linkActive == false &&
                            <>
                                <span className="my-2 text-tertiary card-text-bolder h5">{getMembershipPlanName(membershipPlan, locale as LanguageEnum)}</span><br />
                            </>
                        }
                        <span className="my-2 card-text-larger">{getMembershipPlanPrice(membershipPlan, locale as LanguageEnum)} </span>
                        <span className="my-2 card-text-larger">{getMembershipPlanBilling(membershipPlan, locale as LanguageEnum)} - </span>

                        <span className="card-text-smaller">{getMembershipPlanPeriod(membershipPlan)}</span><br />
                        <span className="card-text-smaller">{getMembershipPlanDescription(membershipPlan, locale as LanguageEnum)}</span>
                        {membershipPlan.active == false &&
                            <>
                                <br />
                                <span className="font-weight-bold"><i className="bi bi-ban icon icon-danger pe-2"></i>{tLocale("list.details.inactive")}</span>
                            </>
                        }
                    </Card.Text>
                </div>
            </Card.Body>
        </Card>
    );
}
