"use client"

import Image from 'next/image';
import Carousel from 'react-bootstrap/Carousel';
import Container from "react-bootstrap/Container";
import { useTranslation } from '../i18n/i18n';

export default function Home() {
  const { t } = useTranslation("home");

  return (
    <main className="main-bg-gradient overflow-auto">
      <div className="d-flex flex-row w-100 h-100">
        <div className="flex-column flex-fill justify-content-between w-50 h-100">
          <Container fluid="true">
                <h1 className="text-tertiary">{t("header.hypothenus")}</h1>
                <h2 className="text-primary">{t("header.title")}</h2>
          </Container>
        </div>
        <div className="flex-column flex-fill justify-content-between w-50 h-100">
          <Container fluid="true" className="h-100 w-100">
            <Carousel>
              <Carousel.Item>
                <Image
                  src="/images/home_gym_1.png"
                  width={1024}
                  height={768}
                  alt="Hypothenus"
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
                  alt="Hypothenus"
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
    </main>
  );
}
