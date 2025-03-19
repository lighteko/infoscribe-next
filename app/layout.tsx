import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Infoscribe",
  description: "Stay informed effortlessly with AI-powered newsletters",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
          {children}
        </div>
      </body>
    </html>
  );
}
