import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Plus_Jakarta_Sans({
  variable: "--font-display-raw",
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700", "800"],
});

const body = Inter({
  variable: "--font-body-raw",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono-raw",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Sunshine Center — Giá trị tạo nên thương hiệu",
  description:
    "Sunshine Center - nơi tạo nên những giá trị bền vững cho cộng đồng.",
  icons: {
    icon: "/images/Sunshine_brand_without_slogan.png",
    shortcut: "/images/Sunshine_brand_without_slogan.png",
    apple: "/images/Sunshine_brand_without_slogan.png",
  },
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
