import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ILS Tracker — Work Obligation Tracker",
  description: "Innovative Learning Specialist work tracker for managing library, tech lessons, GT, IT support, and more",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ILS Tracker",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#2563EB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-[#F9FAFB] dark:bg-[#0F0F14] text-[#111827] dark:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
