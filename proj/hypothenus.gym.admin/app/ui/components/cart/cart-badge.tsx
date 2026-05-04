"use client";

import { useAppSelector } from "@/app/lib/hooks/useStore";
import { selectCartCount } from "@/app/lib/store/slices/cart-state-slice";
import { useTranslations } from "next-intl";
import Badge from "react-bootstrap/Badge";
import Link from "next/link";

export function CartBadge({ lang, brandUuid }:
	{
		lang: string;
		brandUuid: string;
	}) {
	const count = useAppSelector(selectCartCount);
	const t = useTranslations("cart");

	return (
		<div className="d-flex flex-row justify-content-center align-items-center">
			<div className="position-relative d-inline-flex align-items-center">
				<Link className="link-element" href={`/${lang}/members/${brandUuid}/memberships/`}>
					<i className="bi bi-cart3 icon icon-light h4 ms-2 mt-1 mb-0" aria-label={t("badge.label", { count: count })}></i>
					{count > 0 && (
						<Badge pill className="position-absolute top-0 start-100 translate-middle bg-secondary">
							{count}
						</Badge>
					)}
				</Link>
			</div>
		</div>
	);
}
