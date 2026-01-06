import { Breadcrumb } from '@/app/ui/components/navigation/breadcrumb';
import Home from './home';

interface PageProps {
  params: { lang: string };
}

export default async function HomePage({ params }: PageProps) {

  return (
    <main className="main-bg-gradient overflow-auto">
      <Breadcrumb
        crumb={{
          reset: true,
          id: "home.page",
          href: `/${params.lang}`,
          key: "breadcrumb",
          namespace: "home"
        }}
      />
      <Home />
    </main>
  );
}
