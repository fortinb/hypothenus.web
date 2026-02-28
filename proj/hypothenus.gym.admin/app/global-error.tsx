"use client";

import { Container } from "react-bootstrap";
import Image from 'next/image';

export default function GlobalError() {
 
  return (

    <div className="d-flex flex-row w-100 h-100">
      <Container fluid="true" className="h-100 w-100">
        <div className="d-flex flex-row h100 w-100 justify-content-between">
          <div className="w-50">
            <Image
              src="/images/error_page.jpg"
              width={800}
              height={900}
              alt="Hypothenus"
            />
          </div>
          <div className="w-50">
            <h3>Something went wrong / Une erreur est survenue</h3>
            <button className="btn btn-primary" type="button" onClick={() => window.location.href = "/"}>
              Go to homepage / Aller à la page d'accueil
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}