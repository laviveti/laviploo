import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { Toaster as ToastSonner } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LaviPloo - Visualize suas informações Ploomes",
  description:
    "Plataforma moderna de visualização de dados para API Ploomes. Interface elegante, dashboards personalizados e automações para sua equipe de vendas.",
  keywords: ["Ploomes", "CRM", "Dashboard", "Visualização de dados", "Vendas", "Automação", "LaviPloo"],
  authors: [{ name: "Lavive TI" }],
  creator: "Lavive TI",
  publisher: "Lavive TI",
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "LaviPloo - Visualize suas informações Ploomes",
    description:
      "Plataforma moderna de visualização de dados para API Ploomes. Interface elegante, dashboards personalizados e automações para sua equipe de vendas.",
    siteName: "LaviPloo",
  },
  twitter: {
    card: "summary_large_image",
    title: "LaviPloo - Visualize suas informações Ploomes",
    description:
      "Plataforma moderna de visualização de dados para API Ploomes. Interface elegante, dashboards personalizados e automações para sua equipe de vendas.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang='pt-BR' suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ToastSonner theme='light' richColors />
          {children}
        </body>
      </html>
    </Providers>
  );
}
