"use client"

import { MembershipPlan, getMembershipPlanDescription, getMembershipPlanName, getMembershipPlanPrice, getMembershipPlanTitle } from "@/src/lib/entities/membership-plan";
import { LanguageEnum } from "@/src/lib/entities/enum/language-enum";
import { LocaleTranslator } from "@/i18n/create-translators";
import Card from "react-bootstrap/Card";
import Link from "next/link";
import { formatDate } from "@/app/lib/utils/dateUtils";
import { useState } from "react";
import ModalBuyMembershipPlan from "../membership/modal-buy-membership-plan";
import { useRouter } from "next/navigation";

export default function MembershipPlanCard({ membershipPlan, tLocale, lang, linkActive = false, onlyDisplay = false }: {
    membershipPlan: MembershipPlan;
    tLocale: LocaleTranslator["t"];
    lang: string;
    linkActive?: boolean;
    onlyDisplay?: boolean;
}) {
    const router = useRouter();
    const [showMembershipPlanDetailModal, setShowMembershipPlanDetailModal] = useState(false);

    function getMembershipPlanPeriod(membershipPlan: MembershipPlan): string {
        return `${tLocale(`membershipPlan.period.descriptions.${membershipPlan.period}`, { classes: membershipPlan.numberOfClasses })}`;
    }

    function getMembershipPlanBilling(membershipPlan: MembershipPlan, lang: LanguageEnum): string {
        return `${tLocale(`membershipPlan.billingFrequency.descriptions.${membershipPlan.billingFrequency}`)}`;
    }

    function getMembershipPlanDates(membershipPlan: MembershipPlan, lang: LanguageEnum): string {
        return `${tLocale(`membershipPlan.dates.descriptions.activationPeriod`, { startDate: formatDate(membershipPlan.startDate), endDate: formatDate(membershipPlan.endDate) })}`;
    }

    return (
        <>
            <div className="clickable" onClick={() => {
                if (linkActive) {
                    router.push(`/${lang}/admin/brands/${membershipPlan.brandUuid}/membership-plans/${membershipPlan.uuid}`);
                } else
                    setShowMembershipPlanDetailModal(true);
            }
            }>
                <Card className="card-membership-plan mb-2">
                    <Card.Body className={"m-2" + (membershipPlan.active == false ? " card-body-inactive" : "")}>
                        <div className="d-flex flex-column justify-content-center mb-3">
                            <Card.Title className="card card-title-membership-plan">
                                <span className="m-1">{getMembershipPlanTitle(membershipPlan, lang as LanguageEnum)}</span>
                            </Card.Title>
                            <Card.Text>
                                <>
                                    <span className="my-2 text-tertiary card-text-bolder h5">{getMembershipPlanName(membershipPlan, lang as LanguageEnum)}</span><br />

                                    <span className="my-2 card-text-larger">{getMembershipPlanPrice(membershipPlan, lang as LanguageEnum)} </span>
                                    <span className="my-2 card-text-larger">{getMembershipPlanBilling(membershipPlan, lang as LanguageEnum)} - </span>

                                    <span className="card-text-smaller">{getMembershipPlanPeriod(membershipPlan)}</span><br />
                                    <span className="card-text-smaller">{getMembershipPlanDescription(membershipPlan, lang as LanguageEnum)}</span>

                                    {membershipPlan.active == false &&
                                        <>
                                            <br />
                                            <span className="font-weight-bold"><i className="bi bi-ban icon icon-danger pe-2"></i>{tLocale("list.details.inactive")}</span>
                                        </>
                                    }

                                    {membershipPlan.promotional == true && membershipPlan.endDate &&
                                        <>
                                            <br />
                                            <span className="my-2 text-primary card-text-bolder">{getMembershipPlanDates(membershipPlan, lang as LanguageEnum)}</span><br />
                                        </>
                                    }
                                </>
                            </Card.Text>
                        </div>
                    </Card.Body>
                </Card>
            </div>
            <ModalBuyMembershipPlan membershipPlan={membershipPlan} tLocale={tLocale} onlyDisplay={onlyDisplay} locale={lang}
                isAction={false} show={showMembershipPlanDetailModal} handleResult={(addToCart: boolean, buyNow: boolean, membershipPlan: MembershipPlan) => setShowMembershipPlanDetailModal(false)} />
        </>
    );
}
