"use client";

import { getMembershipPlanName, getMembershipPlanPrice, MembershipPlan } from "@/src/lib/entities/membership-plan";
import { LanguageEnum } from "@/src/lib/entities/enum/language-enum";
import { useTranslations } from "next-intl";
import Button from "react-bootstrap/Button";
import { CartItem } from "@/src/lib/entities/cart/cart";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { MembershipPlanPeriodEnum } from "@/src/lib/entities/enum/membership-plan-period-enum";
import { formatCost } from "@/src/lib/entities/finance/cost";

export function CartItemRow({ lang, item, onRemove, onUpdateQuantity, isEditMode }:
    {
        lang: string;
        item: CartItem;
        onRemove: (membershipPlanUuid: string) => void;
        onUpdateQuantity: (membershipPlanUuid: string, quantity: number) => void;
        isEditMode: boolean;
    }) {
    const t = useTranslations("entity");
    const lineTotal = ((item.membershipPlan.price.amount / 100) * item.quantity).toFixed(2);

    function getMembershipPlanBilling(membershipPlan: MembershipPlan): string {
        return `${t(`membershipPlan.billingFrequency.descriptions.${membershipPlan.billingFrequency}`)}`;
    }

    return (
        <Row className="gx-2 py-2">
            <Col xs={5} className="d-flex flex-column justify-content-center">
                <span className="text-primary">
                    {getMembershipPlanName(item.membershipPlan, lang as LanguageEnum)}
                </span>
                <span className="card-text-smaller text-muted">
                    {getMembershipPlanPrice(item.membershipPlan, false)}  {getMembershipPlanBilling(item.membershipPlan)}
                </span>
            </Col>
            <Col xs={3} className="d-flex align-items-center">
                <Row className="gx-2 d-flex flex-row flex-fill justify-content-center">
                    <Col xs={4} className="d-flex flex-column justify-content-center">
                        <Button className="btn btn-icon btn-sm" disabled={item.quantity <= 1 || !isEditMode} title={t("cart.item.decreaseQuantity")}
                            onClick={() => onUpdateQuantity(item.membershipPlan.uuid, item.quantity - 1)}>
                            <i className="icon icon-light bi bi-dash"></i>
                        </Button>
                    </Col>
                    <Col xs={4} className="d-flex flex-column align-items-center justify-content-center">
                        <span className="text-primary">{item.quantity}</span>
                    </Col>
                    <Col xs={4} className="d-flex flex-column justify-content-center">
                        <Button className="btn btn-icon btn-sm"  disabled={item.membershipPlan.period === MembershipPlanPeriodEnum.trial || !isEditMode} title={t("cart.item.increaseQuantity")} onClick={() => onUpdateQuantity(item.membershipPlan.uuid, item.quantity + 1)}>
                            <i className="icon icon-light bi bi-plus"></i>
                        </Button>
                    </Col>
                </Row>
            </Col>
            <Col xs={3} className="d-flex flex-column align-items-end justify-content-center text-primary">
                <span >
                    {lineTotal}{item.membershipPlan.price.currency.symbol}
                </span>
            </Col>
            <Col xs={1} className="d-flex flex-column justify-content-center">
                <Button className="btn btn-icon btn-sm" disabled={!isEditMode} onClick={() => onRemove(item.membershipPlan.uuid)} title={t("cart.item.remove")}>
                    <i className="icon icon-light bi bi-trash"></i>
                </Button>
            </Col>
        </Row>
    );
}
