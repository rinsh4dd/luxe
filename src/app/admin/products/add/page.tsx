"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        category: "",
        image: "", // Simple URL input for now
        featured: false,
        sizes: [] as string[],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { getFirestore, collection, addDoc } = await import("firebase/firestore/lite");
            const { app } = await import("@/lib/firebase");
            const db = getFirestore(app);

            await addDoc(collection(db, "products"), {
                name: formData.name,
                price: parseFloat(formData.price),
                description: formData.description,
                category: formData.category,
                image: formData.image,
                featured: formData.featured,
                sizes: formData.sizes.length > 0 ? formData.sizes : ["XS", "S", "M", "L", "XL"], // Use selected or default
                createdAt: new Date().toISOString(),
                rating: 0,
                reviews: 0
            });

            alert("Product created successfully!");
            router.push("/admin/products");
        } catch (error) {
            console.error("Error creating product:", error);
            alert("Failed to create product.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/products" className="p-2 hover:bg-muted rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Add Product</h2>
                    <p className="text-muted-foreground">Create a new item for your store.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-xl border border-border shadow-sm">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            required
                            min="0"
                            step="0.01"
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <select
                                name="category"
                                required
                                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="">Select Category</option>
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Unisex">Unisex</option>
                                <option value="Accessories">Accessories</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Sizes</label>
                            <div className="flex flex-wrap gap-2">
                                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                                    <label key={size} className="flex items-center space-x-2 cursor-pointer border border-border rounded-md px-3 py-1 hover:bg-muted transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={formData.sizes.includes(size)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFormData(prev => ({ ...prev, sizes: [...prev.sizes, size] }));
                                                } else {
                                                    setFormData(prev => ({ ...prev, sizes: prev.sizes.filter(s => s !== size) }));
                                                }
                                            }}
                                            className="w-4 h-4 text-primary rounded border-border focus:ring-primary accent-primary"
                                        />
                                        <span className="text-sm">{size}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        required
                        rows={4}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Image URL</label>
                    <input
                        type="url"
                        name="image"
                        placeholder="https://example.com/image.jpg"
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                        value={formData.image}
                        onChange={handleChange}
                    />
                    <p className="text-xs text-muted-foreground">Tip: Use a direct image link.</p>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="featured"
                        id="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
                    />
                    <label htmlFor="featured" className="text-sm font-medium select-none">Mark as Featured Product</label>
                </div>

                <div className="pt-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
                    >
                        {loading ? "Creating..." : "Create Product"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
