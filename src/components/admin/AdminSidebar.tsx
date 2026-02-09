"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, PlusCircle, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef<HTMLElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const container = useRef<HTMLDivElement>(null);

    const links = [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/products", label: "Products", icon: ShoppingBag },
        { href: "/admin/products/add", label: "Add Product", icon: PlusCircle },
        { href: "/admin/orders", label: "Orders", icon: Users },
    ];

    // GSAP Animation for Sidebar
    useGSAP(() => {
        if (window.innerWidth < 768) { // Only animate on mobile
            if (isOpen) {
                gsap.to(sidebarRef.current, { x: 0, duration: 0.3, ease: "power2.out" });
                gsap.to(overlayRef.current, { opacity: 0.5, pointerEvents: "auto", duration: 0.3 });
            } else {
                gsap.to(sidebarRef.current, { x: "-100%", duration: 0.3, ease: "power2.in" });
                gsap.to(overlayRef.current, { opacity: 0, pointerEvents: "none", duration: 0.3 });
            }
        } else {
            // Reset for desktop
            gsap.set(sidebarRef.current, { x: 0 });
            gsap.set(overlayRef.current, { opacity: 0, pointerEvents: "none" });
        }
    }, { dependencies: [isOpen], scope: container });

    // Close on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(false);
                gsap.set(sidebarRef.current, { x: 0 }); // Ensure visible on desktop
            } else {
                if (!isOpen) gsap.set(sidebarRef.current, { x: "-100%" }); // Ensure hidden on mobile load
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen]);

    return (
        <div ref={container}>
            {/* Mobile Header Trigger */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b border-border flex items-center px-4 z-40">
                <button onClick={() => setIsOpen(true)} className="p-2 -ml-2 hover:bg-muted rounded-full">
                    <Menu className="w-6 h-6" />
                </button>
                <span className="ml-2 font-bold text-lg">Admin Panel</span>
            </div>

            {/* Overlay */}
            <div
                ref={overlayRef}
                className="fixed inset-0 bg-black/50 z-40 opacity-0 pointer-events-none md:hidden"
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <aside
                ref={sidebarRef}
                className="w-64 bg-card border-r border-border h-screen fixed left-0 top-0 flex flex-col z-50 transform -translate-x-full md:translate-x-0"
            >
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold tracking-tighter text-primary">
                        Luxe Admin
                    </Link>
                    <button onClick={() => setIsOpen(false)} className="md:hidden p-1 hover:bg-muted rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)} // Close on navigate (mobile)
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? "bg-primary text-primary-foreground font-medium"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border mt-auto">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-muted-foreground hover:text-red-500 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>
        </div>
    );
}
