"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Package, MapPin, CreditCard, ChevronLeft, Loader2, Calendar, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function OrderDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!user || !id) return;
            try {
                const orderDoc = await getDoc(doc(db, "orders", id as string));
                if (orderDoc.exists()) {
                    const data = orderDoc.data();
                    // Basic security check: ensure the order belongs to the current user
                    if (data.userId === user.uid) {
                        setOrder({ id: orderDoc.id, ...data });
                    } else {
                        router.push("/profile");
                    }
                }
            } catch (err) {
                console.error("Error fetching order:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, user, router]);

    useGSAP(() => {
        if (!loading && order) {
            gsap.fromTo(".order-content",
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.1 }
            );
        }
    }, [loading, order]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background space-y-6">
                <Package className="w-16 h-16 text-muted-foreground opacity-20" />
                <h1 className="text-2xl font-serif">Order not found.</h1>
                <Link href="/profile">
                    <Button variant="outline" className="rounded-none uppercase text-[10px] font-bold tracking-[0.3em] px-8 py-6">
                        Back to Profile
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-32 pb-24">
            <div className="container mx-auto px-4 lg:px-12 max-w-6xl">

                {/* Header */}
                <div className="order-content mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-12">
                    <div className="space-y-4">
                        <Link href="/profile" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors">
                            <ChevronLeft className="w-3 h-3" />
                            Back to Profile
                        </Link>
                        <h1 className="text-5xl md:text-6xl font-serif font-medium tracking-tighter">
                            Order Details<span className="text-primary">.</span>
                        </h1>
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground">ID: #{order.id.slice(-12)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className="px-6 py-2 bg-foreground text-background text-[10px] font-bold uppercase tracking-[0.4em]">
                            {order.status || 'Processing'}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="order-content space-y-6">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] flex items-center gap-2">
                                <ShoppingBag className="w-3 h-3 text-primary" />
                                Items ({order.items?.length || 0})
                            </h2>
                            <div className="border border-border bg-background divide-y divide-border">
                                {order.items?.map((item: any, idx: number) => (
                                    <div key={idx} className="p-6 flex items-center gap-6 group">
                                        <div className="w-20 h-24 bg-muted overflow-hidden relative border border-border">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h3 className="text-sm font-bold uppercase tracking-tight">{item.name}</h3>
                                            <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-widest leading-loose">
                                                Size: {item.size} <br />
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-serif font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                                            <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">₹{item.price.toLocaleString()} each</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="order-content p-8 border border-border bg-muted/5 space-y-6">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em]">Price Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>₹{(order.totalAmount || order.total).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="pt-4 border-t border-border flex justify-between items-end">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Total Amount</span>
                                    <span className="text-3xl font-serif font-bold">₹{(order.totalAmount || order.total).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Shipping & Payment */}
                    <div className="space-y-8">
                        {/* Shipping Address */}
                        <div className="order-content p-8 border border-border space-y-6 bg-background">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-primary" />
                                Shipping Address
                            </h2>
                            <div className="space-y-3">
                                <p className="text-sm font-bold uppercase tracking-tight">{order.shippingAddress?.fullName}</p>
                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest border-l border-border pl-4 leading-relaxed">
                                    {order.shippingAddress?.address}<br />
                                    {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}<br />
                                    <span className="mt-2 block text-foreground">Phone: {order.shippingAddress?.phone}</span>
                                </p>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="order-content p-8 border border-border space-y-6 bg-background">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] flex items-center gap-2">
                                <CreditCard className="w-3 h-3 text-primary" />
                                Payment details
                            </h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-muted/20 border border-border space-y-1">
                                    <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">Method</p>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em]">{order.paymentMethod || 'Credit/Debit Card'}</p>
                                </div>
                                <div className="p-4 bg-muted/20 border border-border space-y-1">
                                    <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">Status</p>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-600">Paid Successfully</p>
                                </div>
                            </div>
                        </div>

                        {/* Support */}
                        <div className="order-content p-8 border border-border border-dashed space-y-4 text-center">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Need help with this order?</p>
                            <Link href="/support" className="inline-block text-[8px] font-bold uppercase tracking-[0.4em] underline underline-offset-8 hover:text-primary transition-colors">
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
