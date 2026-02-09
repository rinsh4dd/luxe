"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    if (wishlist.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <h2 className="text-2xl font-bold">Your wishlist is empty</h2>
                <Link href="/shop">
                    <Button>Continue Shopping</Button>
                </Link>
            </div>
        );
    }

    const handleMoveToCart = (item: any) => {
        addToCart({
            productId: item.productId,
            name: item.name,
            price: item.price,
            image: item.image,
            size: "M", // Default for now, ideally prompt user
            quantity: 1
        });
        removeFromWishlist(item.productId);
        alert("Moved to cart!");
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlist.map((item) => (
                    <div key={item.productId} className="group relative">
                        <div className={`aspect-square w-full overflow-hidden rounded-md bg-gray-200 ${item.image}`}>
                            <div className="h-full w-full object-cover object-center bg-gray-200"></div>
                        </div>
                        <div className="mt-4 flex justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">
                                    <Link href={`/product/${item.productId}`}>
                                        {item.name}
                                    </Link>
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">${item.price}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => handleMoveToCart(item)}
                            >
                                <ShoppingBag className="w-4 h-4 mr-2" /> Add to Cart
                            </Button>
                            <button
                                onClick={() => removeFromWishlist(item.productId)}
                                className="p-2 border border-gray-300 rounded-md hover:bg-gray-100"
                            >
                                <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
