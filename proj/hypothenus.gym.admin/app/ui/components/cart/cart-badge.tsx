"use client";

import { useAppSelector } from "@/app/lib/hooks/useStore";
import { selectCartCount } from "@/app/lib/store/slices/cart-state-slice";
import { useTranslations } from "next-intl";
import Badge from "react-bootstrap/Badge";

export function CartBadge() {
	const count = useAppSelector(selectCartCount);
	const t = useTranslations("cart");

	return (
		<div className="position-relative d-inline-flex align-items-center">
			<i
				className="bi bi-cart3 h4 mb-0"
				aria-label={t("badge.ariaLabel", { count })}
			></i>
			{count > 0 && (
				<Badge
					pill
					bg="primary"
					className="position-absolute top-0 start-100 translate-middle"
				>
					{count}
				</Badge>
			)}
		</div>
	);
}
