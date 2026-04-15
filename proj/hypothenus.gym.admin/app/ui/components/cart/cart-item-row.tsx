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
                <span className="fw-semibold">
                    {getMembershipPlanName(item.membershipPlan, lang as LanguageEnum)}
                </span>
                <span className="card-text-smaller text-muted">
                    {getMembershipPlanPrice(item.membershipPlan, lang as LanguageEnum)}
                </span>
            </div>
            <div className="d-flex flex-row align-items-center gap-2 me-2">
                <Button
                    disabled={!isEditMode || item.quantity <= 1}
                    onClick={() => onUpdateQuantity(item.membershipPlan.uuid, item.quantity - 1)}
                >
                    <i className="bi bi-dash"></i>
                </Button>
                <span className="px-1">{item.quantity}</span>
                <Button
                    disabled={!isEditMode}
                    onClick={() => onUpdateQuantity(item.membershipPlan.uuid, item.quantity + 1)}
                >
                    <i className="bi bi-plus"></i>
                </Button>
            </div>
            <div className="me-3">
                <span className="card-text-smaller fw-semibold">
                    {lineTotal}{item.membershipPlan.cost.currency?.symbol}
                </span>
            </div>
            <Button
                onClick={() => onRemove(item.membershipPlan.uuid)}
                title={t("item.remove")}
                disabled={!isEditMode}
            >
                <i className="bi bi-trash"></i>
            </Button>
        </div>
    );
}
