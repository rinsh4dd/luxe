import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoryGrid from "@/components/home/CategoryGrid";
import PromoBanner from "@/components/home/PromoBanner";
import { Suspense } from "react";

export default function Home() {
    return (
        <div className="flex flex-col gap-0 overflow-x-hidden">
            <PromoBanner />
            <Hero />
            <Suspense fallback={<div className="h-96 bg-background animate-pulse" />}>
                <CategoryGrid />
            </Suspense>
            <Suspense fallback={<div className="h-96 bg-background animate-pulse" />}>
                <FeaturedProducts />
            </Suspense>
            {/* Additional Sections can trigger here */}
        </div>
    );
}
