import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";

export default function Home() {
    return (
        <div className="flex flex-col gap-0">
            <Hero />
            <FeaturedProducts />
            {/* Additional Sections can trigger here */}
        </div>
    );
}
