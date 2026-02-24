import { Breadcrumb } from '@/app/ui/components/navigation/breadcrumb';
import Home from './home';
import { getBrandByCode } from '../lib/services/brands-data-service';
import { Brand } from '@/src/lib/entities/brand';
import { failure } from '../lib/http/handle-result';

interface PageProps {
  params: Promise<{ lang: string }>; // params is now a Promise
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;
  let brand: Brand;

  try {
    brand = await getBrandByCode(process.env.NEXT_PUBLIC_BRAND_CODE as string);
  } catch (error: any) {
    return failure(error);
  }

  return (
    <main className="main-bg-gradient overflow-auto">
      <Breadcrumb
        crumb={{
          reset: true,
          id: "home.page",
          locale: `${lang}`,
          href: "",
          key: "breadcrumb",
          namespace: "home"
        }}
      />
      <Home lang={lang} brand={brand} />
    </main>
  );
}
