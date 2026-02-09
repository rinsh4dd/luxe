"use client";

import ProductFilters from "@/components/shop/ProductFilters";
import ProductCard from "@/components/common/ProductCard";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { useEffect, useState } from "react";

export default function ShopPage() {
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [priceRange, setPriceRange] = useState([0, 50000]);
    const [searchQuery, setSearchQuery] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { getFirestore, collection, getDocs } = await import("firebase/firestore/lite");
                const { app } = await import("@/lib/firebase");
                const db = getFirestore(app);

                const querySnapshot = await getDocs(collection(db, "products"));

                const productsData = querySnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() as any }));

                setAllProducts(productsData);
                setFilteredProducts(productsData); // Initial load
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Filter Logic
    useEffect(() => {
        let result = allProducts;

        // 1. Search Filter
        if (searchQuery) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // 2. Category Filter
        if (selectedCategory !== "All") {
            result = result.filter(product =>
                product.category === selectedCategory
            );
        }

        // 3. Price Filter
        if (priceRange) {
            result = result.filter(product =>
                product.price >= priceRange[0] && product.price <= priceRange[1]
            );
        }

        setFilteredProducts(result);
        setCurrentPage(1); // Reset to page 1 on filter change
    }, [allProducts, searchQuery, selectedCategory, priceRange]);

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-24">
                <div className="h-12 w-64 bg-muted animate-pulse mb-12"></div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    <aside className="hidden lg:block lg:col-span-1 space-y-8">
                        <div className="h-[400px] bg-muted animate-pulse"></div>
                    </aside>
                    <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="aspect-square bg-muted animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 lg:py-24">
            <Breadcrumbs />
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-8 border-b border-border pb-8">
                <div className="space-y-2">
                    <h1 className="text-5xl lg:text-7xl font-serif font-medium tracking-tight text-foreground">Shop</h1>
                    <p className="text-[10px] text-muted-foreground tracking-[0.4em] uppercase font-bold">Our Collection</p>
                </div>

                {/* Mobile Filter Toggle */}
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="lg:hidden w-full md:w-auto px-8 h-12 bg-foreground text-background font-bold tracking-widest text-xs uppercase flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                    Filters
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-20">
                {/* Desktop Filters Sidebar */}
                <aside className="hidden lg:block lg:col-span-1 border-r border-border pr-12">
                    <ProductFilters
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />
                </aside>

                {/* Mobile Filter Drawer */}
                {isFilterOpen && (
                    <div className="fixed inset-0 z-[100] lg:hidden">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity"
                            onClick={() => setIsFilterOpen(false)}
                        />
                        {/* Drawer Panel */}
                        <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-background border-l border-border p-12 overflow-y-auto shadow-2xl">
                            <div className="flex justify-between items-center mb-12 pb-4 border-b border-border">
                                <span className="text-[10px] font-bold tracking-[0.4em] uppercase">Filters</span>
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="p-1 hover:rotate-90 transition-transform duration-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>
                            <ProductFilters
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                            />
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="w-full mt-16 h-14 bg-foreground text-background font-bold tracking-widest text-xs uppercase hover:bg-foreground/90 transition-all"
                            >
                                Show Results
                            </button>
                        </div>
                    </div>
                )}

                {/* Product Grid */}
                <div className="lg:col-span-3">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-32 bg-[#F5F5F5] border border-border">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">No Products Found</h3>
                            <p className="text-xs text-muted-foreground/60 mt-4 uppercase tracking-widest leading-relaxed">Consider changing your search filters.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                                {currentItems.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center mt-24 space-x-1">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="h-10 w-10 border border-border flex items-center justify-center hover:bg-foreground hover:text-background disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-foreground transition-all"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => paginate(i + 1)}
                                            className={`h-10 w-10 border text-[10px] font-bold tracking-widest transition-all ${currentPage === i + 1
                                                ? "bg-foreground text-background border-foreground"
                                                : "border-border hover:bg-muted"
                                                }`}
                                        >
                                            {String(i + 1).padStart(2, '0')}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="h-10 w-10 border border-border flex items-center justify-center hover:bg-foreground hover:text-background disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-foreground transition-all"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
