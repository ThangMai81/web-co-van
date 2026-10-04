import { SiteHeader } from "@/components/navigation/SiteHeader";
import ProgramsPage from "./ProgramsPage";
import { SiteFooter } from "@/components/home-page/SiteFooter";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; status?: string; sort?: string }>;
}) {
  const params = await searchParams;
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <ProgramsPage
        category={params.category}
        status={params.status}
        sort={params.sort}
      />
      <SiteFooter />
    </main>
  );
}
