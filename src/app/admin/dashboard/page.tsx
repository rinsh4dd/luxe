"use client";

import { Users, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
    // Placeholder stats
    const [stats, setStats] = useState([
        { label: "Total Revenue", value: "$0.00", icon: DollarSign, change: "Coming Soon" },
        { label: "Active Orders", value: "0", icon: ShoppingBag, change: "Coming Soon" },
        { label: "Total Products", value: "...", icon: ShoppingBag, change: "Loading..." },
        { label: "Total Users", value: "...", icon: Users, change: "Loading..." },
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { getFirestore, collection, getDocs } = await import("firebase/firestore/lite");
                const { app } = await import("@/lib/firebase");
                const db = getFirestore(app);

                const productsColl = collection(db, "products");
                const usersColl = collection(db, "users");

                const productsSnapshot = await getDocs(productsColl);
                const usersSnapshot = await getDocs(usersColl);

                setStats(prev => [
                    prev[0],
                    prev[1],
                    { ...prev[2], value: productsSnapshot.size.toString(), change: "Updated just now" },
                    { ...prev[3], value: usersSnapshot.size.toString(), change: "Updated just now" }
                ]);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Overview of your store's performance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="p-6 bg-card rounded-xl border border-border shadow-sm">
                            <div className="flex items-center justify-between space-y-0 pb-2">
                                <span className="text-sm font-medium text-muted-foreground">
                                    {stat.label}
                                </span>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.change}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 bg-card rounded-xl border border-border p-6 shadow-sm">
                    <div className="mb-4">
                        <h3 className="font-semibold text-lg">Recent Sales</h3>
                        <p className="text-sm text-muted-foreground">Sales data coming soon.</p>
                    </div>
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
                        No recent sales to display.
                    </div>
                </div>
            </div>
        </div>
    );
}
