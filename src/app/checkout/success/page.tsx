"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Check, ShoppingBag, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function SuccessPage() {
    useEffect(() => {
        // Subtle, elegant confetti on mount
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-24 text-center">
            <div className="mb-12 relative">
                <div className="w-24 h-24 border border-foreground flex items-center justify-center rounded-none bg-foreground text-background">
                    <Check className="w-10 h-10" />
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 border border-foreground flex items-center justify-center bg-background">
                    <ShoppingBag className="w-3 h-3 text-foreground" />
                </div>
            </div>

            <div className="space-y-6 max-w-2xl px-4">
                <div className="space-y-2">
                    <h1 className="text-6xl font-serif font-medium tracking-tighter text-foreground">Thank You.</h1>
                    <p className="text-[10px] text-muted-foreground tracking-[0.4em] uppercase font-bold">Order Confirmed</p>
                </div>

                Your order has been successfully placed. A confirmation email has been sent to you.

                <div className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link href="/orders" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto rounded-none px-12 h-14 bg-foreground text-background font-bold tracking-[0.2em] text-[10px] uppercase hover:bg-foreground/90 transition-all">
                            View Order History
                        </Button>
                    </Link>
                    <Link href="/shop" className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full sm:w-auto rounded-none px-12 h-14 border-border font-bold tracking-[0.2em] text-[10px] uppercase hover:bg-muted group transition-all">
                            Continue Browsing
                            <ArrowRight className="w-3 h-3 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="mt-24 pt-12 border-t border-border w-full max-w-sm">
                "True value is not just in the item, but in the joy of owning it."
                <p className="text-[8px] font-bold uppercase tracking-[0.4em] mt-4">— LUXE STORE</p>
            </div>
        </div>
    );
}
