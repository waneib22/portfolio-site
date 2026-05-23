import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ibrahima-wane.vercel.app"),
  title: "Ibrahima Wane | Data Scientist",
  description:
    "Data scientist building ML systems end to end — from raw data to explainable models and deployed services. Projects in credit risk, MLOps, and inverse reinforcement learning.",
  openGraph: {
    title: "Ibrahima Wane | Data Scientist",
    description:
      "ML systems end to end — explainable models, MLOps, and deployed services. Case studies in credit risk, road-accident MLOps, and Bayesian IRL.",
    url: "/",
    siteName: "Ibrahima Wane",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ibrahima Wane | Data Scientist",
    description:
      "ML systems end to end — explainable models, MLOps, and deployed services.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${fraunces.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
