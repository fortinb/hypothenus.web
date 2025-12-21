"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Card from "react-bootstrap/Card";
import { useParams } from 'next/navigation';
import { formatAddress } from "@/src/lib/entities/address";

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
            <span className="text-primary">{formatAddress(brand.address)}</span><br />
            <Link className="link-element" href={`mailto:${brand.email}`}>{brand.email}</Link><br />
            <span className="text-primary">{brand.brandId}</span><br />

            {brand.isActive == false &&
              <div>
                <span className="font-weight-bold"><i className="bi bi-ban icon icon-danger pe-2"></i>{t("list.details.inactive")}</span><br />
              </div>
            }

          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}
