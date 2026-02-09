"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
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
                const q = query(
                    collection(db, "orders"),
                    where("userId", "==", user.uid),
                    orderBy("createdAt", "desc")
                );
                const querySnapshot = await getDocs(q);
                const ordersData: Order[] = [];
                querySnapshot.forEach((doc) => {
                    ordersData.push({ id: doc.id, ...doc.data() } as Order);
                });
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
        return <div className="p-12 text-center">Loading orders...</div>;
    }

    if (!user) {
        return <div className="p-12 text-center">Please login to view orders.</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold mb-4">No orders found</h2>
                <Link href="/shop">
                    <Button>Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-foreground">My Orders</h1>

            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order.id} className="bg-card border border-border rounded-lg p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between mb-4 pb-4 border-b border-border">
                            <div>
                                <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
                                <p className="text-sm text-muted-foreground">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="mt-2 md:mt-0 text-right">
                                <p className="font-bold text-lg text-foreground">${order.total.toFixed(2)}</p>
                                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>
                                    {order.status.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between text-sm text-muted-foreground">
                                    <span>{item.name} (x{item.quantity})</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
