import { getTranslations } from "next-intl/server";
import { Breadcrumb } from '@/app/ui/components/navigation/breadcrumb';
import Signin from "./signin";

interface PageProps {
  params: Promise<{ lang: string}>;
}

export default async function SigninPage({ params }: PageProps) {
  const { lang } = await params;

  const t = await getTranslations({
    locale: lang,
    namespace: "welcome"
  });

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <Breadcrumb
        crumb={{
          reset: false,
          id: "signin.page",
          locale: `${lang}`,
          href: `/${lang}/public/signin`,
          key: "breadcrumb.signin",
          namespace: "welcome"
        }}
      />
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
      </div>
      <div className="d-flex flex-row w-100 h-100">
        <Signin lang={lang} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
      </div>
    </div>
  );
}