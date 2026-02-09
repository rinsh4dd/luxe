"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
}

const ProductCard = ({ product }: { product: Product }) => {
    const { user } = useAuth();
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation
        if (!user) {
            toast.error("Please login to add items to cart");
            return;
        }
        addToCart({
            productId: product.id.toString(),
            name: product.name,
            price: product.price,
            image: product.image,
            size: "Standard",
            quantity: 1
        });
        toast.success("Added to cart");
    };

    return (
        <div className="group relative bg-card rounded-md p-3 md:p-4 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
            <div className={`aspect-[3/4] w-full overflow-hidden rounded-md shadow-sm mb-3 relative bg-muted`}>
                <img
                    src={product.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>

                {/* Play Button Style Add to Cart - Always visible on mobile (bottom-right), hover effect on desktop */}
                <button
                    onClick={handleAddToCart}
                    className="absolute bottom-2 right-2 md:bottom-4 md:right-4 p-2 md:p-3 bg-primary text-black rounded-full shadow-xl md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10 flex items-center justify-center active:scale-95"
                    aria-label="Add to cart"
                >
                    <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                </button>
            </div>

            <div className="flex flex-col gap-1 flex-grow">
                <Link href={`/product/${product.id}`} className="block">
                    <h3 className="text-sm md:text-base font-bold text-foreground truncate group-hover:text-primary transition-colors">{product.name}</h3>
                </Link>
                <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">{product.category}</p>
                <div className="mt-auto pt-1">
                    <p className="text-sm md:text-base font-medium text-foreground">${product.price}</p>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
