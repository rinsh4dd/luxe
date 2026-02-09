"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

const CATEGORIES = ["All", "Men", "Women", "Unisex", "Accessories"];

const ProductFilters = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [priceRange, setPriceRange] = useState([0, 1000]);

    return (
        <div className="space-y-8">
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

            <div>
                <h3 className="font-semibold text-lg mb-4">Price Range</h3>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">${priceRange[0]}</span>
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <span className="text-sm text-gray-600">${priceRange[1]}</span>
                </div>
            </div>

            <Button variant="outline" className="w-full">Apply Filters</Button>
        </div>
    );
};

export default ProductFilters;
