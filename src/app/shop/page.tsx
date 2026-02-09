"use client";

import ProductFilters from "@/components/shop/ProductFilters";
import ProductCard from "@/components/shop/ProductCard";
import { useEffect, useState } from "react";

export default function ShopPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { getFirestore, collection, getDocs } = await import("firebase/firestore/lite");
                const { app } = await import("@/lib/firebase");
                const db = getFirestore(app);

                const querySnapshot = await getDocs(collection(db, "products"));

                const productsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // Only show unblocked products if that field existed, but simpler for now
                setProducts(productsData);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="h-10 w-48 bg-muted animate-pulse rounded mb-8"></div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    <aside className="hidden lg:block lg:col-span-1 space-y-8">
                        <div className="h-64 bg-muted animate-pulse rounded"></div>
                    </aside>
                    <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold tracking-tighter mb-8 text-foreground">Shop All</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Filters Sidebar */}
                <aside className="hidden lg:block lg:col-span-1">
                    <ProductFilters />
                </aside>

                {/* Product Grid */}
                <div className="lg:col-span-3">
                    {products.length === 0 ? (
                        <div className="text-center py-20 bg-muted/50 rounded-lg border border-border">
                            <h3 className="text-lg font-medium">No products found</h3>
                            <p className="text-muted-foreground mt-2">Check back later or add products in the admin panel.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
