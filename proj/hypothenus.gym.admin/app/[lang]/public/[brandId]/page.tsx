import { getTranslations } from "next-intl/server";

interface PageProps {
  params: Promise<{ lang: string; brandId: string }>;
}

export default async function MemberPage({ params }: PageProps) {
  const { lang, brandId } = await params;

    const t = await getTranslations({
    locale: lang,
    namespace: "welcome"
  });

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
      </div>
      <div className="d-flex flex-column justify-content-between w-100 h-100">
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
      </div>
    </div>
  );
}