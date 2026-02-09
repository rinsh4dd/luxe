"use client";

import { X } from "lucide-react";
import { useState } from "react";

const PromoBanner = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-primary text-primary-foreground py-2 px-4 relative">
            <div className="container mx-auto text-center text-xs md:text-sm font-medium tracking-wide">
                COMPLIMENTARY SHIPPING ON ALL ORDERS OVER $150 | FREE RETURNS
            </div>
            <button
                onClick={() => setIsVisible(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded-full transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default PromoBanner;
