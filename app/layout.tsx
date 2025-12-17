import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "What If? | MCU Simulator",
  description: "One decision. Infinite universes. Explore alternate MCU realities by changing key moments in Marvel history.",
  keywords: ["MCU", "Marvel", "What If", "Multiverse", "Simulation", "Timeline"],
  authors: [{ name: "MCU What If Simulator" }],
  openGraph: {
    title: "What If? | MCU Simulator",
    description: "One decision. Infinite universes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        suppressHydrationWarning
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
