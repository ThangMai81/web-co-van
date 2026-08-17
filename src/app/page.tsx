import Image from "next/image";
import { Hero } from "@/components/Hero";
import { SiteHeader } from "@/components/SiteHeader";
import { TrailSection } from "@/components/TrailSection";
import { VideoGallery } from "@/components/VideoGallery";
import { AboutSection } from "@/components/AboutSection";
import { VoicesSection } from "@/components/VoiceSection";
import { NextTripSection } from "@/components/NextTripSection";
import { SiteFooter } from "@/components/SiteFooter";
export default function Home() {
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
    </main>
  );
}
