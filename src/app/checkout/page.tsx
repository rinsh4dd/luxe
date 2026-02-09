"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/Button";

export default function CheckoutPage() {
    const { cart, total, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState("");

    if (cart.length === 0) {
        return <div className="p-12 text-center">Your cart is empty</div>;
    }

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to checkout");
            router.push("/login"); // Fixed: router instead of router.push
            return;
        }

        setLoading(true);

        try {
            // Create Order in Firestore
            await addDoc(collection(db, "orders"), {
                userId: user.uid,
                items: cart,
                total: total,
                address: address,
                status: "pending",
                createdAt: new Date().toISOString(),
            });

            clearCart();
            alert("Order placed successfully!");
            router.push("/orders");
        } catch (error) {
            console.error("Checkout failed:", error);
            alert("Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                    <form onSubmit={handleCheckout} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">Full Name</label>
                            <input type="text" className="mt-1 block w-full rounded-md border-border bg-background shadow-sm border p-2 text-foreground focus:ring-primary focus:border-primary" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">Address</label>
                            <textarea
                                className="mt-1 block w-full rounded-md border-border bg-background shadow-sm border p-2 text-foreground focus:ring-primary focus:border-primary"
                                rows={3}
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">Payment Details</label>
                            <div className="p-4 border border-border rounded-md bg-muted text-sm text-muted-foreground">
                                Mock Payment Gateway (No actual payment will be processed)
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
                            </Button>
                        </div>
                    </form>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4 text-foreground">Order Summary</h2>
                    <div className="bg-card p-6 rounded-lg space-y-4 border border-border">
                        {cart.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm text-muted-foreground">
                                <span>{item.name} x {item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="border-t border-border pt-4 flex justify-between font-bold text-lg text-foreground">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
