import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brownie Vote",
  description: "Vote for your favorite brownie.",
  icons: {
    icon: "https://www.scheels.com/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
