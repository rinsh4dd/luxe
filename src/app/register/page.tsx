"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NextImage from "next/image";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { useLuxeToast } from "@/hooks/useLuxeToast";

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
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { promise } = useLuxeToast();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const registerPromise = async () => {
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

            // Short delay to let the toast show
            setTimeout(() => {
                router.push('/shop');
            }, 1000);

            return name;
        };

        promise(registerPromise(), {
            loading: 'Creating your account...',
            success: (name) => `Welcome to Luxe, ${name}!`,
            error: (err: any) => `Registration failed: ${err.message}`,
        });
    };

    return (
        <div className="min-h-screen flex flex-row-reverse">
            {/* Right Side - Editorial Image (Hidden on Mobile) */}
            <div className="hidden lg:block w-1/2 relative bg-black">
                <NextImage
                    src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2670&auto=format&fit=crop" // Elegant fashion image
                    alt="Editorial Fashion"
                    fill
                    className="object-cover opacity-80"
                    priority
                    sizes="50vw"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-12 right-12 text-white p-8 text-right">
                    <p className="text-sm tracking-[0.3em] uppercase mb-4 opacity-80">The New Standard</p>
                    <h2 className="text-5xl font-serif italic">"Style is a way to say who you are without having to speak."</h2>
                </div>
            </div>

            {/* Left Side - Minimalist Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-8 md:px-16 lg:px-24">
                <div className="max-w-md w-full space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-serif font-medium tracking-tight text-foreground">Create Account</h2>
                        <p className="text-sm text-muted-foreground tracking-wide uppercase">Join the exclusive community</p>
                    </div>

                    <form className="space-y-8" onSubmit={handleRegister}>
                        <div className="space-y-6">
                            <div className="group">
                                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-transparent border-b border-border py-2 outline-none focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground/30"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="group">
                                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-transparent border-b border-border py-2 outline-none focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground/30"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="group relative">
                                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full bg-transparent border-b border-border py-2 outline-none focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground/30 pr-10"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 bottom-2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full rounded-none bg-foreground text-background hover:bg-foreground/90 h-12 text-xs uppercase tracking-[0.2em] font-bold transition-all"
                        >
                            Sign Up
                        </Button>

                        <div className="text-center pt-4">
                            <Link href="/login" className="text-xs text-muted-foreground hover:text-foreground transition-colors tracking-wide">
                                ALREADY HAVE AN ACCOUNT? <span className="underline underline-offset-4 decoration-1">SIGN IN</span>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
