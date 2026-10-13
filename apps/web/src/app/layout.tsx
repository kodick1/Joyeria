import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-cormorant"
});

export const metadata: Metadata = {
  title: "Aurelia Joyería | Piezas para atesorar",
  description: "Descubre joyas contemporáneas elaboradas para acompañar tus momentos más especiales."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${cormorant.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
