import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Inter } from "next/font/google";
import LayoutWrapper from "@/components/LayoutWrapper";

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
      <body className="bg-white text-gray-900">
        {" "}
        {/* change from bg-gray-50 */}
        <Header />
        <main className="min-h-screen">{children}</main>{" "}
        {/* remove max-w/px/py here */}
        <Footer />
      </body>
    </html>
  );
}
