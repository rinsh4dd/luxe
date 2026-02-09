"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

import GuestGuard from "@/components/auth/GuestGuard";

export default function LoginPage() {
    return (
        <GuestGuard>
            <LoginPageContent />
        </GuestGuard>
    );
}

function LoginPageContent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch user role from Firestore Lite
            try {
                const { getFirestore, doc, getDoc } = await import("firebase/firestore/lite");
                const { app } = await import("@/lib/firebase");
                const db = getFirestore(app);
                const userDoc = await getDoc(doc(db, "users", user.uid));

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    if (userData.role === 'admin') {
                        router.push('/admin');
                    } else {
                        router.push('/shop');
                    }
                } else {
                    router.push('/shop'); // Default if no doc
                }
            } catch (e) {
                console.error("Error checking role:", e);
                router.push('/shop'); // Fallback
            }

            // Clear form
            setEmail("");
            setPassword("");
        } catch (error: any) {
            console.error("Login failed:", error);
            setError("Failed to login. Please check your credentials.");
            alert("Login failed: " + error.message);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-xl shadow-lg border border-border">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-foreground">Welcome Back</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Sign in to your account</p>
                </div>

                {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <input
                                type="email"
                                required
                                className="appearance-none rounded-full relative block w-full px-4 py-3 border border-border bg-background placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className="appearance-none rounded-full relative block w-full px-4 py-3 border border-border bg-background placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full rounded-full bg-primary hover:bg-primary/90 text-black font-bold">
                        Sign In
                    </Button>

                    <div className="text-sm text-center">
                        <Link href="/register" className="font-medium text-muted-foreground hover:text-primary transition-colors">
                            Don't have an account? Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
