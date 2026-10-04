import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/home-page/SiteFooter";
import { Hero } from "@/components/mission/Hero";
import { WhatIsSunshine } from "@/components/mission/WhatIsSunshine";
import { JourneyInside } from "@/components/mission/JourneyInside";
import { Mission } from "@/components/mission/Mission";
import { CultureAndValues } from "@/components/mission/CultureAndValues";
import { Founder } from "@/components/mission/Founder";

export function MissionPage() {
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
