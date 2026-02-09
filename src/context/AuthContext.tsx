"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const logout = async () => {
        // Set isLoggedIn to false on logout
        if (user) {
            try {
                const { getFirestore, doc, updateDoc } = await import("firebase/firestore/lite");
                const { app } = await import("@/lib/firebase");
                const db = getFirestore(app);
                await updateDoc(doc(db, "users", user.uid), { isLoggedIn: false });
            } catch (e) {
                console.error("Error updating logout status", e);
            }
        }
        await auth.signOut();
        setUser(null);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Fetch user data from Firestore Lite
                try {
                    const { getFirestore, doc, getDoc, updateDoc } = await import("firebase/firestore/lite");
                    const { app } = await import("@/lib/firebase");
                    const db = getFirestore(app);
                    const userDocRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();

                        // Check if blocked
                        if (userData.isBlocked) {
                            await auth.signOut();
                            setUser(null);
                            alert("Your account has been blocked. Please contact support.");
                            setLoading(false);
                            return;
                        }

                        // Attach role
                        (user as any).role = userData.role || "user";

                        // Update isLoggedIn status (Best effort, since Lite doesn't support offline persistence as well)
                        // Note: updateDoc might fail in Lite if rules are strict, but we enabled them.
                        await updateDoc(userDocRef, { isLoggedIn: true });
                    }
                } catch (e) {
                    console.error("Error fetching/updating user data", e);
                }
            }
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);



    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
