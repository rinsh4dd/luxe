"use client";

import { Button } from "@/components/ui/Button";
import ProductGallery from "@/components/product/ProductGallery";
import { Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import { useEffect } from "react";

export default function ProductDetails({ id }: { id: string }) {
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { getFirestore, doc, getDoc } = await import("firebase/firestore/lite");
                const { app } = await import("@/lib/firebase");
                const db = getFirestore(app);
                const docRef = doc(db, "products", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.log("No such product!");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    if (loading) {
        return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>;
    }

    if (!product) {
        return <div className="container mx-auto px-4 py-12 text-center">Product not found.</div>;
    }

    // No useEffect needed for static data

    const handleAddToCart = () => {
        if (!user) {
            toast.error("Please login to add items to cart");
            return;
        }

        if (!selectedSize) {
            toast.error("Please select a size");
            return;
        }

        addToCart({
            productId: product.id.toString(),
            name: product.name,
            price: product.price,
            image: product.image || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
            size: selectedSize,
            quantity: 1,
        });
        toast.success("Added to cart!");
    };

    // Use product.images or fallback to single image wrapped in array
    const images = product.images || [product.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"];
    // Use product.sizes or default
    const sizes = product.sizes || ["XS", "S", "M", "L", "XL"];

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
