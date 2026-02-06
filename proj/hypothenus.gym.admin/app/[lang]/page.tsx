import { Breadcrumb } from '@/app/ui/components/navigation/breadcrumb';
import Home from './home';
import { getBrandByCode } from '../lib/services/brands-data-service';
import { redirect } from 'next/navigation';
import { Brand } from '@/src/lib/entities/brand';

interface PageProps {
  params: Promise<{ lang: string }>; // params is now a Promise
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;
  let brand: Brand;

  try {
    brand = await getBrandByCode(process.env.NEXT_PUBLIC_BRAND_CODE as string);
  } catch (error) {
    console.error("Error fetching brand:", error);
    return redirect(`/${lang}/error`);
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
      <Home brand={brand} />
    </main>
  );

}
