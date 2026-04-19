"use client";

import { getMembershipPlanName, getMembershipPlanPrice } from "@/src/lib/entities/membership-plan";
import { LanguageEnum } from "@/src/lib/entities/enum/language-enum";
import { useTranslations } from "next-intl";
import Button from "react-bootstrap/Button";
import { CartItem } from "@/src/lib/entities/cart/cart";

export function CartItemRow({ lang, item, isEditMode, onRemove, onUpdateQuantity }:
    {
        lang: string;
        item: CartItem;
        isEditMode: boolean;
        onRemove: (membershipPlanUuid: string) => void;
        onUpdateQuantity: (membershipPlanUuid: string, quantity: number) => void;
    }) {
    const t = useTranslations("cart");
    const lineTotal = ((item.membershipPlan.cost.amount / 100) * item.quantity).toFixed(2);

    return (
        <div className="d-flex flex-row justify-content-between align-items-center border-bottom py-2">
            <div className="d-flex flex-column flex-fill">
                <span className="text-primary">
                    {getMembershipPlanName(item.membershipPlan, lang as LanguageEnum)}
                </span>
                <span className="card-text-smaller text-muted">
                    {getMembershipPlanPrice(item.membershipPlan, lang as LanguageEnum)}
                </span>
            </div>
            <div className="d-flex flex-row align-items-center me-2">
                <Button className="btn btn-icon btn-sm" disabled={!isEditMode || item.quantity <= 1}
                    onClick={() => onUpdateQuantity(item.membershipPlan.uuid, item.quantity - 1)}>
                    <i className="icon icon-light bi bi-dash me-2 h7"></i>
                </Button>
                <span className="text-primary px-1">{item.quantity}</span>
                <Button className="btn btn-icon btn-sm" disabled={!isEditMode} onClick={() => onUpdateQuantity(item.membershipPlan.uuid, item.quantity + 1)}>
                    <i className="icon icon-light bi bi-plus me-2 h7"></i>
                </Button>
            </div>
            <div className="me-3">
                <span className="text-primary-small">
                    {lineTotal}{item.membershipPlan.cost.currency.symbol}
                </span>
            </div>
            <Button className="btn btn-icon btn-sm" onClick={() => onRemove(item.membershipPlan.uuid)} title={t("item.remove")} disabled={!isEditMode}>
                <i className="icon icon-light bi bi-trash me-2 h7"></i>
            </Button>
        </div>
    );
}
