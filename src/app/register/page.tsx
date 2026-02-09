"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

import GuestGuard from "@/components/auth/GuestGuard";

export default function RegisterPage() {
    return (
        <GuestGuard>
            <RegisterPageContent />
        </GuestGuard>
    );
}

function RegisterPageContent() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create user document in Firestore Lite
            const { getFirestore, doc, setDoc } = await import("firebase/firestore/lite");
            const { app } = await import("@/lib/firebase");
            const db = getFirestore(app);

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name: name,
                email: user.email,
                role: "user", // Default role
                isBlocked: false,
                isActive: true,
                isLoggedIn: true,
                createdAt: new Date().toISOString(),
            });

            // Clear form
            setName("");
            setEmail("");
            setPassword("");
            router.push('/shop');
        } catch (err: any) {
            console.error("Registration failed:", err);
            setError(err.message || "Failed to register.");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-xl shadow-lg border border-border">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-foreground">Create Account</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Join us for a premium experience</p>
                </div>

                {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <input
                                type="text"
                                required
                                className="appearance-none rounded-full relative block w-full px-4 py-3 border border-border bg-background placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
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
                        Sign Up
                    </Button>

                    <div className="text-sm text-center">
                        <Link href="/login" className="font-medium text-muted-foreground hover:text-primary transition-colors">
                            Already have an account? Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
