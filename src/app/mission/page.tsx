import type { Metadata } from "next";
import { StoriesPage } from "./MissionPage";

export const metadata: Metadata = {
  title: "Sứ mệnh — Sunshine Center",
};

export default function Page() {
  return <StoriesPage />;
}
