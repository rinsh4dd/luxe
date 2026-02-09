"use client";

import { Search, X } from "lucide-react";

const CATEGORIES = ["All", "Men", "Women", "Unisex", "Accessories"];

interface ProductFiltersProps {
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    priceRange: number[];
    setPriceRange: (range: number[]) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const ProductFilters = ({
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    searchQuery,
    setSearchQuery
}: ProductFiltersProps) => {

    const handleReset = () => {
        setSelectedCategory("All");
        setPriceRange([0, 50000]);
        setSearchQuery("");
    };

    return (
        <div className="space-y-12">
            {/* Search */}
            <div className="group">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">Search</h3>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="SEARCH PRODUCTS..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-0 pr-8 py-3 border-b border-border bg-transparent focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/30 text-xs font-bold tracking-widest uppercase"
                    />
                    <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                </div>
            </div>

            {/* Categories */}
            <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-6">Categories</h3>
                <div className="grid grid-cols-1 gap-1">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`group flex items-center justify-between py-2 text-left transition-all ${selectedCategory === category
                                ? "text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <span className={`text-xs font-bold tracking-widest uppercase ${selectedCategory === category ? "border-b border-foreground" : ""
                                }`}>
                                {category}
                            </span>
                            {selectedCategory === category && (
                                <div className="w-1 h-1 bg-foreground rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-8">Price Range</h3>
                <div className="space-y-6">
                    <div className="flex justify-between items-baseline">
                        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Max. Budget</span>
                        <span className="text-lg font-serif italic">₹{priceRange[1]}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="50000"
                        step="500"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-px bg-border rounded-none appearance-none cursor-pointer accent-foreground"
                    />
                    <div className="flex justify-between text-[8px] font-bold tracking-[0.2em] text-muted-foreground/50 uppercase">
                        <span>₹0</span>
                        <span>₹50000</span>
                    </div>
                </div>
            </div>

            {/* Reset Actions */}
            <button
                onClick={handleReset}
                className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
            >
                <X className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300" />
                Clear Selection
            </button>
        </div>
    );
};

export default ProductFilters;
