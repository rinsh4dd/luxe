"use client";

import { useState, useEffect } from "react";
import {
    Package,
    Truck,
    CheckCircle2,
    XCircle,
    Search,
    Filter,
    MoreHorizontal,
    Loader2,
    ExternalLink,
    Clock,
    User,
    MapPin,
    Phone,
    CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLuxeToast } from "@/hooks/useLuxeToast";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";

type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

const STATUS_CONFIG = {
    processing: { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "Processing" },
    shipped: { icon: Truck, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", label: "In Transit" },
    delivered: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20", label: "Finalized" },
    cancelled: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", label: "Nullified" },
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const { promise } = useLuxeToast();

    const fetchOrders = async () => {
        try {
            const { getFirestore, collection, getDocs, orderBy, query } = await import("firebase/firestore/lite");
            const { app } = await import("@/lib/firebase");
            const db = getFirestore(app);

            const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(ordersQuery);
            const ordersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOrders(ordersData);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useGSAP(() => {
        if (!loading) {
            gsap.fromTo(".order-row",
                { opacity: 0, x: -10 },
                { opacity: 1, x: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" }
            );
        }
    }, [loading]);

    const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
        const updatePromise = async () => {
            const { getFirestore, doc, updateDoc } = await import("firebase/firestore/lite");
            const { app } = await import("@/lib/firebase");
            const db = getFirestore(app);

            await updateDoc(doc(db, "orders", orderId), { status: newStatus });
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        };

        promise(updatePromise(), {
            loading: "Updating status...",
            success: `Order marked as ${newStatus}.`,
            error: "Failed to update order status."
        });
    };

    const filteredOrders = filterStatus === "all"
        ? orders
        : orders.filter(o => o.status === filterStatus);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-16 pb-24">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-100 dark:border-zinc-800 pb-12">
                <div className="space-y-2">
                    <h2 className="text-6xl font-serif font-medium tracking-tighter text-foreground leading-none">Order Flow</h2>
                    <p className="text-[10px] text-muted-foreground tracking-[0.5em] uppercase font-bold">Commerce Stream Management</p>
                </div>

                <div className="flex gap-4">
                    <div className="relative">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="h-14 pl-6 pr-12 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-[10px] uppercase font-bold tracking-widest outline-none appearance-none cursor-pointer hover:border-primary transition-colors"
                        >
                            <option value="all">Entire Stream</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">In Transit</option>
                            <option value="delivered">Finalized</option>
                            <option value="cancelled">Nullified</option>
                        </select>
                        <Filter className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-8">
                {filteredOrders.length === 0 ? (
                    <div className="py-32 flex flex-col items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 text-muted-foreground">
                        <Package className="w-12 h-12 opacity-5 mb-6" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-30">Stream Silent</p>
                    </div>
                ) : (
                    filteredOrders.map((order) => {
                        const Config = STATUS_CONFIG[order.status as OrderStatus] || STATUS_CONFIG.processing;
                        const StatusIcon = Config.icon;
                        return (
                            <div
                                key={order.id}
                                className="order-row group bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-500 overflow-hidden"
                            >
                                <div className="p-8 lg:p-12">
                                    <div className="flex flex-col lg:flex-row gap-12 lg:items-start lg:justify-between">

                                        {/* Order ID & Basic Stats */}
                                        <div className="space-y-6 lg:w-1/4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-2">Protocol ID</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl font-serif font-bold tracking-tight">{order.id}</span>
                                                    <div className={`px-3 py-1 text-[8px] font-bold uppercase tracking-widest border ${Config.border} ${Config.bg} ${Config.color} flex items-center gap-2`}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        {Config.label}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-2">Acquisition Valuation</span>
                                                <span className="text-3xl font-serif font-bold tracking-tighter">₹{order.total.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        {/* Client & Shipping */}
                                        <div className="space-y-6 lg:w-1/3 border-l border-zinc-50 dark:border-zinc-900 lg:pl-12">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4 text-muted-foreground">
                                                    <User className="w-4 h-4" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">{order.shippingInfo.fullName}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-muted-foreground">
                                                    <Phone className="w-4 h-4" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{order.shippingInfo.phone}</span>
                                                </div>
                                                <div className="flex items-start gap-4 text-muted-foreground">
                                                    <MapPin className="w-4 h-4 mt-0.5" />
                                                    <span className="text-[9px] font-bold uppercase tracking-wider leading-relaxed">
                                                        {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.postalCode}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress Tracking Actions */}
                                        <div className="lg:w-1/4 flex flex-col gap-4 lg:items-end">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-2 lg:text-right w-full">Advance Status</span>
                                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 w-full">
                                                {order.status !== 'shipped' && order.status !== 'delivered' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(order.id, 'shipped')}
                                                        className="h-12 border border-zinc-100 dark:border-zinc-800 text-[8px] font-bold uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Truck className="w-3 h-3" /> Dispatch
                                                    </button>
                                                )}
                                                {order.status === 'shipped' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(order.id, 'delivered')}
                                                        className="h-12 border border-blue-500 text-blue-500 text-[8px] font-bold uppercase tracking-[0.2em] hover:bg-green-500 hover:border-green-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <CheckCircle2 className="w-3 h-3" /> Finalize
                                                    </button>
                                                )}
                                                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                                        className="h-12 border border-zinc-100 dark:border-zinc-800 text-muted-foreground text-[8px] font-bold uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <XCircle className="w-3 h-3" /> Terminate
                                                    </button>
                                                )}
                                                {order.status === 'delivered' && (
                                                    <div className="h-12 border border-green-500/20 bg-green-500/5 text-green-500 text-[8px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                                        <CheckCircle2 className="w-3 h-3" /> Transaction Finalized
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items Accordion / Summary */}
                                    <div className="mt-12 pt-8 border-t border-zinc-50 dark:border-zinc-900">
                                        <div className="flex items-center justify-between mb-8">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Inventory Payload</span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest">{order.items.length} Items</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                            {order.items.map((item: any, idx: number) => (
                                                <div key={idx} className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900/50 p-4 border border-zinc-100 dark:border-zinc-800/80">
                                                    <div className="w-12 h-16 relative bg-white border border-zinc-100 dark:border-zinc-800 shrink-0">
                                                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" unoptimized />
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-[10px] font-bold uppercase tracking-tight truncate">{item.name}</span>
                                                        <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Size: {item.size} / QTY: {item.quantity}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
