import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Open ME/CFS Explorer",
  description: "AI-powered ME/CFS research discovery platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-gray-50 text-gray-900">
        <Header />
        <main className="max-w-6xl mx-auto px-6 py-16 space-y-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
