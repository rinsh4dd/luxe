"use client";

import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";

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

    return (
        <div className="space-y-8">
            {/* Search */}
            <div>
                <h3 className="font-semibold text-lg mb-4">Search</h3>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
            </div>

            {/* Categories */}
            <div>
                <h3 className="font-semibold text-lg mb-4">Categories</h3>
                <div className="space-y-2">
                    {CATEGORIES.map((category) => (
                        <div key={category} className="flex items-center">
                            <button
                                onClick={() => setSelectedCategory(category)}
                                className={`text-sm ${selectedCategory === category ? "font-bold text-primary" : "text-muted-foreground hover:text-foreground"} transition-colors`}
                            >
                                {category}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="font-semibold text-lg mb-4">Price Range</h3>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">${priceRange[0]}</span>
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        step="10"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <span className="text-sm text-gray-600">${priceRange[1]}</span>
                </div>
            </div>

            <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                    setSelectedCategory("All");
                    setPriceRange([0, 1000]);
                    setSearchQuery("");
                }}
            >
                Reset Filters
            </Button>
        </div>
    );
};

export default ProductFilters;
