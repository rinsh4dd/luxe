"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, subtotal } = useCart();

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
                <h2 className="text-2xl font-bold text-foreground">Your cart is empty</h2>
                <p className="text-muted-foreground">Looks like you haven't added anything yet.</p>
                <Link href="/shop">
                    <Button className="rounded-full">Continue Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-foreground">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                    {cart.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 bg-card rounded-lg shadow-sm border border-border">
                            <div className={`w-24 h-24 flex-shrink-0 rounded-md overflow-hidden ${item.image} bg-cover bg-center`}></div>

                            <div className="flex-grow flex flex-col justify-between">
                                <div>
                                    <h3 className="font-medium text-lg text-foreground">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="p-1 rounded-full hover:bg-muted text-foreground"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="text-sm font-medium w-4 text-center text-foreground">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="p-1 rounded-full hover:bg-muted text-foreground"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-500 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="font-medium text-foreground">${item.price * item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-card p-6 rounded-lg border border-border">
                        <h2 className="text-lg font-bold mb-4 text-foreground">Order Summary</h2>
                        <div className="space-y-2 mb-4 text-muted-foreground">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>Calculated at checkout</span>
                            </div>
                        </div>
                        <div className="border-t border-border pt-4 mb-6">
                            <div className="flex justify-between font-bold text-lg text-foreground">
                                <span>Total</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <Button className="w-full rounded-full" size="lg">Proceed to Checkout</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
