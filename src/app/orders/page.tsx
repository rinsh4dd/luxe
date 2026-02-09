"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface Order {
    id: string;
    total: number;
    status: string;
    createdAt: string;
    items: any[];
}

export default function OrdersPage() {
    const { user, loading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;

            try {
                const ordersRef = collection(db, "orders");
                const q = query(ordersRef, where("userId", "==", user.uid));
                const querySnapshot = await getDocs(q);

                const ordersData = querySnapshot.docs.map(doc => ({
                    ...doc.data()
                })) as Order[];

                // Sort by date descending
                ordersData.sort((a: Order, b: Order) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setOrders(ordersData);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setFetching(false);
            }
        };

        if (!loading) {
            if (!user) {
                setFetching(false);
            } else {
                fetchOrders();
            }
        }
    }, [user, loading]);

    if (loading || fetching) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="space-y-4 text-center">
                    <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Loading Orders...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 px-4 text-center">
                <h2 className="text-4xl font-serif font-medium tracking-tight">Access Restricted</h2>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.4em]">Please login to view your order history</p>
                <Link href="/login">
                    <Button className="rounded-none px-12 h-14 bg-foreground text-background font-bold tracking-[0.2em] text-[10px] uppercase hover:bg-foreground/90 transition-all">
                        Log In
                    </Button>
                </Link>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-10 text-center px-4">
                <div className="space-y-4">
                    <h2 className="text-5xl font-serif font-medium tracking-tight text-foreground">No Orders Found</h2>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.4em]">You have no recorded orders yet</p>
                </div>
                <Link href="/shop">
                    <Button className="rounded-none px-12 h-14 bg-foreground text-background font-bold tracking-[0.2em] text-[10px] uppercase hover:bg-foreground/90 transition-all">
                        Start Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 lg:px-12 py-24">
            <div className="mb-16 space-y-2">
                <h1 className="text-5xl font-serif font-medium tracking-tight text-foreground">My Orders</h1>
                <p className="text-[10px] text-muted-foreground tracking-[0.4em] uppercase font-bold">Past Orders</p>
            </div>

            <div className="space-y-12">
                {orders.map((order) => (
                    <div key={order.id} className="border border-border p-8 lg:p-12 space-y-8 bg-muted/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-foreground/5 transform translate-x-12 -translate-y-12 rotate-45 group-hover:bg-foreground/10 transition-colors"></div>

                        <div className="flex flex-col md:flex-row justify-between gap-8 border-b border-border pb-8">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60">Order ID:</span>
                                    <span className="text-xs font-bold tracking-widest uppercase">{order.id}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60">Placed on:</span>
                                    <span className="text-xs font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>
                            <div className="text-left md:text-right space-y-2">
                                <div className="flex items-center md:justify-end gap-3">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60">Total:</span>
                                    <span className="text-2xl font-bold tracking-tighter">₹{order.total.toFixed(2)}</span>
                                </div>
                                <div className={`inline-block border px-4 py-1.5 text-[8px] font-bold uppercase tracking-[0.3em] ${order.status === 'processing'
                                    ? 'border-yellow-500/30 text-yellow-600 bg-yellow-50/50'
                                    : 'border-green-500/30 text-green-600 bg-green-50/50'
                                    }`}>
                                    {order.status}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground">Order Items</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center p-4 border border-border/50 bg-background/50">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold tracking-tight">{item.name}</p>
                                            <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">QTY: {item.quantity} / {item.size}</p>
                                        </div>
                                        <span className="text-xs font-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
