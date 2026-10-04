import type { Metadata } from "next";
import { MissionPage } from "./MissionPage";

export const metadata: Metadata = {
  title: "Sứ mệnh — Sunshine Center",
};

export default function Page() {
  return <MissionPage />;
}
