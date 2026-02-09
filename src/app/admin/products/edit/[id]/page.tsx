"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";
import { useLuxeToast } from "@/hooks/useLuxeToast";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { promise, error: toastError } = useLuxeToast();
    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState<any>(null);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchProduct = async () => {
            setFetching(true);
            try {
                const { getFirestore, doc, getDoc } = await import("firebase/firestore/lite");
                const { app } = await import("@/lib/firebase");
                const db = getFirestore(app);

                const docSnap = await getDoc(doc(db, "products", id));
                if (!isMounted) return;

                if (docSnap.exists()) {
                    setInitialData({ id: docSnap.id, ...docSnap.data() });
                } else {
                    toastError("Not Found", "Product does not exist.");
                    router.push("/admin/products");
                }
            } catch (err) {
                console.error("Error fetching product:", err);
                if (isMounted) toastError("Fetch Error", "Failed to load product details.");
            } finally {
                if (isMounted) setFetching(false);
            }
        };

        fetchProduct();
        return () => { isMounted = false; };
    }, [id, toastError, router]);

    const handleUpdate = async (data: any) => {
        setLoading(true);

        const updatePromise = async () => {
            const { getFirestore, doc, updateDoc } = await import("firebase/firestore/lite");
            const { app } = await import("@/lib/firebase");
            const db = getFirestore(app);

            await updateDoc(doc(db, "products", id), {
                ...data,
                updatedAt: new Date().toISOString(),
            });

            setTimeout(() => {
                router.push("/admin/products");
            }, 1000);
        };

        promise(updatePromise(), {
            loading: "Updating catalog...",
            success: "Product updated successfully.",
            error: "Failed to update product."
        }).finally(() => setLoading(false));
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-24">
            <div className="flex items-center gap-6">
                <Link href="/admin/products" className="p-3 hover:bg-muted transition-colors rounded-none border border-border">
                    <ArrowLeft className="w-4 h-4" />
                </Link>
                <div className="h-px bg-border flex-grow" />
            </div>

            <ProductForm
                key={id}
                title="Edit Product"
                initialData={initialData}
                onSubmit={handleUpdate}
                loading={loading}
            />
        </div>
    );
}
