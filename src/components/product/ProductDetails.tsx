"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import ProductGallery from "@/components/product/ProductGallery";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { Star, ArrowRight, Heart, Share2, ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLuxeToast } from "@/hooks/useLuxeToast";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function ProductDetails({ id }: { id: string }) {
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { addToCart, isInCart } = useCart();
    const { success, error, info } = useLuxeToast();
    const [selectedSize, setSelectedSize] = useState("");
    const detailsRef = useRef<HTMLDivElement>(null);

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

    useGSAP(() => {
        if (!loading && product && detailsRef.current) {
            gsap.fromTo(".luxe-animate",
                { opacity: 0, y: 30, filter: "blur(10px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "expo.out", stagger: 0.1 }
            );
        }
    }, [loading, product]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background space-y-6">
                <div className="w-16 h-16 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mb-4">
                    <span className="text-xl font-serif text-muted-foreground">?</span>
                </div>
                <h1 className="text-2xl font-serif tracking-tight text-center">
                    Piece not found <br />
                    <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-[0.4em]">The requested item does not exist</span>
                </h1>
                <Link href="/shop">
                    <Button variant="outline" className="rounded-none uppercase tracking-widest text-[10px] py-6 px-12 border-foreground mt-8">
                        View Collection
                    </Button>
                </Link>
            </div>
        );
    }

    const alreadyInCart = isInCart(id);
    const images = product.images || [product.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"];
    const sizes = product.sizes || [];
    const hasSizes = sizes.length > 0;

    const handleAddToCart = () => {
        if (!user) {
            info("Login Required", "Please login to add this piece to your collection.");
            return;
        }

        // If product has sizes, and none selected, error
        if (hasSizes && !selectedSize) {
            error("Size Required", "Please select a size to proceed.");
            return;
        }

        addToCart({
            productId: product.id.toString(),
            name: product.name,
            price: product.price,
            image: images[0],
            size: hasSizes ? selectedSize : "Standard",
            quantity: 1,
        });
        success("Added to Collection", `${product.name} ${hasSizes ? `(Size: ${selectedSize})` : ""} is now in your cart.`);
    };

    return (
        <div className="min-h-screen bg-background pt-32 pb-24" ref={detailsRef}>
            <div className="container mx-auto px-4 lg:px-12 max-w-7xl">
                <Breadcrumbs />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

                    {/* Gallery Section */}
                    <div className="lg:col-span-7 luxe-animate">
                        <ProductGallery images={images} />
                    </div>

                    {/* Details Section */}
                    <div className="lg:col-span-5 space-y-12">
                        <div className="space-y-6 luxe-animate">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                                    {product.category || "Exclusive Collection"}
                                </span>
                                <div className="flex gap-4">
                                    <button className="p-2 hover:bg-muted transition-colors rounded-full" aria-label="Share">
                                        <Share2 className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                    <button className="p-2 hover:bg-muted transition-colors rounded-full" aria-label="Add to Wishlist">
                                        <Heart className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                </div>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-serif font-medium tracking-tighter leading-[0.9] text-foreground">
                                {product.name}<span className="text-primary">.</span>
                            </h1>

                            <div className="flex items-center gap-6">
                                <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-3 h-3 fill-current" />
                                    ))}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    {product.reviews || 48} Curated Reviews
                                </span>
                            </div>

                            <p className="text-4xl font-serif font-bold text-foreground">
                                ₹{product.price.toLocaleString()}
                            </p>

                            <p className="text-sm text-muted-foreground leading-relaxed font-medium uppercase tracking-tight max-w-md">
                                {product.description || "A masterfully crafted piece designed for those who appreciate the finer things. Made with sustainable processes and premium materials."}
                            </p>
                        </div>

                        {/* Size Selection - Conditional */}
                        {hasSizes && (
                            <div className="space-y-6 luxe-animate">
                                <div className="flex justify-between items-end">
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.4em]">Select Size</h3>
                                    <button className="text-[8px] font-bold uppercase tracking-[0.2em] underline underline-offset-4 text-muted-foreground hover:text-primary transition-colors">
                                        Size Guide
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    {sizes.map((size: string) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`
                                                w-14 h-14 border transition-all duration-300 flex items-center justify-center text-[10px] font-bold
                                                ${selectedSize === size
                                                    ? "bg-foreground text-background border-foreground scale-110"
                                                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}
                                            `}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col gap-4 pt-8 border-t border-border luxe-animate">
                            {!product.isActive && (
                                <div className="p-6 bg-zinc-900 border border-white/10 space-y-2 luxe-animate">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white">Currently Unavailable</p>
                                    <p className="text-[8px] text-zinc-400 leading-relaxed uppercase tracking-widest">
                                        This specific piece is currently being curated and is not available for acquisition.
                                        Please check back soon or explore our other collections.
                                    </p>
                                </div>
                            )}

                            {product.isActive && alreadyInCart ? (
                                <Link href="/cart" className="w-full">
                                    <Button className="w-full h-16 rounded-none bg-primary text-primary-foreground font-bold uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-4 group">
                                        Check out Now
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                                    </Button>
                                </Link>
                            ) : (
                                <Button
                                    className="w-full h-16 rounded-none bg-foreground text-background font-bold uppercase tracking-[0.4em] text-[10px] hover:bg-foreground/90 transition-all hover:scale-[1.01] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
                                    onClick={handleAddToCart}
                                    disabled={!product.isActive || product.stock <= 0}
                                >
                                    {!product.isActive
                                        ? "Piece Unavailable"
                                        : product.stock <= 0
                                            ? "Sold Out"
                                            : "Add to Collection"}
                                </Button>
                            )}
                        </div>

                        {/* Professional Perks */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 luxe-animate">
                            <div className="flex items-start gap-4 p-4 border border-border/50 bg-muted/5">
                                <Truck className="w-4 h-4 text-primary mt-1" />
                                <div>
                                    <p className="text-[8px] font-bold uppercase tracking-[0.2em]">Priority Shipping</p>
                                    <p className="text-[8px] text-muted-foreground uppercase font-medium mt-1">Free Delivery over ₹2,000</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 border border-border/50 bg-muted/5">
                                <RefreshCcw className="w-4 h-4 text-primary mt-1" />
                                <div>
                                    <p className="text-[8px] font-bold uppercase tracking-[0.2em]">Signature Return</p>
                                    <p className="text-[8px] text-muted-foreground uppercase font-medium mt-1">30 Days Return Policy</p>
                                </div>
                            </div>
                            <div className="md:col-span-2 flex items-center justify-center gap-3 py-4 bg-muted/10 border border-dashed border-border">
                                <ShieldCheck className="w-3 h-3 text-green-600" />
                                <span className="text-[8px] font-bold uppercase tracking-[0.4em]">100% Authenticity Guaranteed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
