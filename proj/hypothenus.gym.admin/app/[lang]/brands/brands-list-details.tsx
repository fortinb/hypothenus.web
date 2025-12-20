"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Card from "react-bootstrap/Card";
import { useParams } from 'next/navigation';

export default function BrandListDetails({ brand }: { brand: any }) {
  const t = useTranslations("brand");
  const params = useParams<{ lang: string }>();
  return (
    <div className="col-6 p-2">
      <Card>
        <Card.Body className={"m-2"}>
          <Card.Title>
            <Link className="link-element" href={`/${params.lang}/brands/${brand.brandId}`}>
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
