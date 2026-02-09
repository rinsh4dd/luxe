import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFirestore, collection, getDocs, query, limit } from "firebase/firestore/lite";
import { app } from "@/lib/firebase";
import ProductCard from "@/components/common/ProductCard";

const FeaturedProducts = async () => {
    let products: any[] = [];

    try {
        const db = getFirestore(app);
        const q = query(collection(db, "products"), limit(4));
        const querySnapshot = await getDocs(q);

        products = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching featured products:", error);
    }

    return (
        <section className="py-24 bg-background border-t border-border">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div className="space-y-2">
                        <h2 className="text-4xl md:text-5xl font-serif font-medium tracking-tight text-foreground">Featured</h2>
                        <p className="text-sm text-muted-foreground tracking-[0.3em] uppercase">Handpicked Selection</p>
                    </div>
                    <Link href="/shop" className="group flex items-center text-[10px] font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors border-b border-foreground/20 pb-1">
                        View All <ArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-[#F5F5F5] border border-border">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">No products found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedProducts;
