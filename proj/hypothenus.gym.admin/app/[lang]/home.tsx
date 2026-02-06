"use client"

import Image from 'next/image';
import Carousel from 'react-bootstrap/Carousel';
import Container from "react-bootstrap/Container";
import { useTranslations } from "next-intl";
import { Brand } from '@/src/lib/entities/brand';
import { updateBrandState } from '../lib/store/slices/brand-state-slice';
import { useAppDispatch } from '../lib/hooks/useStore';
import { useEffect } from 'react';

export default function Home({ brand }: { brand: Brand }) {
  const t = useTranslations("home");
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(updateBrandState(brand));
  }, [dispatch, brand]);

  return (
    <div className="d-flex flex-row w-100 h-100 home">
      <div className="d-flex flex-column align-items-center w-50 h-100">
        <h1 className="text-tertiary">{t("header.hypothenus")}</h1>
        <h2 className="text-primary">{t("header.title")}</h2>
      </div>
      <div className="d-flex flex-column w-50 h-100">
        <Container fluid="true" className="h-100 w-100">
          <Carousel>
            <Carousel.Item>
              <Image
                src="/images/home_gym_1.png"
                width={1024}
                height={768}
                alt={brand.name}
              />
              <Carousel.Caption>
                <h3>{t("captions.image1.title")}</h3>
                <p>{t("captions.image1.text")}</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <Image
                src="/images/home_gym_2.png"
                width={1024}
                height={768}
                alt={brand.name}
              />
              <Carousel.Caption>
                <h3>{t("captions.image2.title")}</h3>
                <p>{t("captions.image2.text")}</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Container>
      </div>
    </div>
  );
}
