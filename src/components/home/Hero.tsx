"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown } from "lucide-react";

const Hero = () => {
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(
            textRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1.5, delay: 0.5 }
        );

    }, []);

    const scrollToContent = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth"
        });
    };

    return (
        <section className="relative h-screen w-full overflow-hidden">
            {/* Background Image / Video Placeholder */}
            {/* Using a high-fashion, dark moody image for that premium look */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2674&auto=format&fit=crop"
                    alt="Hero Background"
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                />
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-black/30 bg-gradient-to-b from-black/10 via-transparent to-black/60"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
                <div ref={textRef} className="space-y-6 max-w-4xl">
                    <p className="text-sm md:text-base tracking-[0.3em] uppercase font-medium text-white/90">
                        Spring / Summer 2024
                    </p>
                    <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter leading-none">
                        MODERN<br />LUXURY
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto font-light leading-relaxed">
                        Redefining the standard of elegance with our latest collection of premium essentials.
                    </p>

                    <div className="pt-8 flex flex-col md:flex-row gap-4 justify-center">
                        <Link href="/shop">
                            <Button size="lg" className="min-w-[180px] bg-white text-black hover:bg-white/90 rounded-none h-12 text-xs uppercase tracking-widest font-bold">
                                Shop Collection
                            </Button>
                        </Link>
                        <Link href="/shop?category=Men">
                            <Button variant="outline" size="lg" className="min-w-[180px] border-white text-white hover:bg-white hover:text-black rounded-none h-12 text-xs uppercase tracking-widest font-bold">
                                View Lookbook
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <button
                onClick={scrollToContent}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white animate-bounce p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Scroll down"
            >
                <ArrowDown className="w-6 h-6" />
            </button>
        </section>
    );
};

export default Hero;