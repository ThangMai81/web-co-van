import { SiteHeader } from "@/components/navigation/SiteHeader";
import { Hero } from "@/components/home-page/Hero";
import { TrailSection } from "@/components/home-page/TrailSection";
import { VideoGallery } from "@/components/home-page/VideoGallery";
import { AboutSection } from "@/components/home-page/AboutSection";
import { VoicesSection } from "@/components/home-page/VoiceSection";
import { NextTripSection } from "@/components/home-page/NextTripSection";
import { SiteFooter } from "@/components/home-page/SiteFooter";
import { FloatingContact } from "@/components/chatbot/FloatingContact";

export function HomePage() {
  return (
    <main className="min-h-screen items-center justify-center">
      <SiteHeader />
      <Hero />
      <TrailSection />
      <VideoGallery />
      <AboutSection />
      <VoicesSection />
      <NextTripSection />
      <SiteFooter />
      <FloatingContact />
    </main>
  );
}
