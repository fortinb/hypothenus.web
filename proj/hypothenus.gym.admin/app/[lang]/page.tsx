import { Breadcrumb } from '@/app/ui/components/navigation/breadcrumb';
import Home from './home';

interface PageProps {
  params: Promise<{ lang: string }>; // params is now a Promise
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;
 
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
      <Home />
    </main>
  );

}
