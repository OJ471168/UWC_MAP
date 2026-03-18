import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UWC MAP",
  description: "UWC MAP Landing Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
