import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "SFC Reservations",
  description: "Reserve GPUs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-[url('/assets/bg.svg')]">
        <div className="min-h-screen flex flex-col items-center">
          {children}
        </div>
        <Toaster richColors />
      </body>
    </html>
  );
}
