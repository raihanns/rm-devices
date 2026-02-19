import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "RM Devices | Premium Tech, Delivered",
  description: "Your trusted source for high-end mobile devices from Apple and Samsung.",
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}
