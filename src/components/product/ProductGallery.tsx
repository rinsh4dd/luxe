"use client";

import { useState } from "react";

const ProductGallery = ({ images = [] }: { images?: string[] }) => {
    const [selectedImage, setSelectedImage] = useState(0);

    // Fallback if no images provided
    const displayImages = images.length > 0 ? images : ["bg-gray-200", "bg-gray-300", "bg-gray-400", "bg-gray-500"];

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible">
                {displayImages.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${selectedImage === idx ? "border-black" : "border-transparent"}`}
                    >
                        <div className={`w-full h-full ${img}`}></div>
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div className={`flex-grow aspect-square rounded-lg overflow-hidden ${displayImages[selectedImage]} bg-cover bg-center`}>
                {/* Placeholder for real image */}
            </div>
        </div>
    );
};

export default ProductGallery;
