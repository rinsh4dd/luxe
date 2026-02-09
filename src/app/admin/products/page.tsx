"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, Tag, ArrowRight, Package, Loader2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLuxeToast } from "@/hooks/useLuxeToast";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { promise } = useLuxeToast();

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
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useGSAP(() => {
        if (!loading) {
            gsap.fromTo("tbody tr",
                { opacity: 0, scale: 0.98 },
                { opacity: 1, scale: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" }
            );
        }
    }, [loading]);

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        const togglePromise = async () => {
            const { getFirestore, doc, updateDoc } = await import("firebase/firestore/lite");
            const { app } = await import("@/lib/firebase");
            const db = getFirestore(app);

            await updateDoc(doc(db, "products", id), { isActive: !currentStatus });
            setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: !currentStatus } : p));
        };

        promise(togglePromise(), {
            loading: "Updating status...",
            success: `Product visibility updated.`,
            error: "Failed to update status."
        });
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Confirm removal of "${name}" from the editorial catalog?`)) return;

        const deletePromise = async () => {
            const { getFirestore, doc, deleteDoc } = await import("firebase/firestore/lite");
            const { app } = await import("@/lib/firebase");
            const db = getFirestore(app);

            await deleteDoc(doc(db, "products", id));
            setProducts(prev => prev.filter(p => p.id !== id));
        };

        promise(deletePromise(), {
            loading: "Removing from inventory...",
            success: "Piece removed gracefully.",
            error: "Failed to remove piece."
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-16 pb-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <h2 className="text-6xl font-serif font-medium tracking-tighter text-foreground leading-none">Catalog</h2>
                    <p className="text-[10px] text-muted-foreground tracking-[0.5em] uppercase font-bold">Editorial Inventory Management</p>
                </div>
                <Link href="/admin/products/add">
                    <Button className="h-14 px-10 rounded-none bg-foreground text-background font-bold tracking-[0.3em] text-[10px] uppercase hover:bg-foreground/90 transition-all flex items-center gap-4 group">
                        <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" /> New Addition
                    </Button>
                </Link>
            </div>

            <div className="relative">
                <div className="overflow-x-auto border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                                <th className="px-10 py-6 text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground">Product Specification</th>
                                <th className="px-10 py-6 text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground">Classification & Stock</th>
                                <th className="px-10 py-6 text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground">Evaluation</th>
                                <th className="px-10 py-6 text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground text-right">Utility</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-10 py-32 text-center bg-zinc-50/20 dark:bg-zinc-900/10">
                                        <div className="flex flex-col items-center gap-6 text-muted-foreground">
                                            <Package className="w-12 h-12 opacity-5" />
                                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-30">Archive Empty</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-all duration-300">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-20 h-24 relative bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                                                    <Image
                                                        src={product.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="80px"
                                                        unoptimized={product.image && product.image.startsWith('http')}
                                                    />
                                                    {product.isActive === false && (
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                            <span className="text-[6px] font-bold text-white uppercase tracking-[0.3em]">Inactive</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xl font-serif font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">{product.name}</span>
                                                    <div className="flex items-center gap-2 mt-1.5 ">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${product.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                                        <span className="text-[8px] text-muted-foreground uppercase tracking-widest opacity-60">Status: {product.isActive ? 'Active' : 'Private'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col gap-3">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">
                                                    {product.category || "General"}
                                                </span>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex flex-col">
                                                        <span className={`text-sm font-bold tracking-tight ${product.stock <= 5 ? 'text-red-500' : 'text-foreground'}`}>
                                                            {product.stock || 0} PCS
                                                        </span>
                                                        <span className="text-[7px] text-muted-foreground uppercase tracking-widest font-bold">Stock Count</span>
                                                    </div>
                                                    <div className="h-4 w-px bg-border" />
                                                    <div className="flex gap-1">
                                                        {product.sizes?.slice(0, 2).map((s: string) => (
                                                            <span key={s} className="text-[7px] text-muted-foreground border border-border px-1 uppercase">{s}</span>
                                                        ))}
                                                        {product.sizes?.length > 2 && <span className="text-[7px] text-muted-foreground">+{product.sizes.length - 2}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-xl font-bold tracking-tighter">₹{product.price.toLocaleString()}</span>
                                                <span className="text-[8px] text-muted-foreground uppercase tracking-widest mt-1">Market Valuation</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                                <button
                                                    onClick={() => handleToggleStatus(product.id, product.isActive)}
                                                    className={`p-3 border transition-all shadow-sm ${product.isActive ? 'border-green-500/20 text-green-500 hover:bg-green-500 hover:text-white' : 'border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white'}`}
                                                    title={product.isActive ? "Deactivate" : "Activate"}
                                                >
                                                    <Package className="w-4 h-4" />
                                                </button>
                                                <Link href={`/admin/products/edit/${product.id}`}>
                                                    <button className="p-3 border border-zinc-100 dark:border-zinc-800 hover:bg-foreground hover:text-background transition-all shadow-sm">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                    className="p-3 border border-zinc-100 dark:border-zinc-800 hover:bg-red-500 hover:text-white transition-all text-red-500 hover:border-red-500 shadow-sm"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Visual Accent */}
                <div className="absolute -left-1 top-0 bottom-0 w-[2px] bg-primary/20" />
            </div>
        </div>
    );
}
