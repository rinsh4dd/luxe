"use client";

import ProductFilters from "@/components/shop/ProductFilters";
import ProductCard from "@/components/shop/ProductCard";
import { useEffect, useState } from "react";

export default function ShopPage() {
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [priceRange, setPriceRange] = useState([0, 1000]);
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

                const productsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

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

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="h-10 w-48 bg-muted animate-pulse rounded mb-8"></div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    <aside className="hidden lg:block lg:col-span-1 space-y-8">
                        <div className="h-64 bg-muted animate-pulse rounded"></div>
                    </aside>
                    <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold tracking-tighter mb-8 text-foreground">Shop All</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Filters Sidebar */}
                <aside className="hidden lg:block lg:col-span-1">
                    <ProductFilters
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />
                </aside>

                {/* Product Grid */}
                <div className="lg:col-span-3">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-20 bg-muted/50 rounded-lg border border-border">
                            <h3 className="text-lg font-medium">No products found</h3>
                            <p className="text-muted-foreground mt-2">Try adjusting your filters or search query.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {currentItems.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-12 space-x-2">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => paginate(i + 1)}
                                            className={`px-4 py-2 border border-border rounded-md transition-colors ${currentPage === i + 1
                                                    ? "bg-primary text-primary-foreground font-bold"
                                                    : "hover:bg-muted"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
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
