import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "MCU Doomsday Clock | Avengers: Doomsday Countdown",
  description:
    "Countdown to Avengers: Doomsday releasing December 18, 2026. Experience the cinematic countdown with immersive visuals and ambient effects.",
  keywords: [
    "Avengers Doomsday",
    "MCU",
    "Marvel",
    "Countdown",
    "Doomsday Clock",
    "Avengers 5",
    "Marvel Cinematic Universe",
    "December 2026",
    "Abhishek Kumar",
    "Abhishek KMaar",
    "KMaar",
    "Marvel Countdown Timer",
    "Avengers Doomsday Release Date",
    "MCU Phase 6",
    "Doctor Doom",
    "Robert Downey Jr",
    "Avengers 2026",
    "Marvel Movie Countdown",
    "Doomsday Movie",
    "Avengers Secret Wars",
    "MCU Multiverse",
    "Marvel Studios",
    "Superhero Movie",
    "Comic Book Movie",
  ],
  authors: [{ name: "KMaar", url: "https://kmaar.vercel.app" }],
  creator: "KMaar",
  twitter: {
    card: "summary_large_image",
    creator: "@kmaar44",
  },
  metadataBase: new URL("https://mcu-doomsday-clock.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cinzel.variable}>
        {children}
      </body>
    </html>
  );
}
