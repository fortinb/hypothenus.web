"use client"

import Image from 'next/image';
import Carousel from 'react-bootstrap/Carousel';
import Container from "react-bootstrap/Container";

export default function Home() {
  return (
    <main className="main-bg-gradient overflow-auto">
      <div className="d-flex flex-row w-100 h-100">
        <div className="flex-column flex-fill justify-content-between w-50 h-100">
          <Container fluid="true">
                <h1 className="text-secondary">Hypothenus</h1>
                <h2 className="text-tertiary">The ultimate fitness management software !</h2>
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
                  <h3>Manage your gym !</h3>
                  <p>The Ultimate Platform to Grow Your Fitness Business.</p>
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
                  <h3>Good Job !</h3>
                  <p>Excellent user experience</p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </Container>
        </div>
      </div>
    </main>
  );
}
/*  */ 
