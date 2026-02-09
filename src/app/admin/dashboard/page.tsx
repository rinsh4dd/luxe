"use client";

import { Users, User, ShoppingBag, DollarSign, ArrowUpRight, ArrowRight, Package, Loader2, TrendingUp, ShoppingCart } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{
        productsCount: number;
        usersCount: number;
        orders: any[];
    }>({
        productsCount: 0,
        usersCount: 0,
        orders: []
    });

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { getFirestore, collection, getDocs, query, orderBy } = await import("firebase/firestore/lite");
                const { app } = await import("@/lib/firebase");
                const db = getFirestore(app);

                const [productsSnap, usersSnap, ordersSnap] = await Promise.all([
                    getDocs(collection(db, "products")),
                    getDocs(collection(db, "users")),
                    getDocs(query(collection(db, "orders"), orderBy("createdAt", "asc")))
                ]);

                setData({
                    productsCount: productsSnap.size,
                    usersCount: usersSnap.size,
                    orders: ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                });
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Analytics Aggregation
    const analytics = useMemo(() => {
        const deliveredOrders = data.orders.filter(o => o.status === "delivered");
        const totalRevenue = deliveredOrders.reduce((acc, curr) => acc + curr.total, 0);
        const activeOrders = data.orders.filter(o => o.status !== "delivered" && o.status !== "cancelled").length;

        // Group by Date for Charts (last 7 days or all if less)
        const dailyDataMap: { [key: string]: { date: string, orders: number, revenue: number } } = {};

        data.orders.forEach(order => {
            const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
            if (!dailyDataMap[dateStr]) {
                dailyDataMap[dateStr] = { date: dateStr, orders: 0, revenue: 0 };
            }
            dailyDataMap[dateStr].orders += 1;
            if (order.status === "delivered") {
                dailyDataMap[dateStr].revenue += order.total;
            }
        });

        const chartData = Object.values(dailyDataMap).slice(-7);

        return {
            totalRevenue,
            activeOrders,
            chartData
        };
    }, [data.orders]);

    const stats = [
        { label: "Revenue Flow", value: `₹${analytics.totalRevenue.toLocaleString()}`, icon: DollarSign, change: "Delivered Only", color: "text-green-500" },
        { label: "Active Orders", value: analytics.activeOrders.toString(), icon: ShoppingCart, change: "In Progress", color: "text-primary" },
        { label: "Total Inventory", value: data.productsCount.toString(), icon: ShoppingBag, change: "Verified", color: "text-blue-500" },
        { label: "Client Base", value: data.usersCount.toString(), icon: Users, change: "Verified", color: "text-purple-500" },
    ];

    useGSAP(() => {
        if (!loading) {
            gsap.fromTo(".stat-card",
                { opacity: 0, y: 30, filter: "blur(10px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "expo.out", stagger: 0.1 }
            );
            gsap.fromTo(".chart-container",
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 1, ease: "power3.out", delay: 0.4 }
            );
        }
    }, [loading]);

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-16" ref={containerRef}>
            <div className="space-y-2">
                <h2 className="text-5xl font-serif font-medium tracking-tighter text-foreground">Analytics Hub</h2>
                <p className="text-[10px] text-muted-foreground tracking-[0.4em] uppercase font-bold">Comprehensive Performance Metrics</p>
            </div>

            {/* Main Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="stat-card p-10 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 shadow-sm group hover:border-primary/50 transition-all duration-500 flex flex-col justify-between aspect-square"
                        >
                            <div className="flex items-center justify-between">
                                <div className={`p-3 bg-muted group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500`}>
                                    <Icon className="h-4 w-4" />
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <div className="space-y-1">
                                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground group-hover:text-primary transition-colors">
                                    {stat.label}
                                </p>
                                <div className="text-4xl font-serif font-bold tracking-tighter group-hover:scale-105 origin-left transition-transform duration-500">
                                    {stat.value}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
                                    {stat.change}
                                </span>
                                <div className="w-1 h-1 bg-primary rounded-full opacity-50 group-hover:opacity-100" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                {/* Revenue Flow Chart */}
                <div className="chart-container bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 p-10 shadow-sm space-y-8">
                    <div className="flex items-end justify-between border-b border-zinc-50 dark:border-zinc-900 pb-6">
                        <div className="space-y-1">
                            <h3 className="font-serif text-2xl font-medium tracking-tight">Revenue Stream</h3>
                            <p className="text-[8px] text-muted-foreground uppercase tracking-[0.3em] font-bold">Net Yield (Delivered)</p>
                        </div>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics.chartData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#888' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#888' }}
                                    tickFormatter={(val) => `₹${val / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#000',
                                        border: 'none',
                                        borderRadius: '0px',
                                        color: '#fff',
                                        fontSize: '10px',
                                        fontWeight: 'bold',
                                        letterSpacing: '0.1em'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="var(--primary)" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders Volume Chart */}
                <div className="chart-container bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 p-10 shadow-sm space-y-8">
                    <div className="flex items-end justify-between border-b border-zinc-50 dark:border-zinc-900 pb-6">
                        <div className="space-y-1">
                            <h3 className="font-serif text-2xl font-medium tracking-tight">Order Velocity</h3>
                            <p className="text-[8px] text-muted-foreground uppercase tracking-[0.3em] font-bold">Transaction Volume</p>
                        </div>
                        <Package className="w-4 h-4 text-primary" />
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#888' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#888' }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                    contentStyle={{
                                        backgroundColor: '#000',
                                        border: 'none',
                                        borderRadius: '0px',
                                        color: '#fff',
                                        fontSize: '10px',
                                        fontWeight: 'bold',
                                        letterSpacing: '0.1em'
                                    }}
                                />
                                <Bar dataKey="orders" fill="var(--foreground)" radius={[2, 2, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Records Footer */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 p-10 shadow-sm stat-card">
                <div className="flex items-end justify-between mb-10 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="space-y-1">
                        <h3 className="font-serif text-3xl font-medium tracking-tight">Recent Fulfillment</h3>
                        <p className="text-[8px] text-muted-foreground uppercase tracking-[0.3em] font-bold">Latest Order Activity</p>
                    </div>
                    <Link href="/admin/orders" className="text-[8px] font-bold uppercase tracking-widest flex items-center gap-2 hover:text-primary transition-colors">
                        Enter Order Center <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                <div className="space-y-4">
                    {data.orders.slice(-3).reverse().map((order, idx) => (
                        <div key={idx} className="flex items-center justify-between py-4 border-b border-zinc-50 dark:border-zinc-900 last:border-0 group">
                            <div className="flex items-center gap-6">
                                <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800 group-hover:scale-110 transition-transform">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{order.shippingInfo.fullName}</span>
                                    <span className="text-[8px] text-muted-foreground uppercase mt-1 tracking-tighter">{order.id} / {new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-bold tracking-tighter">₹{order.total.toLocaleString()}</span>
                                <span className={`text-[7px] font-bold uppercase tracking-widest px-2 py-0.5 mt-1 border rounded-full ${order.status === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    ))}
                    {data.orders.length === 0 && (
                        <div className="py-12 flex flex-col items-center justify-center opacity-20">
                            <Package className="w-8 h-8 mb-4 " />
                            <p className="text-[8px] font-bold uppercase tracking-widest">No transaction records</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
