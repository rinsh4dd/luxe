"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NextImage from "next/image";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { useLuxeToast } from "@/hooks/useLuxeToast";

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
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { promise } = useLuxeToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const loginPromise = async () => {
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

            return user.displayName || "User";
        };

        promise(loginPromise(), {
            loading: 'Authenticating...',
            success: (name) => `Welcome back.`,
            error: (err: any) => {
                console.error("Login Error", err);
                return "Invalid credentials.";
            },
        });
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Editorial Image (Hidden on Mobile) */}
            <div className="hidden lg:block w-1/2 relative bg-black">
                <NextImage
                    src="https://images.unsplash.com/photo-1507086189048-b9a73d10c852?q=80&w=2670&auto=format&fit=crop" // Elegant suit/fashion image
                    alt="Editorial Fashion"
                    fill
                    className="object-cover opacity-80"
                    priority
                    sizes="50vw"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-12 left-12 text-white p-8">
                    <p className="text-sm tracking-[0.3em] uppercase mb-4 opacity-80">Collection 2024</p>
                    <h2 className="text-5xl font-serif italic">"Elegance is the only beauty that never fades."</h2>
                </div>
            </div>

            {/* Right Side - Minimalist Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-8 md:px-16 lg:px-24">
                <div className="max-w-md w-full space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-serif font-medium tracking-tight text-foreground">Welcome Back</h2>
                        <p className="text-sm text-muted-foreground tracking-wide uppercase">Please enter your details</p>
                    </div>

                    <form className="space-y-8" onSubmit={handleLogin}>
                        <div className="space-y-6">
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

                        <div className="flex items-center justify-between text-xs">
                            <label className="flex items-center space-x-2 cursor-pointer group">
                                <input type="checkbox" className="w-3 h-3 rounded-sm border-border text-primary focus:ring-0 bg-transparent" />
                                <span className="text-muted-foreground group-hover:text-foreground transition-colors tracking-wide">Remember me</span>
                            </label>
                            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors tracking-wide border-b border-transparent hover:border-foreground">
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            className="w-full rounded-none bg-foreground text-background hover:bg-foreground/90 h-12 text-xs uppercase tracking-[0.2em] font-bold transition-all"
                        >
                            Sign In
                        </Button>

                        <div className="text-center pt-4">
                            <Link href="/register" className="text-xs text-muted-foreground hover:text-foreground transition-colors tracking-wide">
                                NEW TO LUXE? <span className="underline underline-offset-4 decoration-1">CREATE AN ACCOUNT</span>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
