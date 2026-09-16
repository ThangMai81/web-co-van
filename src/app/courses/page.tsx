import { SiteHeader } from "@/components/navigation/SiteHeader";
import { CoursesPage } from "./CoursesPage";
import { SiteFooter } from "@/components/home-page/SiteFooter";

export default function Page() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <CoursesPage />
      <SiteFooter />
    </main>
  );
}
