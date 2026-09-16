import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/home-page/SiteFooter";
import { Hero } from "@/components/stories/Hero";
import { WhatIsSunshine } from "@/components/stories/WhatIsSunshine";
import { JourneyInside } from "@/components/stories/JourneyInside";
import { Mission } from "@/components/stories/Mission";
import { CultureAndValues } from "@/components/stories/CultureAndValues";
import { Founder } from "@/components/stories/Founder";

export function StoriesPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <Hero />
      <WhatIsSunshine />
      <JourneyInside />
      <Mission />
      <CultureAndValues />
      <Founder />
      <SiteFooter />
    </main>
  );
}
