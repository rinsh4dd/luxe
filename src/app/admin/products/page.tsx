"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Tag, DollarSign, Box } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLuxeToast } from "@/hooks/useLuxeToast";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { promise, success } = useLuxeToast();

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

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to remove \"${name}\" from the catalog?`)) return;

        const deletePromise = async () => {
            const { getFirestore, doc, deleteDoc } = await import("firebase/firestore/lite");
            const { app } = await import("@/lib/firebase");
            const db = getFirestore(app);

            await deleteDoc(doc(db, "products", id));
            setProducts(prev => prev.filter(p => p.id !== id));
        };

        promise(deletePromise(), {
            loading: "Removing from catalog...",
            success: "Product removed successfully.",
            error: "Failed to remove product."
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-24">
            <div className="flex items-end justify-between">
                <div className="space-y-2">
                    <h2 className="text-5xl font-serif font-medium tracking-tight text-foreground">Catalog</h2>
                    <p className="text-sm text-muted-foreground tracking-[0.3em] uppercase">Inventory Management</p>
                </div>
                <Link href="/admin/products/add">
                    <Button className="h-12 px-8 rounded-none bg-foreground text-background font-bold tracking-widest text-xs uppercase hover:bg-foreground/90 transition-all flex items-center gap-2">
                        <Plus className="w-4 h-4" /> New Entry
                    </Button>
                </Link>
            </div>

            <div className="bg-background border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border bg-muted/20">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground w-[40%]">Designation</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Category</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Price</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground text-right uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 text-muted-foreground">
                                            <Box className="w-8 h-8 opacity-20" />
                                            <p className="text-xs font-bold uppercase tracking-widest">No products found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="group hover:bg-muted/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-base font-bold text-foreground tracking-tight">{product.name}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">ID: {product.id.substring(0, 8)}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-muted text-[10px] font-bold uppercase tracking-widest rounded-none border border-border">
                                                <Tag className="w-3 h-3" />
                                                {product.category || "General"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="flex items-center gap-1 font-bold text-base">
                                                <DollarSign className="w-4 h-4 text-muted-foreground" />
                                                {product.price}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/products/edit/${product.id}`}>
                                                    <button className="p-2 border border-border hover:bg-foreground hover:text-background transition-all">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                    className="p-2 border border-border hover:bg-red-500 hover:text-white transition-all text-red-500 hover:border-red-500"
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
            </div>
        </div>
    );
}
