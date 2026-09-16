import type { Metadata } from "next";
import { CoachingPage } from "./CoachingPage";

export const metadata: Metadata = {
  title: "Dịch vụ coaching 1:1 — Sunshine Center",
};

export default function Page() {
  return <CoachingPage />;
}
