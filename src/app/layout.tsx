import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Inter } from "next/font/google";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata = {
  title: "Open ME/CFS — Collaborative ME/CFS Research & Education Platform",
  description:
    "A patient-led project advancing understanding, clinical education, and global collaboration around ME/CFS. Built to empower both patients and providers.",
  keywords: [
    "ME/CFS",
    "Myalgic Encephalomyelitis",
    "Chronic Fatigue Syndrome",
    "Long COVID",
    "post-exertional malaise",
    "pacing",
    "autonomic dysfunction",
    "Open ME/CFS",
    "patient-led research",
    "clinical education",
  ],
  authors: [{ name: "Open ME/CFS" }],
  creator: "Open ME/CFS",
  publisher: "Open ME/CFS",
  metadataBase: new URL("https://openmecfs.org"),
  openGraph: {
    title: "Open ME/CFS — Collaborative ME/CFS Research & Education Platform",
    description:
      "A patient-led platform for research, education, and advocacy around ME/CFS and related post-viral illnesses.",
    url: "https://openmecfs.org",
    siteName: "Open ME/CFS",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Open ME/CFS website preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open ME/CFS — Collaborative ME/CFS Research & Education Platform",
    description:
      "Patient-led project advancing understanding and care for ME/CFS.",
    creator: "@openmecfs",
    images: ["/og-image.jpg"],
  },
};

const inter = Inter({ subsets: ["latin"] });

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
