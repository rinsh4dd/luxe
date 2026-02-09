"use client";

import Link from "next/link";
import { ShoppingBag, User, Menu, X, Heart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { cart } = useCart();
    const { wishlist } = useWishlist();
    const { user, userData, logout } = useAuth();

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const wishlistCount = wishlist.length;

    const getInitials = (userObj: any, data: any) => {
        const name = data?.name || userObj?.email?.split('@')[0] || "U";
        return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // Completely hide Navbar for admins - and handle potential role issues
    if (user && (user as any).role === 'admin') {
        return null;
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300">
            <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">

                {/* Mobile Menu Button - Left */}
                <button
                    className="md:hidden p-2 -ml-2 text-foreground"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                <div className="flex-1 md:flex-initial flex justify-center md:justify-start">
                    <Link href="/" className="group flex flex-col items-center md:items-start">
                        <span className="text-2xl font-serif font-bold tracking-[0.4em] text-foreground leading-none transition-all duration-500 group-hover:tracking-[0.5em]">
                            LUXE<span className="text-primary text-xl">.</span>
                        </span>
                        <span className="text-[6px] font-bold uppercase tracking-[0.6em] text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-y-1 group-hover:translate-y-0">
                            Est. 2024
                        </span>
                    </Link>
                </div>

                {/* Desktop Nav - Centered */}
                <div className="hidden md:flex items-center space-x-10">
                    <Link href="/shop" className="text-[10px] font-bold uppercase tracking-[0.3em] hover:text-primary transition-colors">
                        Shop
                    </Link>
                    <Link href="/collections" className="text-[10px] font-bold uppercase tracking-[0.3em] hover:text-primary transition-colors">
                        Collections
                    </Link>
                    {user && (
                        <Link href="/profile?tab=orders" className="text-[10px] font-bold uppercase tracking-[0.3em] hover:text-primary transition-colors">
                            Orders
                        </Link>
                    )}
                    <Link href="/about" className="text-[10px] font-bold uppercase tracking-[0.3em] hover:text-primary transition-colors">
                        About
                    </Link>
                </div>

                {/* Icons - Right */}
                <div className="flex items-center space-x-2 md:space-x-4">

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Wishlist Link */}
                    <Link href="/wishlist" className="p-2.5 hover:bg-muted relative text-foreground transition-all">
                        <Heart className="w-[18px] h-[18px]" />
                        {wishlistCount > 0 && (
                            <span className="absolute top-1 right-1 min-w-[14px] h-[14px] bg-foreground text-background text-[8px] flex items-center justify-center rounded-none px-1 font-bold">
                                {wishlistCount}
                            </span>
                        )}
                    </Link>

                    {/* Cart Link */}
                    <Link href="/cart" className="p-2.5 hover:bg-muted relative text-foreground transition-all">
                        <ShoppingBag className="w-[18px] h-[18px]" />
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-1 min-w-[14px] h-[14px] bg-foreground text-background text-[8px] flex items-center justify-center rounded-none px-1 font-bold">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* User Section */}
                    {user ? (
                        <div className="flex items-center">
                            <Link href="/profile" className="flex items-center gap-3 md:pl-4 md:border-l border-border hover:opacity-80 transition-all group">
                                <div className="w-10 h-10 flex items-center justify-center bg-foreground text-background font-bold text-xs rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all">
                                    {getInitials(user, userData)}
                                </div>
                                <div className="hidden lg:flex flex-col">
                                    <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">My Account</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider max-w-[80px] truncate">
                                        {(userData?.name || user.email?.split('@')[0])?.split(' ')[0]}
                                    </span>
                                </div>
                            </Link>
                        </div>
                    ) : (
                        <Link href="/login" className="p-2.5 hover:bg-muted text-foreground transition-all">
                            <User className="w-[18px] h-[18px]" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="md:hidden absolute top-20 left-0 right-0 h-screen bg-background p-8 flex flex-col space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="space-y-1">
                        <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-muted-foreground">Directory</span>
                        <div className="flex flex-col space-y-4">
                            <Link href="/shop" className="text-3xl font-serif font-medium tracking-tight" onClick={() => setIsOpen(false)}>
                                Shop
                            </Link>
                            <Link href="/collections" className="text-3xl font-serif font-medium tracking-tight" onClick={() => setIsOpen(false)}>
                                Collections
                            </Link>
                            <Link href="/about" className="text-3xl font-serif font-medium tracking-tight" onClick={() => setIsOpen(false)}>
                                About
                            </Link>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-border">
                        <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-muted-foreground">Account</span>
                        <div className="mt-4 flex flex-col space-y-4">
                            {user ? (
                                <Link href="/profile?tab=orders" className="text-xl font-medium" onClick={() => setIsOpen(false)}>My Orders</Link>
                            ) : (
                                <Link href="/login" className="text-xl font-medium" onClick={() => setIsOpen(false)}>Sign In</Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
