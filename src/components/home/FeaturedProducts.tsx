"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const FeaturedProducts = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { getFirestore, collection, getDocs, query, limit } = await import("firebase/firestore/lite");
                const { app } = await import("@/lib/firebase");
                const db = getFirestore(app);

                // Fetch top 4 products (assuming we might want to order by date later, but simple limit for now)
                const q = query(collection(db, "products"), limit(4));
                const querySnapshot = await getDocs(q);

                const productsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProducts(productsData);
            } catch (error) {
                console.error("Error fetching featured products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <section className="py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <div className="h-8 w-64 bg-muted animate-pulse rounded"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-4">
                                <div className="aspect-[3/4] bg-muted animate-pulse rounded-lg"></div>
                                <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
                                <div className="h-4 w-1/2 bg-muted animate-pulse rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tighter mb-2 text-foreground">Featured Products</h2>
                        <p className="text-muted-foreground">Handpicked favorites just for you.</p>
                    </div>
                    <Link href="/shop" className="group flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                        View all <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        No products found. Add some from the Admin Dashboard!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <Link href={`/product/${product.id}`} key={product.id} className="group cursor-pointer block">
                                <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-muted">
                                    <img
                                        src={product.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"}
                                        alt={product.name}
                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">{product.category}</p>
                                    <h3 className="font-medium text-lg leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
                                    <p className="font-semibold text-foreground">${product.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedProducts;
