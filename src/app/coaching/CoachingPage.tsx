import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/home-page/SiteFooter";
import { Hero } from "@/components/coaching/Hero";
import { Audience } from "@/components/coaching/Audience";
import { VideoDemo } from "@/components/coaching/VideoDemo";
import { Process } from "@/components/coaching/Process";
import { ProcessVideo } from "@/components/coaching/ProcessVideo";
import { About } from "@/components/coaching/About";
import { CTA } from "@/components/coaching/CTA";
import { FAQ } from "@/components/coaching/FAQ";

export function CoachingPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <Hero />
      <Audience />
      <VideoDemo />
      <Process />
      <ProcessVideo />
      <About />
      <FAQ />
      <CTA />
      <SiteFooter />
    </main>
  );
}
