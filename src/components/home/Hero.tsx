"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const Hero = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(
            textRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, delay: 0.2 }
        )
            .fromTo(
                imageRef.current,
                { opacity: 0, x: 50 },
                { opacity: 1, x: 0, duration: 1 },
                "-=0.8"
            );

    }, []);

    return (
        <section ref={heroRef} className="relative min-h-[90vh] flex items-center bg-background overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 clip-path-slant hidden md:block"></div>

            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
                <div ref={textRef} className="space-y-6">
                    <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide border border-primary/20">
                        New Collection 2024
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] text-foreground">
                        Elevate Your <br />
                        <span className="text-primary">Everyday</span> Style.
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-lg">
                        Discover our curated collection of premium essentials designed for the modern individual. Quality, comfort, and timeless elegance.
                    </p>
                    <div className="flex space-x-4 pt-4">
                        <Link href="/shop">
                            <Button size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8">Shop Now</Button>
                        </Link>
                        <Link href="/collections">
                            <Button variant="outline" size="lg" className="rounded-full border-primary/20 hover:bg-primary/5 text-foreground">View Collections</Button>
                        </Link>
                    </div>
                </div>

                <div ref={imageRef} className="relative h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl bg-muted group">
                    <img
                        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
                        alt="Luxury Fashion"
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                        <p className="text-white font-medium text-lg">The Golden Standard</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
