"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useLuxeToast } from "@/hooks/useLuxeToast";
import { doc, setDoc, collection, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/Button";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { ArrowRight, ShieldCheck, Truck, CreditCard, ChevronDown, MapPin, Loader2, Check } from "lucide-react";
import { getDocs, query, where } from "firebase/firestore";
import { useEffect } from "react";

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
    "Ladakh", "Lakshadweep", "Puducherry"
];

export default function CheckoutPage() {
    const { cart, total, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const { success, error, info, promise } = useLuxeToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "Maharashtra",
        postalCode: "",
    });

    const [addresses, setAddresses] = useState<any[]>([]);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchAddresses = async () => {
            try {
                const addressesRef = collection(db, "addresses");
                const q = query(addressesRef, where("userId", "==", user.uid));
                const querySnapshot = await getDocs(q);
                const addrData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAddresses(addrData);
            } catch (err) {
                console.error("Error fetching addresses:", err);
            } finally {
                setLoadingAddresses(false);
            }
        };

        fetchAddresses();
    }, [user]);

    const handleSelectAddress = (addr: any) => {
        setSelectedAddressId(addr.id);
        setFormData({
            fullName: addr.fullName,
            phone: addr.phone,
            address: addr.address,
            city: addr.city,
            state: addr.state,
            postalCode: addr.postalCode,
        });
        success("Address Selected", "Form auto-filled with your saved information.");
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 px-4 text-center">
                <h2 className="text-4xl font-serif font-medium tracking-tight">Your bag is empty</h2>
                <Button onClick={() => router.push('/shop')} className="rounded-none px-12 h-14 bg-foreground text-background font-bold tracking-widest text-xs uppercase">
                    Return to Shop
                </Button>
            </div>
        );
    }

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            info("Authentication Required", "Please login to complete your order.");
            router.push("/login");
            return;
        }

        // Simple Indian PIN code validation (6 digits)
        if (!/^\d{6}$/.test(formData.postalCode)) {
            error("Invalid PIN Code", "Please enter a valid 6-digit Indian PIN code.");
            return;
        }

        setLoading(true);

        const placeOrder = async () => {
            const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            const orderDocRef = doc(db, "orders", orderId);
            const newOrder = {
                id: orderId,
                items: cart,
                total: total,
                shippingInfo: formData,
                status: "processing",
                paymentMethod: "Cash on Delivery",
                createdAt: new Date().toISOString(),
            };

            // Update stock levels for each item
            const stockUpdates = cart.map(item => {
                const prodRef = doc(db, "products", item.productId);
                return updateDoc(prodRef, {
                    stock: increment(-item.quantity)
                });
            });

            await Promise.all([
                setDoc(orderDocRef, {
                    ...newOrder,
                    userId: user.uid
                }),
                ...stockUpdates
            ]);

            clearCart();
            setTimeout(() => {
                router.push("/checkout/success");
            }, 1000);
        };

        promise(placeOrder(), {
            loading: "Securing your order...",
            success: "Order confirmed via COD!",
            error: "An error occurred during payment protocols."
        }).finally(() => setLoading(false));
    };

    return (
        <div className="container mx-auto px-4 lg:px-12 py-24">
            <Breadcrumbs />
            <div className="mb-16 space-y-2">
                <h1 className="text-5xl font-serif font-medium tracking-tight text-foreground">Checkout</h1>
                <p className="text-[10px] text-muted-foreground tracking-[0.4em] uppercase font-bold">Secure Payment (India)</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                {/* Information Form */}
                <div className="lg:col-span-7 space-y-12">
                    <section className="space-y-8">
                        <div className="flex items-center gap-4 pb-4 border-b border-border">
                            <Truck className="w-4 h-4 text-muted-foreground" />
                            <h2 className="text-xs font-bold uppercase tracking-[0.3em]">Delivery Information</h2>
                        </div>

                        {/* Saved Addresses Selection */}
                        {addresses.length > 0 && (
                            <div className="space-y-4">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Select a saved address</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {addresses.map((addr) => (
                                        <button
                                            key={addr.id}
                                            type="button"
                                            onClick={() => handleSelectAddress(addr)}
                                            className={`p-4 border text-left transition-all relative group ${selectedAddressId === addr.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 bg-muted/5'}`}
                                        >
                                            {selectedAddressId === addr.id && (
                                                <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                                    <Check className="w-2.5 h-2.5 text-primary-foreground" />
                                                </div>
                                            )}
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold truncate pr-6">{addr.fullName}</p>
                                                <p className="text-[10px] text-muted-foreground truncate">{addr.label || 'Home'}</p>
                                                <p className="text-[8px] text-muted-foreground line-clamp-2 uppercase tracking-tighter mt-1">{addr.address}, {addr.city}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                    <div className="h-px bg-border flex-1"></div>
                                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Or enter manually</span>
                                    <div className="h-px bg-border flex-1"></div>
                                </div>
                            </div>
                        )}

                        <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Full Name"
                                        className="w-full bg-transparent border-b border-border p-3 text-sm font-medium tracking-wide focus:border-foreground outline-none transition-colors rounded-none"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Contact Number</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="+91 XXXXX XXXXX"
                                        className="w-full bg-transparent border-b border-border p-3 text-sm font-medium tracking-wide focus:border-foreground outline-none transition-colors rounded-none"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">PIN Code</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={6}
                                        placeholder="Pin Code"
                                        className="w-full bg-transparent border-b border-border p-3 text-sm font-medium tracking-wide focus:border-foreground outline-none transition-colors rounded-none"
                                        value={formData.postalCode}
                                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Region / State</label>
                                    <div className="relative">
                                        <select
                                            required
                                            className="w-full bg-transparent border-b border-border p-3 text-sm font-medium tracking-wide focus:border-foreground outline-none transition-colors rounded-none appearance-none"
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        >
                                            {INDIAN_STATES.map(state => (
                                                <option key={state} value={state} className="bg-background text-foreground">{state}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Detailed Address</label>
                                <textarea
                                    required
                                    placeholder="House No, Street, Locality"
                                    className="w-full bg-transparent border-b border-border p-3 text-sm font-medium tracking-wide focus:border-foreground outline-none transition-colors rounded-none resize-none"
                                    rows={2}
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">City</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="City Name"
                                    className="w-full bg-transparent border-b border-border p-3 text-sm font-medium tracking-wide focus:border-foreground outline-none transition-colors rounded-none"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                />
                            </div>
                        </form>
                    </section>

                    <section className="space-y-8">
                        <div className="flex items-center gap-4 pb-4 border-b border-border">
                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                            <h2 className="text-xs font-bold uppercase tracking-[0.3em]">Payment Method</h2>
                        </div>
                        <div className="p-8 border border-border bg-muted/20 space-y-4">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-foreground" />
                                <p className="text-[10px] font-bold uppercase tracking-widest">Cash on Delivery (Standard)</p>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Curated orders for the Indian territory are finalized via Cash on Delivery. A LUXE representative will verify the order upon arrival.
                            </p>
                        </div>
                    </section>
                </div>

                {/* Acquisition Summary */}
                <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
                    <div className="bg-foreground text-background p-8 lg:p-12 space-y-12 shadow-2xl">
                        <div className="space-y-2">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60 border-b border-background/10 pb-4">Order Summary</h2>
                            <div className="max-h-[300px] overflow-y-auto pr-4 space-y-6 scrollbar-hide">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex justify-between gap-4 group">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold tracking-tight line-clamp-1">{item.name}</p>
                                            <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/80">QTY: {item.quantity} / {item.size}</p>
                                        </div>
                                        <span className="font-bold text-sm text-right">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-background/10">
                            <div className="flex justify-between items-center text-2xl font-bold tracking-tighter">
                                <span className="uppercase text-[10px] tracking-[0.4em] font-bold text-muted-foreground/60">Total Amount</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>

                            <Button
                                form="checkout-form"
                                type="submit"
                                className="w-full h-16 bg-background text-foreground rounded-none font-bold tracking-[0.4em] text-[10px] uppercase hover:bg-background/90 transition-all flex items-center justify-center gap-3"
                                disabled={loading}
                            >
                                {loading ? "Ordering..." : "Complete Order"}
                                {!loading && <ArrowRight className="w-3 h-3 group-hover:translate-x-2 transition-transform duration-300" />}
                            </Button>

                            <p className="text-[8px] text-center text-muted-foreground/50 uppercase tracking-[0.3em] font-medium pt-4">
                                By completing this order, you agree to our terms of service for the Indian territory.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
