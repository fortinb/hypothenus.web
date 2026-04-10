"use client"

import { LocaleTranslator } from "@/i18n/create-translators";
import { LanguageEnum } from "@/src/lib/entities/enum/language-enum";
import { getMembershipPlanTermsOfUse, getMembershipPlanName, getMembershipPlanPrice, getMembershipPlanTitle, MembershipPlan } from "@/src/lib/entities/membership-plan";
import { useTranslations } from "next-intl";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function ModalBuyMembershipPlan({ tLocale, locale, membershipPlan, show, isAction, onlyDisplay = false, handleResult }:
    {
        tLocale: LocaleTranslator["t"];
        locale: string;
        membershipPlan: MembershipPlan,
        show: boolean,
        isAction: boolean;
        onlyDisplay?: boolean;
        handleResult: (addToCart: boolean, buyNow: boolean, membershipPlan: MembershipPlan) => void
    }) {
    const t = useTranslations("cart");

    function getMembershipPlanPeriod(membershipPlan: MembershipPlan): string {
        return `${tLocale(`membershipPlan.period.descriptions.${membershipPlan.period}`, { classes: membershipPlan.numberOfClasses })}`;
    }

    function getMembershipPlanBilling(membershipPlan: MembershipPlan, locale: LanguageEnum): string {
        return `${tLocale(`membershipPlan.billingFrequency.descriptions.${membershipPlan.billingFrequency}`)}`;
    }

    function splitMembershipPlanTermsOfUse(text: string): string[] {
        if (text && text.includes(";")) {
            return text.split(";").filter(line => line.trim() !== "");
        }

        return [text];
    }

    return (
        <Modal
            show={show}
            backdrop="static"
            keyboard={false}
            centered={true}
            animation={true}
            onHide={() => handleResult(false, false, membershipPlan)}
        >
            <Modal.Header closeButton={true}>
                <Modal.Title className="w-100">
                    <div className="d-flex flex-row align-items-center">
                        <span className="ms-1 text-tertiary">{getMembershipPlanName(membershipPlan, locale as LanguageEnum)}</span><br />
                    </div>
                </Modal.Title>
            </Modal.Header >
            <Modal.Body>
                <div className="d-flex flex-column justify-content-center mb-3">
                    <div className="d-flex flex-row justify-content-center">
                        <span className="my-2 me-2 card-text-larger">{getMembershipPlanPrice(membershipPlan, locale as LanguageEnum)}</span>
                        <span className="my-2 card-text-larger">{getMembershipPlanBilling(membershipPlan, locale as LanguageEnum)}</span>

                    </div>
                    <div className="d-flex flex-row justify-content-center">
                        <span className="card-text-smaller">{getMembershipPlanPeriod(membershipPlan)}</span><br />
                    </div>
                    {splitMembershipPlanTermsOfUse(getMembershipPlanTermsOfUse(membershipPlan, locale as LanguageEnum)).map((line, index) => (
                        <div key={index} className="d-flex flex-row justify-content-center">
                            <span className="card-text-smaller">{line}</span><br />
                        </div>
                    ))}
                </div>
            </Modal.Body>
            <Modal.Footer className="w-100">
                {onlyDisplay == false &&

                    <div className="d-flex flex-row justify-content-center w-100">
                        <div className="d-flex flex-column ms-2">
                            <Button className="btn btn-secondary" disabled={isAction} onClick={() => handleResult(true, false, membershipPlan)}>

                                {isAction &&
                                    <div className="spinner-border spinner-border-sm me-2"></div>
                                }

                                {isAction ? t("actions.addingToCart") : t("buttons.addToCart")}
                                <i className="icon bi bi-cart h4 ms-2"></i>

                            </Button>
                        </div>
                        <div className="d-flex flex-column ms-2">
                            <Button className="btn btn-primary" disabled={isAction} onClick={() => handleResult(false, true, membershipPlan)}>
                                {isAction &&
                                    <div className="spinner-border spinner-border-sm me-2"></div>
                                }

                                {isAction ? t("actions.buyingNow") : t("buttons.buyNow")}
                                <i className="icon bi bi-currency-dollar h4 ms-2"></i>
                            </Button>
                        </div>
                    </div>
                }
            </Modal.Footer>
        </Modal>
    );
}
