import Footer from "@/components/custom/Footer";
import Header from "@/components/custom/Header";
import { Toaster } from "@/components/ui/toaster";
import { BACKEND_HOST } from "@/lib/constants";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const interSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

async function generateMetadata(): Promise<Metadata> {
  try {
    const response = await fetch(`${BACKEND_HOST}/api/home`, {
      next: { revalidate: 3600 },
    });

    const { data } = await response.json();

    return {
      title: data.pageTitle || "Botoshop",
      description: data.siteDescription || "AI assisted E-commerce platform",
      metadataBase: new URL(BACKEND_HOST),
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      title: "Botoshop",
      description: "AI assisted E-commerce platform",
    };
  }
}

export const metadata = generateMetadata();
// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${interSans.variable} antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
