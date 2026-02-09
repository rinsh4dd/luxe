"use client";

import { Users, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
    // Placeholder stats
    const stats = [
        { label: "Total Revenue", value: "$45,231.89", icon: DollarSign, change: "+20.1% from last month" },
        { label: "Active Orders", value: "+2350", icon: ShoppingBag, change: "+180.1% from last month" },
        { label: "Total Products", value: "12", icon: ShoppingBag, change: "+19% from last month" },
        { label: "Active Now", value: "+573", icon: TrendingUp, change: "+201 since last hour" },
    ];

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
                        <p className="text-sm text-muted-foreground">You made 265 sales this month.</p>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <div key={i} className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">Olivia Martin</p>
                                    <p className="text-sm text-muted-foreground">olivia.martin@email.com</p>
                                </div>
                                <div className="ml-auto font-medium">+$1,999.00</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
