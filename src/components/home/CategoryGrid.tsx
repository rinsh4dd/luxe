"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const categories = [
    {
        name: "MEN",
        image: "https://images.unsplash.com/photo-1549037173-e3b717902c57?q=80&w=2070&auto=format&fit=crop",
        link: "/shop?category=Men",
        description: "Tailored Sophistication"
    },
    {
        name: "WOMEN",
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1974&auto=format&fit=crop",
        link: "/shop?category=Women",
        description: "Effortless Elegance"
    },
    {
        name: "ACCESSORIES",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=2070&auto=format&fit=crop",
        link: "/shop?category=Accessories",
        description: "Finishing Touches"
    }
];

const CategoryGrid = () => {
    return (
        <section className="py-0">
            <div className="grid grid-cols-1 md:grid-cols-3 h-[600px] md:h-[80vh]">
                {categories.map((category) => (
                    <Link
                        key={category.name}
                        href={category.link}
                        className="group relative h-full w-full overflow-hidden block"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
                        </div>

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 mt-12 md:mt-0">
                            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-widest mb-2 opacity-100 transform translate-y-0 transition-all duration-500">
                                {category.name}
                            </h3>
                            <p className="text-white/90 text-sm md:text-base tracking-wider mb-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 border-b border-white/50 pb-1 inline-block">
                                {category.description}
                            </p>

                            <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-200">
                                <span className="inline-flex items-center text-white font-medium uppercase tracking-wide text-xs border border-white px-6 py-3 hover:bg-white hover:text-black transition-colors">
                                    Shop Now <ArrowRight className="ml-2 w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default CategoryGrid;
