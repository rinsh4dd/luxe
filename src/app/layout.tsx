import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import StrictRouteGuard from "@/components/auth/StrictRouteGuard";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "LUXE | Premium E-commerce",
    description: "Modern e-commerce for premium essentials.",
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <AuthProvider>
                    <StrictRouteGuard>
                        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem>
                            <SmoothScroll>
                                <CartProvider>
                                    <WishlistProvider>
                                        <div className="flex flex-col min-h-screen bg-background text-foreground">
                                            <Navbar />
                                            <main className="flex-grow pt-16">
                                                {children}
                                            </main>
                                            <Footer />
                                        </div>
                                    </WishlistProvider>
                                </CartProvider>
                            </SmoothScroll>
                        </ThemeProvider>
                    </StrictRouteGuard>
                </AuthProvider>
            </body>
        </html>
    );
}
