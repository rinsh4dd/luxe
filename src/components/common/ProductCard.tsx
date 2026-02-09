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
            // Find second image (if main is the same as images[0], show images[1])
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
            size: "M",
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
            className="group cursor-pointer block w-full luxe-animate"
        >
            <div className="relative aspect-square mb-6 overflow-hidden bg-[#F5F5F5] transition-all duration-700 ease-out border border-transparent group-hover:border-border/50">
                <Image
                    src={displayImage || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"}
                    alt={product.name}
                    fill
                    className="object-cover transition-all duration-1000 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />

                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.03] transition-colors duration-500"></div>

                {/* Wishlist Button (Hover Reveal) */}
                <button
                    onClick={toggleWishlist}
                    className="absolute top-4 right-4 p-2.5 bg-background shadow-sm hover:scale-110 transition-all duration-500 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 z-10 border border-border/50"
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Heart
                        className={`w-4 h-4 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-foreground"}`}
                    />
                </button>

                {/* Quick Add Button */}
                <div className="absolute bottom-6 left-6 right-6 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-expo">
                    {alreadyInCart ? (
                        <Link
                            href="/cart"
                            onClick={(e) => e.stopPropagation()}
                            className="h-12 w-full bg-primary text-primary-foreground font-bold text-[9px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-primary/90 shadow-xl"
                        >
                            Checkout Pieces
                            <ArrowRight className="w-3 h-3" />
                        </Link>
                    ) : (
                        <button
                            onClick={handleAddToCart}
                            className="h-12 w-full bg-foreground text-background font-bold text-[9px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-foreground/90 shadow-xl"
                        >
                            <ShoppingBag className="w-3 h-3" />
                            Quick Collection
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-2 px-1">
                <div className="flex justify-between items-start gap-4">
                    <h3 className="font-serif text-lg tracking-tight text-foreground transition-colors truncate">
                        {product.name}
                    </h3>
                    <p className="font-bold text-sm text-foreground whitespace-nowrap">
                        ₹{product.price.toLocaleString()}
                    </p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
                        {product.category}
                    </p>
                    <div className="w-1 h-1 rounded-full bg-border" />
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
