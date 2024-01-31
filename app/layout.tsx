import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "SF Compute",
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
