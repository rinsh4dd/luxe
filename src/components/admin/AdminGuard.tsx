"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login?redirect=/admin");
            } else if ((user as any).role !== "admin") {
                // For now, nice alert, eventually a dedicated 403 page
                alert("Access Denied: Admin privileges required.");
                router.push("/");
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

    if (!user || (user as any).role !== "admin") {
        return null; // Don't render anything while redirecting
    }

    return <>{children}</>;
}
