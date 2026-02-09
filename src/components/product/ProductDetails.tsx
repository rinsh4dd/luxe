"use client";

import { Button } from "@/components/ui/Button";
import ProductGallery from "@/components/product/ProductGallery";
import { Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function ProductDetails({ id }: { id: string }) {
    // Static Product Data (Local Fallback)
    const product = {
        id: id,
        name: "Classic Minimalism Tee",
        price: 45,
        description: "Experience the ultimate comfort with our Classic Minimalism Tee. Crafted from 100% organic cotton, this tee features a relaxed fit and a timeless design that pairs perfectly with any outfit.",
        rating: 4.8,
        reviews: 124,
        images: ["/product-1.jpg", "/product-2.jpg", "/product-3.jpg"], // Ensure these exist or use placeholders if needed
        sizes: ["XS", "S", "M", "L", "XL"],
    };

    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState("");

    // No useEffect needed for static data

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Please select a size");
            return;
        }

        addToCart({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0] || 'bg-gray-200',
            size: selectedSize,
            quantity: 1,
        });
        alert("Added to cart!");
    };

    // Loading state is not really needed for static data, but existing structure might expect it.
    // Simplifying to render directly.

    const sizes = product.sizes;
    const images = product.images;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <ProductGallery images={images} />

                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tighter mb-2 text-foreground">{product.name}</h1>
                        <div className="flex items-center space-x-2 text-sm">
                            <div className="flex text-yellow-500">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                            <span className="text-muted-foreground">({product.reviews || 0} reviews)</span>
                        </div>
                    </div>

                    <p className="text-2xl font-medium text-primary">${product.price}</p>

                    <p className="text-muted-foreground leading-relaxed">
                        {product.description}
                    </p>

                    <div>
                        <h3 className="font-medium mb-3 text-foreground">Select Size</h3>
                        <div className="flex flex-wrap gap-3">
                            {sizes.map((size: string) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-12 h-12 rounded-full border flex items-center justify-center text-sm font-bold transition-all ${selectedSize === size ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-foreground"}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-border">
                        <Button size="lg" className="flex-1 w-full rounded-full font-bold" onClick={handleAddToCart}>Add to Cart</Button>
                        <Button size="lg" variant="outline" className="flex-none rounded-full">
                            <Star className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1 pt-4">
                        <p>Free shipping on orders over $100</p>
                        <p>30-day return policy</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
