import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Signoff — Review Before You Sign",
  description:
    "Jupiter-first review layer for Solana. Simulate swaps, decode routes, and understand what you're signing before you approve.",
  keywords: [
    "Solana",
    "Jupiter",
    "swap",
    "review",
    "transaction",
    "DeFi",
    "approval",
    "multisig",
  ],
  openGraph: {
    title: "Signoff — Review Before You Sign",
    description:
      "Simulate Jupiter swaps, decode routes, and get a clear approval brief before signing on Solana.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
