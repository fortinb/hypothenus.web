"use client";

import { useAppSelector } from "@/app/lib/hooks/useStore";
import { selectCartCount } from "@/app/lib/store/slices/cart-state-slice";
import { useTranslations } from "next-intl";
import Badge from "react-bootstrap/Badge";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CartBadge({ lang, brandUuid }:
	{
		lang: string;
		brandUuid: string;
	}) {
	const count = useAppSelector(selectCartCount);
	const [isClient, setIsClient] = useState<boolean>(false);
	const t = useTranslations("cart");

	useEffect(() => {
		setIsClient(true);
	}, [count]);
	const safeCount = isClient ? count : 0;

	return (
		<div className="position-relative d-inline-flex align-items-end mt-2">
			<Link className="link-element" href={`/${lang}/brands/${brandUuid}/memberships/`}>
				<i className="bi bi-cart3 icon icon-light h4 ms-2 mt-1 mb-0" aria-label={t("badge.label", { count: safeCount })}></i>
				{safeCount > 0 && (
					<Badge pill className="position-absolute top-0 start-100 translate-middle bg-secondary">
						{safeCount}
					</Badge>
				)}
			</Link>
		</div>
	);
}
