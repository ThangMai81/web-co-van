import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Newsreader,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-display-raw",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700", "800"],
});

const body = Newsreader({
  variable: "--font-body-raw",
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  weight: ["400", "500"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono-raw",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Đăng & Núi — Hành trình",
  description:
    "Trang cá nhân ghi lại hành trình leo núi và dạy học của một nhà cố vấn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
