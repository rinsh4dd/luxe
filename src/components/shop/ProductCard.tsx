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
        <div className="group relative bg-card rounded-md p-4 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1">
            <div className={`aspect-[3/4] w-full overflow-hidden rounded-md shadow-sm mb-4 relative bg-muted`}>
                <img
                    src={product.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>

                {/* Play Button Style Add to Cart */}
                <button
                    onClick={handleAddToCart}
                    className="absolute bottom-4 right-4 p-3 bg-primary text-black rounded-full shadow-xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10 flex items-center justify-center"
                >
                    <ShoppingBag className="w-5 h-5 fill-current" />
                </button>
            </div>

            <div className="flex flex-col gap-1">
                <Link href={`/product/${product.id}`} className="block">
                    <h3 className="text-base font-bold text-foreground truncate group-hover:text-primary transition-colors">{product.name}</h3>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-1">{product.category}</p>
                <p className="text-sm font-medium text-foreground mt-1">${product.price}</p>
            </div>
        </div>
    );
};

export default ProductCard;
