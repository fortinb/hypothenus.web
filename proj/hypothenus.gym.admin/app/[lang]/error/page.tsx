import { getTranslations } from "next-intl/server";
import Image from 'next/image';
import Container from "react-bootstrap/Container";

export default async function Error() {
  const t =  await getTranslations("layout");

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
            <h3>{t("error.boundary.title")}</h3>
          </div>
        </div>
      </Container>
    </div>
  );
}
