import type { Metadata } from "next";
import { StoriesPage } from "./StoriesPage";

export const metadata: Metadata = {
  title: "Câu chuyện RNI — Sunshine Center",
};

export default function Page() {
  return <StoriesPage />;
}
