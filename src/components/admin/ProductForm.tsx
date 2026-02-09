"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useLuxeToast } from "@/hooks/useLuxeToast";
import NextImage from "next/image";
import { X, Upload, Check, Plus, Star as StarIcon, Trash2 } from "lucide-react";

interface ProductFormData {
    name: string;
    price: string;
    description: string;
    category: string;
    image: string;
    images: string[];
    featured: boolean;
    sizes: string[];
}

interface ProductFormProps {
    initialData?: any;
    onSubmit: (data: any) => Promise<void>;
    loading: boolean;
    title: string;
}

const CATEGORIES = ["Men", "Women", "Unisex", "Accessories", "Footwear"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "38", "39", "40", "41", "42", "43", "44", "45"];

export default function ProductForm({ initialData, onSubmit, loading, title }: ProductFormProps) {
    const { success, error, info } = useLuxeToast();
    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        price: "",
        description: "",
        category: "",
        image: "",
        images: [],
        featured: false,
        sizes: [],
    });

    const [newImageUrl, setNewImageUrl] = useState("");

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                price: initialData.price?.toString() || "",
                description: initialData.description || "",
                category: initialData.category || "",
                image: initialData.image || "",
                images: initialData.images || (initialData.image ? [initialData.image] : []),
                featured: initialData.featured || false,
                sizes: initialData.sizes || [],
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const toggleSize = (size: string) => {
        setFormData((prev) => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter((s) => s !== size)
                : [...prev.sizes, size],
        }));
    };

    const addImage = () => {
        if (!newImageUrl) return;
        if (formData.images.includes(newImageUrl)) {
            error("Duplicate Image", "This image URL is already added.");
            return;
        }

        const updatedImages = [...formData.images, newImageUrl];
        setFormData(prev => ({
            ...prev,
            images: updatedImages,
            // If no main image is set, set this one as main
            image: prev.image || newImageUrl
        }));
        setNewImageUrl("");
        success("Image Added", "New perspective added to the gallery.");
    };

    const removeImage = (url: string) => {
        const updatedImages = formData.images.filter(img => img !== url);
        let newMainImage = formData.image;

        if (formData.image === url) {
            newMainImage = updatedImages.length > 0 ? updatedImages[0] : "";
        }

        setFormData(prev => ({
            ...prev,
            images: updatedImages,
            image: newMainImage
        }));
    };

    const setAsMain = (url: string) => {
        setFormData(prev => ({ ...prev, image: url }));
        info("Main Image Set", "This will be the primary visual for the product.");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.category) {
            error("Selection Required", "Please select a category.");
            return;
        }
        if (formData.images.length === 0) {
            error("Media Required", "Please add at least one product image.");
            return;
        }
        await onSubmit({
            ...formData,
            price: parseFloat(formData.price),
        });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-12 luxe-animate">
                <h2 className="text-4xl font-serif font-medium tracking-tight text-foreground">{title}</h2>
                <p className="text-sm text-muted-foreground tracking-widest uppercase mt-2">Refine your collection details</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Media & Previews */}
                <div className="lg:col-span-5 space-y-8 luxe-animate">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground">Gallery Management</label>

                        {/* Selected Main Image Preview */}
                        <div className="group relative aspect-square bg-[#F5F5F5] border border-border overflow-hidden transition-all">
                            {formData.image ? (
                                <NextImage
                                    src={formData.image}
                                    alt="Main Preview"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    unoptimized={formData.image.startsWith('http')}
                                />
                            ) : (
                                <div className="text-center p-8 flex flex-col items-center justify-center h-full">
                                    <Upload className="w-10 h-10 text-muted-foreground mb-4 opacity-20" />
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Main Preview</p>
                                </div>
                            )}
                            <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-3 py-1 text-[8px] font-bold uppercase tracking-widest border border-border">
                                Main Visual
                            </div>
                        </div>

                        {/* Image Thumbnails List */}
                        <div className="grid grid-cols-4 gap-2">
                            {formData.images.map((img, idx) => (
                                <div key={idx} className={`relative aspect-square border-2 transition-all group ${formData.image === img ? 'border-primary' : 'border-border'}`}>
                                    <NextImage
                                        src={img}
                                        alt={`Thumb ${idx}`}
                                        fill
                                        className="object-cover"
                                        unoptimized={img.startsWith('http')}
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setAsMain(img)}
                                            className="p-1.5 bg-background border border-border hover:bg-muted transition-colors"
                                            title="Set as Main"
                                        >
                                            <StarIcon className={`w-3 h-3 ${formData.image === img ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(img)}
                                            className="p-1.5 bg-background border border-border hover:bg-red-50 transition-colors text-red-500"
                                            title="Remove"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add Image Input */}
                        <div className="space-y-4 pt-4 border-t border-border border-dashed">
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    placeholder="PASTE IMAGE URL..."
                                    className="flex-grow bg-transparent border-b border-border py-2 outline-none focus:border-primary transition-colors text-[10px] font-bold tracking-widest uppercase placeholder:opacity-30"
                                    value={newImageUrl}
                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                                />
                                <button
                                    type="button"
                                    onClick={addImage}
                                    className="p-2 border border-foreground hover:bg-foreground hover:text-background transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-[8px] text-muted-foreground uppercase font-medium tracking-tight bg-muted/30 p-2 border border-border/50 leading-relaxed">
                                Tip: Add multiple viewing angles. High-resolution 1:1 or 4:5 aspect ratio URLs work best for the LUXE aesthetic.
                            </p>
                        </div>
                    </div>

                    <div className="p-6 bg-muted/30 border border-border space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Featured status</label>
                            <input
                                type="checkbox"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleChange}
                                className="w-4 h-4 accent-foreground"
                            />
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">Featured products appear on the homepage "Handpicked" collection.</p>
                    </div>
                </div>

                {/* Right Column: Detailed Info */}
                <div className="lg:col-span-7 space-y-10 luxe-animate">
                    <div className="space-y-8">
                        {/* Basic Info Group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Product Title</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="w-full bg-transparent border-b border-border py-2 outline-none focus:border-primary transition-colors text-lg font-medium tracking-tight"
                                    placeholder="e.g. Minimalist Linen Shirt"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    required
                                    step="0.01"
                                    className="w-full bg-transparent border-b border-border py-2 outline-none focus:border-primary transition-colors text-lg font-bold"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Category</label>
                            <div className="flex flex-wrap gap-3 pt-2">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                                        className={`px-6 py-3 border text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${formData.category === cat
                                            ? "bg-foreground text-background border-foreground scale-105"
                                            : "border-border text-muted-foreground hover:border-foreground/50"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Description</label>
                            <textarea
                                name="description"
                                required
                                rows={5}
                                className="w-full bg-muted/10 border border-border p-5 outline-none focus:border-primary transition-colors text-sm leading-relaxed resize-none font-medium placeholder:text-muted-foreground/30"
                                placeholder="Describe the silhouette, fabric, and artistic details..."
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Availability & Sizing</label>
                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                                {SIZES.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => toggleSize(size)}
                                        className={`aspect-square flex items-center justify-center text-[10px] font-bold transition-all border duration-300 ${formData.sizes.includes(size)
                                            ? "bg-foreground text-background border-foreground scale-110"
                                            : "border-border text-muted-foreground hover:border-foreground/40 hover:bg-muted/30"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-border mt-12">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 rounded-none bg-foreground text-background font-bold uppercase tracking-[0.4em] text-[11px] hover:bg-foreground/90 transition-all flex items-center justify-center gap-4 group"
                        >
                            {loading ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 border-2 border-background/20 border-t-background rounded-full animate-spin"></div>
                                    <span>Syncing to Catalog...</span>
                                </div>
                            ) : (
                                <>
                                    Publish Modification
                                    <Check className="w-4 h-4 group-hover:translate-x-1 group-hover:scale-110 transition-transform" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
