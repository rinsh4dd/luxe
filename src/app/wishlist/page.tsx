"use client";

import { useWishlist } from "@/context/WishlistContext";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import ProductCard from "@/components/common/ProductCard";
import Breadcrumbs from "@/components/common/Breadcrumbs";

export default function WishlistPage() {
    const { wishlist, loading } = useWishlist();

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Preparing Selection...</p>
            </div>
        );
    }

    if (wishlist.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8">
                <div className="space-y-2 text-center">
                    <h2 className="text-4xl font-serif font-medium tracking-tight">Your wishlist is empty</h2>
                    <p className="text-sm text-muted-foreground uppercase tracking-[0.2em]">Add products to see them here</p>
                </div>
                <Link href="/shop">
                    <Button className="rounded-none px-12 h-14 bg-foreground text-background font-bold tracking-widest text-xs uppercase">Continue Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-24">
            <Breadcrumbs />
            <div className="mb-16 space-y-2">
                <h1 className="text-5xl font-serif font-medium tracking-tight text-foreground">Wishlist</h1>
                <p className="text-sm text-muted-foreground tracking-[0.3em] uppercase">Your Private Selection</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                {wishlist.map((item) => (
                    <ProductCard
                        key={item.productId}
                        product={{
                            id: item.productId,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                            category: "Saved Item",
                            stock: 1, // Default to available for UI
                            isActive: true
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
