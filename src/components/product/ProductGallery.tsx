"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const ProductGallery = ({ images = [] }: { images?: string[] }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Fallback if no images provided
    const displayImages = images.length > 0 ? images : [
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1539109132374-348218a1f2ad?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop"
    ];

    useGSAP(() => {
        gsap.fromTo(".main-image-container",
            { opacity: 0, scale: 0.98, filter: "blur(5px)" },
            { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.6, ease: "expo.out" }
        );
    }, { dependencies: [selectedImage] });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;

        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        // Calculate percentages
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setZoomPos({ x, y });
    };

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-8 relative items-start">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
                {displayImages.map((img, idx) => (
                    <button
                        key={idx}
                        onMouseEnter={() => setSelectedImage(idx)}
                        onClick={() => setSelectedImage(idx)}
                        className={`
                            flex-shrink-0 w-20 h-20 relative p-2 bg-white border transition-all duration-500
                            ${selectedImage === idx
                                ? "border-primary scale-105 shadow-lg"
                                : "border-zinc-200 dark:border-zinc-800 opacity-60 hover:opacity-100 hover:border-foreground/50"}
                        `}
                    >
                        <div className="relative w-full h-full overflow-hidden">
                            <Image
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                                unoptimized={img.startsWith('http')}
                            />
                        </div>
                    </button>
                ))}
            </div>

            {/* Main Image View Container */}
            <div className="flex-grow w-full relative">
                <div
                    ref={containerRef}
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                    onMouseMove={handleMouseMove}
                    className="main-image-container w-full aspect-video md:aspect-[21/9] lg:aspect-[3/2] relative bg-white p-6 border border-zinc-200 dark:border-zinc-800 overflow-hidden group cursor-crosshair shadow-sm"
                >
                    <div className="relative w-full h-full overflow-hidden">
                        <Image
                            src={displayImages[selectedImage]}
                            alt="Product Main View"
                            fill
                            priority
                            className="object-contain transition-transform duration-700 ease-out"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            unoptimized={displayImages[selectedImage].startsWith('http')}
                        />
                    </div>

                    {/* Cursor Guide */}
                    {isZoomed && (
                        <div
                            className="absolute pointer-events-none border border-primary bg-primary/5 hidden md:block"
                            style={{
                                width: '150px',
                                height: '150px',
                                top: `${zoomPos.y}%`,
                                left: `${zoomPos.x}%`,
                                transform: 'translate(-50%, -50%)',
                                zIndex: 10
                            }}
                        />
                    )}
                </div>

                {/* Outside Zoom Portal */}
                {isZoomed && (
                    <div
                        className="fixed md:absolute top-0 right-0 lg:-right-[110%] w-full lg:w-[100%] aspect-square md:aspect-[3/2] lg:aspect-square z-[200] bg-white border border-zinc-200 dark:border-zinc-800 shadow-2xl pointer-events-none hidden md:block animate-in fade-in zoom-in-95 duration-200"
                        style={{
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                        }}
                    >
                        <div className="absolute inset-0 p-4">
                            <div className="relative w-full h-full overflow-hidden bg-white">
                                <div
                                    className="absolute w-[300%] h-[300%]"
                                    style={{
                                        top: `-${(zoomPos.y * 3) - 50}%`,
                                        left: `-${(zoomPos.x * 3) - 50}%`,
                                        transition: 'none'
                                    }}
                                >
                                    <Image
                                        src={displayImages[selectedImage]}
                                        alt="Zoom View"
                                        fill
                                        className="object-contain"
                                        unoptimized={displayImages[selectedImage].startsWith('http')}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Detail Label */}
                        <div className="absolute bottom-4 left-4 bg-foreground text-background text-[8px] font-bold uppercase tracking-[0.4em] px-3 py-1">
                            Ultra Detail View
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductGallery;
