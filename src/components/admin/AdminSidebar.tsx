"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, PlusCircle, Menu, X, ArrowRight, Package } from "lucide-react";
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
        { href: "/admin/orders", label: "Orders", icon: Package },
        { href: "/admin/users", label: "Users", icon: Users },
    ];

    useGSAP(() => {
        if (window.innerWidth < 768) {
            if (isOpen) {
                gsap.to(sidebarRef.current, { x: 0, duration: 0.4, ease: "expo.out" });
                gsap.to(overlayRef.current, { opacity: 1, pointerEvents: "auto", duration: 0.4 });
            } else {
                gsap.to(sidebarRef.current, { x: "-100%", duration: 0.4, ease: "expo.in" });
                gsap.to(overlayRef.current, { opacity: 0, pointerEvents: "none", duration: 0.4 });
            }
        }
    }, { dependencies: [isOpen], scope: container });

    return (
        <div ref={container}>
            {/* Mobile Header Trigger */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between px-6 z-[60]">
                <Link href="/" className="text-xl font-serif font-bold tracking-[0.2em]">
                    LUXE<span className="text-primary">.</span>
                </Link>
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 border border-border hover:bg-muted transition-all"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            {/* Overlay */}
            <div
                ref={overlayRef}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[70] opacity-0 pointer-events-none md:hidden transition-all duration-500"
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <aside
                ref={sidebarRef}
                className="w-72 bg-white dark:bg-zinc-950 border-r border-zinc-100 dark:border-zinc-800/50 h-screen fixed left-0 top-0 flex flex-col z-[80] transform -translate-x-full md:translate-x-0 transition-transform duration-500 shadow-2xl md:shadow-none"
            >
                <div className="p-8 border-b border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between">
                    <Link href="/" className="group flex flex-col">
                        <span className="text-2xl font-serif font-bold tracking-[0.3em] text-foreground transition-all duration-500 group-hover:tracking-[0.4em]">
                            LUXE<span className="text-primary text-xl">.</span>
                        </span>
                        <span className="text-[6px] font-bold uppercase tracking-[0.5em] text-muted-foreground mt-1">
                            Management Suite
                        </span>
                    </Link>
                    <button onClick={() => setIsOpen(false)} className="md:hidden p-2 border border-border hover:bg-muted transition-all">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <nav className="flex-1 p-8 space-y-6 overflow-y-auto">
                    <div className="space-y-2">
                        <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-muted-foreground ml-2">Navigation</span>
                        <div className="space-y-1">
                            {links.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center justify-between group px-4 py-4 transition-all duration-300 ${isActive
                                            ? "bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
                                            : "hover:translate-x-1"
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                                            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                                                {link.label}
                                            </span>
                                        </div>
                                        {isActive && <div className="w-1 h-1 bg-primary rounded-full" />}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-2 pt-6">
                        <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-muted-foreground ml-2">Settings</span>
                        <Link
                            href="/admin/settings"
                            className="flex items-center gap-4 px-4 py-4 text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all group"
                        >
                            <Settings className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Configuration</span>
                        </Link>
                    </div>
                </nav>

                <div className="p-8 border-t border-zinc-100 dark:border-zinc-800/50 mt-auto">
                    <button
                        onClick={logout}
                        className="flex items-center justify-between w-full group py-4 px-4 border border-zinc-100 dark:border-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-300"
                    >
                        <div className="flex items-center gap-4">
                            <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-red-500" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground group-hover:text-red-500">Sign Out</span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                </div>
            </aside>
        </div>
    );
}
