"use client"

import { useTranslations } from "next-intl";
import { BrandState } from "@/app/lib/store/slices/brand-state-slice";
import Link from "next/link";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useSelector } from "react-redux";

export default function BrandMenu({ lang, brandId }: { lang: string, brandId: string; }) {
  const brandState: BrandState = useSelector((state: any) => state.brandState);
  const t = useTranslations("brand");

  return (

    <div className="d-flex flex-column justify-content-start w-100 h-50 page-menu">
      <div className="d-flex flex-row justify-content-center">
        <h2 className="text-secondary pt-4 ps-2">{t("menu.brand", { name: brandState.brand.name })}</h2>
      </div>
      <div className="ps-2 pe-2">
        <hr />
      </div>
      <div className="d-flex flex-column h-100">
        <Container fluid={true}>
          <Row className="gx-2">
            <Col xs={6} >
              <div className="btn-navigation m-2">
                <div className="d-flex flex-column justify-content-center h-100">
                  <div className="d-flex flex-row justify-content-center">
                    <Link className={"link-element" + (brandState.brand.brandId == "" ? " link-element-disabled" : "")} href={`/${lang}/admin/brands/${brandId}`}><i className="icon icon-secondary bi bi-buildings h1 m-0"></i></Link>
                  </div>
                  <div className="d-flex flex-row justify-content-center">
                    <span className="text-primary mt-3">{t("menu.info")}</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={6} >
              <div className="btn-navigation m-2">
                <div className="d-flex flex-column justify-content-center h-100">
                  <div className="d-flex flex-row justify-content-center">
                    <Link className={"link-element" + (brandState.brand.brandId == "" ? " link-element-disabled" : "")} href={`/${lang}/admin/brands/${brandId}/gyms`}><i className="icon icon-secondary bi-building h1 m-0"></i></Link>
                  </div>
                  <div className="d-flex flex-row justify-content-center">
                    <span className="text-primary mt-3">{t("menu.gyms")}</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
