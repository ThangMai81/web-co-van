import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/home-page/SiteFooter";
import { StoriesList } from "@/components/stories/StoriesList";

export function StoriesPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <StoriesList />
      <SiteFooter />
    </main>
  );
}
