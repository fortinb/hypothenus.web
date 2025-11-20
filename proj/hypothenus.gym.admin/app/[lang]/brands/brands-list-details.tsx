"use client";

import i18n, { useTranslation } from "@/app/i18n/i18n";
import Link from "next/link";
import Card from "react-bootstrap/Card";

export default function BrandListDetails({ brand }: { brand: any }) {
  const { t } = useTranslation("brand");

  return (
    <div className="col-6 p-2">
      <Card>
        <Card.Body className={"m-2"}>
          <Card.Title>
            <Link className="link-element" href={`/${i18n.resolvedLanguage}/brands/${brand.brandId}`}>
              {brand.name}
            </Link>
          </Card.Title>
          <Card.Text>
            {/* Add brand-specific details here if needed */}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}
