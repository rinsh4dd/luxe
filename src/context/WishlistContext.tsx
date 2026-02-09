"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useAuth } from "./AuthContext";
import { db } from "@/lib/firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

export interface WishlistItem {
    productId: string;
    name: string;
    price: number;
    image: string;
}

interface WishlistContextType {
    wishlist: WishlistItem[];
    addToWishlist: (item: WishlistItem) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const isInitialLoad = useRef(true);
    const serverSyncInProgress = useRef(false);

    // 1. Initial Load: LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem("wishlist");
        if (saved) {
            setWishlist(JSON.parse(saved));
        }
        setLoading(false);
        isInitialLoad.current = false;
    }, []);

    // 2. Fetch from Firestore on Login & Listen
    useEffect(() => {
        if (!user) {
            setWishlist([]);
            localStorage.removeItem("wishlist");
            return;
        }

        const wishlistDocRef = doc(db, "wishlists", user.uid);
        const unsubscribe = onSnapshot(wishlistDocRef, (docSnap) => {
            if (docSnap.exists() && !serverSyncInProgress.current) {
                const data = docSnap.data();
                if (data.items) {
                    setWishlist(data.items);
                    localStorage.setItem("wishlist", JSON.stringify(data.items));
                }
            }
        });

        return () => unsubscribe();
    }, [user]);

    // 3. Save to LocalStorage & Sync to Firestore
    useEffect(() => {
        if (isInitialLoad.current) return;

        localStorage.setItem("wishlist", JSON.stringify(wishlist));

        const syncToFirestore = async () => {
            if (user) {
                serverSyncInProgress.current = true;
                try {
                    const wishlistDocRef = doc(db, "wishlists", user.uid);
                    await setDoc(wishlistDocRef, {
                        items: wishlist,
                        userId: user.uid,
                        updatedAt: new Date().toISOString()
                    }, { merge: true });
                } catch (error) {
                    console.error("Firestore Wishlist Sync Error:", error);
                } finally {
                    serverSyncInProgress.current = false;
                }
            }
        };

        const timeoutId = setTimeout(syncToFirestore, 1000);
        return () => clearTimeout(timeoutId);
    }, [wishlist, user]);

    const addToWishlist = (item: WishlistItem) => {
        setWishlist((prev) => {
            if (prev.some((i) => i.productId === item.productId)) return prev;
            return [...prev, item];
        });
    };

    const removeFromWishlist = (productId: string) => {
        setWishlist((prev) => prev.filter((item) => item.productId !== productId));
    };

    const isInWishlist = (productId: string) => {
        return wishlist.some((item) => item.productId === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, loading }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};
