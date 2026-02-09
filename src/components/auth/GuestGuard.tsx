"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GuestGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            // Redirect based on role
            // We need to check role from context or fetch it if missing, 
            // but AuthContext now attaches it.
            const role = (user as any).role;

            if (role === 'admin') {
                router.replace('/admin');
            } else {
                router.replace('/shop');
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (user) {
        return null; // Don't render guest content if logged in
    }

    return <>{children}</>;
}
