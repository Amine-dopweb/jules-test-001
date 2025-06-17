import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans"; // Updated font import
import "./globals.css";
import { AgendaProvider } from "@/contexts/AgendaContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "AI Powered Agenda", // Updated metadata
  description: "Organize your day, the smart way.", // Updated metadata
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Ensure geistSans.variable is correctly referenced if that's the new var name from GeistSans */}
      {/* Assuming GeistSans.className provides the necessary font class directly */}
      <body className={`${GeistSans.className} bg-slate-900 text-slate-100`}>
        <AgendaProvider>
          {/* Applied flex structure to ensure footer can be at the bottom */}
          <div className="flex flex-col min-h-screen">
            <Header />
            {/* flex-grow allows this main section to take available space */}
            {/* container mx-auto px-4 centers content and adds padding */}
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </AgendaProvider>
      </body>
    </html>
  );
}
