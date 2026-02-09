"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useLuxeToast } from "@/hooks/useLuxeToast";

interface Product {
    id: string | number;
    name: string;
    price: number;
    category: string;
    image: string;
    images?: string[];
    stock: number;
    featured?: boolean;
    isActive: boolean;
}

const ProductCard = ({ product }: { product: Product }) => {
    const router = useRouter();
    const { user } = useAuth();
    const { addToCart, isInCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { success, info } = useLuxeToast();

    const [displayImage, setDisplayImage] = useState(product.image);
    const isWishlisted = isInWishlist(product.id.toString());
    const alreadyInCart = isInCart(product.id.toString());

    const handleCardClick = () => {
        router.push(`/product/${product.id}`);
    };

    const handleMouseEnter = () => {
        if (product.images && product.images.length > 1) {
            const hoverImg = product.images.find(img => img !== product.image) || product.images[1];
            if (hoverImg) setDisplayImage(hoverImg);
        }
    };

    const handleMouseLeave = () => {
        setDisplayImage(product.image);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            info("Login Required", "Please login to add items to your cart.");
            return;
        }

        if (alreadyInCart) return;

        addToCart({
            productId: product.id.toString(),
            name: product.name,
            price: product.price,
            image: product.image,
            size: "Standard",
            quantity: 1
        });
        success("Added to Cart", `${product.name} is now in your cart.`);
    };

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isWishlisted) {
            removeFromWishlist(product.id.toString());
        } else {
            addToWishlist({
                productId: product.id.toString(),
                name: product.name,
                price: product.price,
                image: product.image
            });
        }
    };

    return (
        <div
            onClick={handleCardClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`group cursor-pointer block w-full luxe-animate ${!product.isActive ? 'grayscale opacity-75' : ''}`}
        >
            <div className={`relative aspect-square mb-6 overflow-hidden bg-white dark:bg-zinc-950 transition-all duration-700 ease-out border border-zinc-100 dark:border-zinc-800/80 group-hover:border-primary/30 p-4 md:p-6 ${!product.isActive ? 'grayscale opacity-80' : ''}`}>
                <div className="relative w-full h-full overflow-hidden">
                    <Image
                        src={displayImage || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"}
                        alt={product.name}
                        fill
                        className="object-contain transition-all duration-1000 ease-out group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                </div>

                {/* Content Overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none z-10">
                    {/* Featured/Choice Badge */}
                    {product.featured && (
                        <div className="bg-foreground text-background text-[7px] font-bold uppercase tracking-[0.3em] px-3 py-1 backdrop-blur-md">
                            Choice
                        </div>
                    )}

                    {/* Inventory Status Labels */}
                    <div className="flex flex-col gap-1">
                        {!product.isActive ? (
                            <div className="bg-zinc-900 text-white text-[7px] font-bold uppercase tracking-[0.3em] px-3 py-1.5 backdrop-blur-md border border-white/10 opacity-100">
                                Unavailable
                            </div>
                        ) : product.stock !== undefined && product.stock <= 0 ? (
                            <div className="bg-zinc-500/10 text-zinc-500 text-[6px] font-bold uppercase tracking-[0.2em] px-2 py-1 border border-zinc-500/20 backdrop-blur-md">
                                Sold Out
                            </div>
                        ) : product.stock !== undefined && product.stock <= 20 ? (
                            <div className="bg-amber-500/10 text-amber-500 text-[6px] font-bold uppercase tracking-[0.2em] px-2 py-1 border border-amber-500/20 backdrop-blur-md">
                                Low Stock
                            </div>
                        ) : product.stock !== undefined ? (
                            <div className="bg-green-500/10 text-green-500 text-[6px] font-bold uppercase tracking-[0.2em] px-2 py-1 border border-green-500/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                                In Stock
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors duration-500 pointer-events-none"></div>

                {/* Wishlist Button (Hover Reveal) */}
                <button
                    onClick={toggleWishlist}
                    className="absolute top-4 right-4 p-2.5 bg-white dark:bg-zinc-900 shadow-sm hover:scale-110 transition-all duration-500 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 z-10 border border-border/50"
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Heart
                        className={`w-4 h-4 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-foreground"}`}
                    />
                </button>

                {/* Quick Add Button / Unavailable Notice */}
                <div className="absolute bottom-6 left-6 right-6 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-expo">
                    {!product.isActive ? (
                        <div className="h-12 w-full bg-zinc-900 text-white font-bold text-[9px] uppercase tracking-[0.4em] flex items-center justify-center gap-2 border border-white/20 backdrop-blur-md">
                            Piece Unavailable
                        </div>
                    ) : product.stock <= 0 ? (
                        <div className="h-12 w-full bg-zinc-100 dark:bg-zinc-900 text-muted-foreground font-bold text-[9px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 border border-border cursor-not-allowed">
                            Sold Out
                        </div>
                    ) : alreadyInCart ? (
                        <Link
                            href="/cart"
                            onClick={(e) => e.stopPropagation()}
                            className="h-12 w-full bg-primary text-primary-foreground font-bold text-[9px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-primary/90 shadow-xl"
                        >
                            Proceed to Bag
                            <ArrowRight className="w-3 h-3" />
                        </Link>
                    ) : (
                        <button
                            onClick={handleAddToCart}
                            className="h-12 w-full bg-foreground text-background font-bold text-[9px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-foreground/90 shadow-xl"
                        >
                            <ShoppingBag className="w-3 h-3" />
                            Acquire Piece
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-2 px-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-1 md:gap-4">
                    <h3 className="font-serif text-lg tracking-tight text-foreground transition-colors truncate">
                        {product.name}
                    </h3>
                    <p className="font-bold text-sm text-foreground whitespace-nowrap">
                        ₹{product.price.toLocaleString()}
                    </p>
                </div>
                <div className="flex items-center justify-center md:justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
                    <span>{product.category}</span>
                    <span className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0">View Details</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
