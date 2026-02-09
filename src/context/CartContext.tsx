"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useAuth } from "./AuthContext";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";

export interface CartItem {
    id: string; // Product ID + Size
    productId: string;
    name: string;
    price: number;
    image: string;
    size: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
    subtotal: number;
    loading: boolean;
    isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const isInitialLoad = useRef(true);
    const serverSyncInProgress = useRef(false);

    // 1. Initial Load: LocalStorage
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
        setLoading(false);
        isInitialLoad.current = false;
    }, []);

    // 2. Fetch from Firestore on Login & Listen for changes
    useEffect(() => {
        if (!user) {
            // Clear cart on logout
            setCart([]);
            localStorage.removeItem("cart");
            return;
        }

        const cartDocRef = doc(db, "carts", user.uid);

        // Use onSnapshot for real-time sync across tabs/devices
        const unsubscribe = onSnapshot(cartDocRef, (docSnap) => {
            if (docSnap.exists() && !serverSyncInProgress.current) {
                const data = docSnap.data();
                if (data.items) {
                    setCart(data.items);
                    localStorage.setItem("cart", JSON.stringify(data.items));
                }
            }
        });

        return () => unsubscribe();
    }, [user]);

    // 3. Save to LocalStorage & Sync to Firestore on change
    useEffect(() => {
        if (isInitialLoad.current) return;

        localStorage.setItem("cart", JSON.stringify(cart));

        // Sync to Firestore if authenticated
        const syncToFirestore = async () => {
            if (user) {
                serverSyncInProgress.current = true;
                try {
                    const cartDocRef = doc(db, "carts", user.uid);
                    await setDoc(cartDocRef, {
                        items: cart,
                        userId: user.uid,
                        updatedAt: new Date().toISOString()
                    }, { merge: true });
                } catch (error) {
                    console.error("Firestore Cart Sync Error:", error);
                } finally {
                    serverSyncInProgress.current = false;
                }
            }
        };

        const timeoutId = setTimeout(syncToFirestore, 1000); // Debounce sync
        return () => clearTimeout(timeoutId);
    }, [cart, user]);

    const addToCart = (newItem: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => {
        setCart((prevCart) => {
            const itemId = `${newItem.productId}-${newItem.size}`;
            const existingItem = prevCart.find((item) => item.id === itemId);

            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === itemId
                        ? { ...item, quantity: Math.min(item.quantity + (newItem.quantity || 1), 15) }
                        : item
                );
            } else {
                return [...prevCart, { ...newItem, id: itemId, quantity: Math.min(newItem.quantity || 1, 15) }];
            }
        });
    };

    const removeFromCart = (id: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id ? { ...item, quantity: Math.min(Math.max(0, quantity), 15) } : item
            )
        );
    };

    const isInCart = (productId: string) => {
        return cart.some(item => item.productId === productId);
    };

    const clearCart = () => setCart([]);

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = subtotal;

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, subtotal, loading, isInCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
