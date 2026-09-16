import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/home-page/SiteFooter";
import { Hero } from "@/components/coaching/Hero";
import { Audience } from "@/components/coaching/Audience";
import { VideoDemo } from "@/components/coaching/VideoDemo";
import { Process } from "@/components/coaching/Process";
import { About } from "@/components/coaching/About";
import { Packages } from "@/components/coaching/Packages";
import { CTA } from "@/components/coaching/CTA";

export function CoachingPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <Hero />
      <Audience />
      <VideoDemo />
      <Process />
      <About />
      <Packages />
      <CTA />
      <SiteFooter />
    </main>
  );
}
