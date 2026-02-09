"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Breadcrumbs = () => {
    const pathname = usePathname();
    const containerRef = useRef<HTMLDivElement>(null);

    // Don't show on home page
    if (pathname === "/") return null;

    const paths = pathname.split("/").filter((path) => path !== "");

    // Breadcrumb labels mapping for specific routes
    const routeLabels: Record<string, string> = {
        "shop": "Collection",
        "cart": "Shopping Bag",
        "wishlist": "Private Selection",
        "profile": "My Account",
        "checkout": "Acquisition",
        "product": "Catalogue",
        "admin": "Governance",
        "orders": "Order Stream"
    };

    useGSAP(() => {
        if (containerRef.current) {
            gsap.fromTo(containerRef.current.children,
                { opacity: 0, x: -10, filter: "blur(4px)" },
                { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.6, stagger: 0.05, ease: "power2.out" }
            );
        }
    }, { scope: containerRef, dependencies: [pathname] });

    return (
        <nav
            ref={containerRef}
            aria-label="Breadcrumb"
            className="flex items-center space-x-3 mb-8 overflow-x-auto whitespace-nowrap no-scrollbar py-2"
        >
            <Link
                href="/"
                className="text-muted-foreground hover:text-primary transition-colors flex items-center"
            >
                <Home className="w-3 h-3" />
                <span className="sr-only">Home</span>
            </Link>

            {paths.map((path, index) => {
                const href = `/${paths.slice(0, index + 1).join("/")}`;
                const isLast = index === paths.length - 1;
                const label = routeLabels[path.toLowerCase()] || path.replace(/-/g, " ");

                // Skip showing "Product" if it's just a segment for the dynamic ID
                if (path.toLowerCase() === "product" && paths[index + 1]) return null;

                return (
                    <div key={href} className="flex items-center space-x-3">
                        <ChevronRight className="w-3 h-3 text-border shrink-0" />
                        {isLast ? (
                            <span
                                className="text-[10px] font-bold uppercase tracking-[0.3em] font-serif text-foreground"
                                aria-current="page"
                            >
                                {label}
                            </span>
                        ) : (
                            <Link
                                href={href}
                                className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors"
                            >
                                {label}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
};

export default Breadcrumbs;
