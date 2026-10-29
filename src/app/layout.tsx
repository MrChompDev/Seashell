import type { Metadata } from "next";
import { Poppins, Great_Vibes } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const script = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Seashell Customs — Designs, Bots, Websites & Uniforms",
    template: "%s — Seashell Customs",
  },
  description:
    "Home of the premades. Premium graphics, Discord bots, websites and ER:LC liveries & uniforms — made easy.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} ${script.variable}`}>
      <body>{children}</body>
    </html>
  );
}
