"use client"

import Image from 'next/image';
import Carousel from 'react-bootstrap/Carousel';
import Container from "react-bootstrap/Container";
import { useTranslations } from "next-intl";
import Signin from './public/signin/signin';

export default function Home({ lang }: { lang: string;}) {
  const t = useTranslations("home");

  return (
    <div className="d-flex flex-row w-100 h-100 home">
      <div className="d-flex flex-column align-items-center w-50 h-100">
        <div className="d-flex flex-row w-100 h-100">
          <Signin lang={lang} />
        </div>
      </div>
      <div className="d-flex flex-column w-50 h-100">
        <Container fluid="true" className="h-100 w-100">
          <Carousel>
            <Carousel.Item>
              <Image
                src="/images/home_gym_1.png"
                width={1024}
                height={768}
                alt=""
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
                alt=""
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
