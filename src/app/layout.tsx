import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NGO Command Center",
  description: "Crisis management and resource coordination platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full" style={{ backgroundColor: "#faf8f5" }}>
        {children}
      </body>
    </html>
  );
}
