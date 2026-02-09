"use client";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Trash2, Plus, Minus, Heart, ArrowRight } from "lucide-react";
import { useLuxeToast } from "@/hooks/useLuxeToast";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, subtotal } = useCart();
    const { addToWishlist } = useWishlist();
    const { success } = useLuxeToast();

    const handleMoveToWishlist = (item: any) => {
        addToWishlist({
            productId: item.productId,
            name: item.name,
            price: item.price,
            image: item.image
        });
        removeFromCart(item.id);
        success("Saved to Wishlist", `${item.name} moved to your wishlist.`);
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-10 text-center px-4">
                <div className="space-y-4">
                    <h2 className="text-5xl font-serif font-medium tracking-tight text-foreground">Your bag is empty</h2>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.4em]">Items you add will appear here</p>
                </div>
                <Link href="/shop">
                    <Button className="rounded-none px-12 h-14 bg-foreground text-background font-bold tracking-[0.2em] text-[10px] uppercase hover:bg-foreground/90 transition-all">
                        Continue Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 lg:px-12 py-24">
            <div className="mb-16 space-y-2">
                <h1 className="text-5xl font-serif font-medium tracking-tight text-foreground">Shopping Bag</h1>
                <p className="text-[10px] text-muted-foreground tracking-[0.4em] uppercase font-bold">Your Selected Items</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Cart Items - Adjusted column span for better proportions */}
                <div className="lg:col-span-9 space-y-12">
                    <div className="border-t border-border">
                        {cart.map((item) => (
                            <div key={item.id} className="flex flex-col md:flex-row gap-8 py-10 border-b border-border group animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Image - Now taller and narrower for LUXE feel */}
                                <div className="w-full md:w-36 aspect-[4/5] bg-white p-4 border border-zinc-100 dark:border-zinc-800/50 overflow-hidden flex-shrink-0">
                                    <div
                                        className={`w-full h-full bg-contain bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110 ${item.image}`}
                                        style={{ backgroundImage: item.image.startsWith('bg-') ? undefined : `url(${item.image})` }}
                                    ></div>
                                </div>

                                {/* Details */}
                                <div className="flex-grow flex flex-col justify-between py-1">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h3 className="font-serif text-2xl tracking-tight text-foreground">{item.name}</h3>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Piece Specification: {item.size}</p>
                                        </div>
                                        <p className="font-bold text-xl tracking-tighter">₹{item.price.toLocaleString()}</p>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-6 pt-10">
                                        {/* Quantity Selector */}
                                        <div className="flex items-center border border-border h-11 px-1 bg-muted/20">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-10 h-full flex items-center justify-center hover:text-primary transition-colors disabled:opacity-20"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-10 text-center text-xs font-bold font-mono">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-10 h-full flex items-center justify-center hover:text-primary transition-colors disabled:opacity-20"
                                                disabled={item.quantity >= 15}
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center space-x-10">
                                            <button
                                                onClick={() => handleMoveToWishlist(item)}
                                                className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all group/btn"
                                            >
                                                <Heart className="w-3 h-3 group-hover/btn:fill-current transition-all" />
                                                Save for Later
                                            </button>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-red-500 transition-all"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                Remove Item
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary - Shrinked width for focus on products */}
                <div className="lg:col-span-3 lg:sticky lg:top-32 h-fit">
                    <div className="bg-muted/30 p-10 border border-border/50 space-y-10 shadow-sm">
                        <div className="space-y-2">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground">Order Summary</h2>
                            <div className="h-0.5 w-12 bg-primary" />
                        </div>

                        <div className="space-y-5">
                            <div className="flex justify-between items-center text-xs font-medium">
                                <span className="uppercase tracking-widest text-muted-foreground">Subtotal</span>
                                <span className="font-bold tracking-tight">₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-medium">
                                <span className="uppercase tracking-widest text-muted-foreground">Logistics</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary italic">Complimentary</span>
                            </div>
                        </div>

                        <div className="border-t border-border pt-8 space-y-10">
                            <div className="flex justify-between items-end">
                                <span className="uppercase text-[9px] tracking-[0.4em] font-bold text-muted-foreground mb-1">Total Bill</span>
                                <span className="text-3xl font-serif font-bold tracking-tighter">₹{subtotal.toLocaleString()}</span>
                            </div>

                            <Link href="/checkout" className="block">
                                <Button className="w-full rounded-none h-16 bg-foreground text-background font-bold tracking-[0.4em] text-[10px] uppercase group transition-all hover:translate-y-[-2px] hover:shadow-xl active:translate-y-0">
                                    Begin Checkout
                                    <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform duration-500" />
                                </Button>
                            </Link>

                            <div className="pt-6 border-t border-border/30">
                                <div className="flex items-center justify-center gap-4 opacity-30 grayscale saturate-0 mb-6">
                                    <div className="w-8 h-5 bg-foreground/20 rounded-sm" />
                                    <div className="w-8 h-5 bg-foreground/20 rounded-sm" />
                                    <div className="w-8 h-5 bg-foreground/20 rounded-sm" />
                                </div>
                                <p className="text-[8px] text-center text-muted-foreground uppercase tracking-[0.2em] leading-relaxed font-medium">
                                    White-glove delivery & seamless returns included. Secure encrypted checkout.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
