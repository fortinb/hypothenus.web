"use client";

import { useTranslations } from "next-intl";
import { Gym } from "@/src//lib/entities/gym";
import { formatAddress } from "@/src/lib/entities/address";
import Link from "next/link";
import Card from "react-bootstrap/Card";

export default function GymListDetails({ lang, brandId, gymId, gym }: { lang: string; brandId: string; gymId: string; gym: Gym }) {
  const t = useTranslations("gym");
  
  return (
    <div className="col-6 p-2">
      <Card>
        <Card.Body className={"m-2" + (gym.isActive == false ? " card-body-inactive" : "")}>
          <Card.Title >
            <Link className="link-element" href={`/${lang}/admin/brands/${brandId}/gyms/${gymId}`}> {gym.name}</Link>
          </Card.Title>
          <Card.Text>
            <span className="text-primary">{formatAddress(gym.address)}</span><br />
            <Link className="link-element" href={`mailto:${gym.email}`}>{gym.email}</Link><br />
            <span className="text-primary">{gym.gymId}</span><br />

            {gym.isActive == false &&
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