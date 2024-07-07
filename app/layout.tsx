import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "./SessionProvider";
import Navbar from "@/components/Navbar";
import SubNavbar from "@/components/SubNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Website Generator",
  description: "Generate Website with a Single Click",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Navbar />
          <SubNavbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
