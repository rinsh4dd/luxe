"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function StrictRouteGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Wait for auth to initialize
        if (loading) return;

        const checkAccess = () => {
            // 1. ADMIN RULES
            // Admin must ONLY access /admin/*
            if (user && (user as any).role === 'admin') {
                if (!pathname.startsWith('/admin')) {
                    router.replace('/admin/dashboard');
                    return;
                }
            }

            // 2. USER RULES
            // User cannot access /admin/*
            if (user && (user as any).role !== 'admin') {
                if (pathname.startsWith('/admin')) {
                    router.replace('/');
                    return;
                }
            }

            // 3. GUEST RULES
            // Guest cannot access /admin, /cart, /orders, /profile
            if (!user) {
                const protectedRoutes = ['/admin', '/cart', '/orders', '/profile'];
                if (protectedRoutes.some(route => pathname.startsWith(route))) {
                    router.replace('/login');
                    return;
                }
            }

            // Access granted
            setIsChecking(false);
        };

        checkAccess();

    }, [user, loading, pathname, router]);

    // Show loading while auth is loading OR while we are verifying the route
    if (loading || isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <>{children}</>;
}
