import { getTranslations } from 'next-intl/server';
import { Breadcrumb } from '../ui/components/navigation/breadcrumb';
import Home from './home';

interface PageProps {
  params: { lang: string };
}

export default async function HomePage({ params }: PageProps) {
  const t = await getTranslations({ locale: params.lang, namespace: "home" });

  return (
    <main className="main-bg-gradient overflow-auto">
      <Breadcrumb
        crumb={{
          reset: true,
          id: "home.page",
          href: `/${params.lang}`,
          crumb: t("breadcrumb")
        }}
      />
      <Home />
    </main>
  );
}
