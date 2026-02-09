"use client";

import { useState, useEffect } from "react";
import { Users, Search, MoreHorizontal, ShieldOff, ShieldCheck, Mail, Calendar, Loader2, UserX } from "lucide-react";
import { useLuxeToast } from "@/hooks/useLuxeToast";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { promise } = useLuxeToast();

    const fetchUsers = async () => {
        try {
            const { getFirestore, collection, getDocs, orderBy, query } = await import("firebase/firestore/lite");
            const { app } = await import("@/lib/firebase");
            const db = getFirestore(app);

            const usersQuery = query(collection(db, "users"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(usersQuery);
            const usersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersData);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useGSAP(() => {
        if (!loading) {
            gsap.fromTo(".user-card",
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" }
            );
        }
    }, [loading]);

    const handleToggleBlock = async (userId: string, isBlocked: boolean) => {
        const togglePromise = async () => {
            const { getFirestore, doc, updateDoc } = await import("firebase/firestore/lite");
            const { app } = await import("@/lib/firebase");
            const db = getFirestore(app);

            await updateDoc(doc(db, "users", userId), { isBlocked: !isBlocked });
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBlocked: !isBlocked } : u));
        };

        promise(togglePromise(), {
            loading: isBlocked ? "Unblocking access..." : "Revoking access...",
            success: isBlocked ? "User unblocked successfully." : "User revoked successfully.",
            error: "Security protocol failure."
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-16 pb-24">
            <div className="space-y-2 border-b border-zinc-100 dark:border-zinc-800 pb-12">
                <h2 className="text-6xl font-serif font-medium tracking-tighter text-foreground leading-none">Client Base</h2>
                <p className="text-[10px] text-muted-foreground tracking-[0.5em] uppercase font-bold">User Identity Governance</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {users.length === 0 ? (
                    <div className="py-32 flex flex-col items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 text-muted-foreground">
                        <Users className="w-12 h-12 opacity-5 mb-6" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-30">Zero Registered Entities</p>
                    </div>
                ) : (
                    users.map((client) => (
                        <div
                            key={client.id}
                            className="user-card group bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 p-8 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-500"
                        >
                            <div className="flex items-center gap-6 flex-1">
                                <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center font-serif text-2xl font-bold text-muted-foreground group-hover:scale-110 transition-transform">
                                    {client.name?.charAt(0) || client.email?.charAt(0) || "U"}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl font-serif font-bold tracking-tight">{client.name || "Anonymous Client"}</span>
                                        {client.role === 'admin' && (
                                            <span className="text-[7px] font-bold uppercase tracking-widest text-primary border border-primary/20 px-2 py-0.5">Administrator</span>
                                        )}
                                        {client.isBlocked && (
                                            <span className="text-[7px] font-bold uppercase tracking-widest text-red-500 border border-red-500/20 px-2 py-0.5">Revoked</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-3 h-3" />
                                            <span className="text-[9px] font-bold uppercase tracking-widest">{client.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            <span className="text-[9px] font-bold uppercase tracking-widest">{client.createdAt ? new Date(client.createdAt).toLocaleDateString() : 'Historical'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {client.role !== 'admin' && (
                                    <button
                                        onClick={() => handleToggleBlock(client.id, client.isBlocked)}
                                        className={`h-12 px-8 text-[9px] font-bold uppercase tracking-[0.2em] border transition-all flex items-center gap-3 ${client.isBlocked
                                            ? "border-green-500/20 text-green-500 hover:bg-green-500 hover:text-white"
                                            : "border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white"
                                            }`}
                                    >
                                        {client.isBlocked ? (
                                            <><ShieldCheck className="w-4 h-4" /> Grand Access</>
                                        ) : (
                                            <><ShieldOff className="w-4 h-4" /> Revoke Access</>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
