"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";
import { useLuxeToast } from "@/hooks/useLuxeToast";

export default function AddProductPage() {
    const router = useRouter();
    const { promise } = useLuxeToast();
    const [loading, setLoading] = useState(false);

    const handleCreate = async (data: any) => {
        setLoading(true);

        const createPromise = async () => {
            const { getFirestore, collection, addDoc } = await import("firebase/firestore/lite");
            const { app } = await import("@/lib/firebase");
            const db = getFirestore(app);

            await addDoc(collection(db, "products"), {
                ...data,
                createdAt: new Date().toISOString(),
                rating: 0,
                reviews: 0
            });

            setTimeout(() => {
                router.push("/admin/products");
            }, 1000);
        };

        promise(createPromise(), {
            loading: "Publishing to catalog...",
            success: "Product published successfully.",
            error: "Failed to publish product."
        }).finally(() => setLoading(false));
    };

    return (
        <div className="space-y-12 pb-24">
            <div className="flex items-center gap-6">
                <Link href="/admin/products" className="p-3 hover:bg-muted transition-colors rounded-none border border-border">
                    <ArrowLeft className="w-4 h-4" />
                </Link>
                <div className="h-px bg-border flex-grow" />
            </div>

            <ProductForm
                title="New Creation"
                onSubmit={handleCreate}
                loading={loading}
            />
        </div>
    );
}
