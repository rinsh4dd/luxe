
"use client";

import Link from "next/link";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { cart } = useCart();
    const { user, logout } = useAuth();
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Completely hide Navbar for admins
    if (user && (user as any).role === 'admin') {
        return null;
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold tracking-tighter">
                    LUXE.
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link href="/shop" className="text-sm font-medium hover:text-gray-600 transition-colors">
                        Shop
                    </Link>
                    <Link href="/collections" className="text-sm font-medium hover:text-gray-600 transition-colors">
                        Collections
                    </Link>
                    <Link href="/about" className="text-sm font-medium hover:text-gray-600 transition-colors">
                        About
                    </Link>
                </div>

                {/* Icons */}
                <div className="flex items-center space-x-4">
                    {/* Search button */}
                    <button className="p-2 hover:bg-muted rounded-full transition-colors text-foreground">
                        <Search className="w-5 h-5" />
                    </button>

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Cart Link */}
                    <Link href="/cart" className="p-2 hover:bg-muted rounded-full transition-colors relative text-foreground">
                        <ShoppingBag className="w-5 h-5" />
                        {itemCount > 0 && (
                            <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center rounded-full font-bold">
                                {itemCount}
                            </span>
                        )}
                    </Link>

                    {/* User Section */}
                    {user ? (
                        <div className="hidden md:flex items-center space-x-2">
                            {(user as any).role === 'admin' && (
                                <Link
                                    href="/admin"
                                    className="text-sm font-medium mr-4 px-3 py-1 bg-primary/20 text-primary rounded-full hover:bg-primary/30 transition-colors"
                                >
                                    Admin Dashboard
                                </Link>
                            )}
                            <Link href="/orders" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <User className="w-4 h-4" />
                                </div>
                                <span className="max-w-[100px] truncate pr-4">{user.email?.split('@')[0]}</span>
                                <Button
                                    onClick={logout}
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground hover:text-red-500"
                                >
                                    Logout
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Link href="/login" className="p-2 hover:bg-muted rounded-full transition-colors hidden md:block text-foreground">
                            <User className="w-5 h-5" />
                        </Link>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 hover:bg-muted rounded-full transition-colors text-foreground"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-100 p-4 flex flex-col space-y-4">
                    <Link href="/shop" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                        Shop
                    </Link>
                    <Link href="/collections" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                        Collections
                    </Link>
                    <Link href="/about" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                        About
                    </Link>
                    <Link href="/login" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                        Login
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
