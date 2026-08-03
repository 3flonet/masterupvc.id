import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { executeQuery } from "@/utils/dbMysql";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Master UPVC Indonesia",
  description: "Produsen kusen, pintu, dan jendela UPVC berkualitas tinggi.",
};

async function getAnalyticsScript() {
  try {
    const rows = await executeQuery("SELECT analytics_script FROM settings LIMIT 1");
    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0].analytics_script || "";
    }
  } catch (err) {
    // Fallback if DB is not ready during build time
  }
  return "";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const analyticsScript = await getAnalyticsScript();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head />
      <body className="min-h-full flex flex-col">
        {analyticsScript && (
          <div dangerouslySetInnerHTML={{ __html: analyticsScript }} />
        )}
        {children}
      </body>
    </html>
  );
}
