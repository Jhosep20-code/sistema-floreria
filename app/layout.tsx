import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MobileNav from "@/components/layout/mobile-nav";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Amor en Pétalos",
    description: "Sistema interno de gestión para florería",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Amor en Pétalos",
    },
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: '#FFC4D6',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className={inter.className}>
                <div className="min-h-screen pb-20">
                    {children}
                </div>
                <MobileNav />
            </body>
        </html>
    );
}
