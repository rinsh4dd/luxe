"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc as firestoreDoc } from "firebase/firestore";
import { Button } from "@/components/ui/Button";
import { useLuxeToast } from "@/hooks/useLuxeToast";
import { Package, User, Shield, Key, ChevronRight, LogOut, Loader2, MapPin, Plus, Trash2, Home, Building2, Briefcase, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const TABS = [
    { id: 'overview', label: 'Overview', icon: User, description: 'Personal details & information' },
    { id: 'addresses', label: 'Addresses', icon: MapPin, description: 'Manage delivery locations' },
    { id: 'security', label: 'Security', icon: Shield, description: 'Password & safety' },
    { id: 'orders', label: 'Orders', icon: Package, description: 'View your recent purchases' },
];

const INDIAN_STATES = [
    "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
    "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

function ProfileContent() {
    const { user, userData, logout, updateProfileData } = useAuth();
    const { success, error, info } = useLuxeToast();
    const searchParams = useSearchParams();

    const [activeTab, setActiveTab] = useState('overview');
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && TABS.find(t => t.id === tab)) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const [newName, setNewName] = useState(userData?.name || "");
    const [isUpdatingName, setIsUpdatingName] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    const [addresses, setAddresses] = useState<any[]>([]);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [addressForm, setAddressForm] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "Maharashtra",
        postalCode: "",
        label: "Home"
    });

    // GSAP Animation for Tab Switching
    useGSAP(() => {
        if (contentRef.current) {
            gsap.fromTo(
                contentRef.current,
                { opacity: 0, y: 20, filter: "blur(10px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "expo.out" }
            );
        }
    }, { dependencies: [activeTab] });

    useEffect(() => {
        if (!user) return;

        const fetchRecentOrders = async () => {
            try {
                const ordersRef = collection(db, "orders");
                const q = query(
                    ordersRef,
                    where("userId", "==", user.uid)
                );
                const querySnapshot = await getDocs(q);
                const ordersData = querySnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() } as any))
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setOrders(ordersData);
            } catch (err) {
                console.error("Error fetching orders:", err);
            } finally {
                setLoadingOrders(false);
            }
        };

        const fetchAddresses = async () => {
            try {
                const addressesRef = collection(db, "addresses");
                const q = query(addressesRef, where("userId", "==", user.uid));
                const querySnapshot = await getDocs(q);
                const addrData = querySnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() } as any))
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setAddresses(addrData);
            } catch (err) {
                console.error("Error fetching addresses:", err);
            } finally {
                setLoadingAddresses(false);
            }
        };

        fetchRecentOrders();
        fetchAddresses();
    }, [user]);

    const handleUpdateName = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || newName === userData?.name) return;

        setIsUpdatingName(true);
        try {
            await updateProfileData({ name: newName });
            success("Name Updated", "Your profile name has been saved.");
        } catch (err) {
            // Error handled in context
        } finally {
            setIsUpdatingName(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPassword || !newPassword) {
            error("Missing Fields", "Please fill in all password fields.");
            return;
        }

        if (newPassword.length < 6) {
            error("Weak Password", "New password must be at least 6 characters.");
            return;
        }

        setIsUpdatingPassword(true);
        try {
            const userObj = auth.currentUser;
            if (!userObj || !userObj.email) throw new Error("No user found");

            const credential = EmailAuthProvider.credential(userObj.email, currentPassword);
            await reauthenticateWithCredential(userObj, credential);
            await updatePassword(userObj, newPassword);

            setCurrentPassword("");
            setNewPassword("");
            success("Password Updated", "Your security credentials have been refreshed.");
        } catch (err) {
            console.error("Error updating password:", err);
            error("Update Failed", "Current password may be incorrect.");
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsAddingAddress(true);
        try {
            const addressesRef = collection(db, "addresses");
            const newAddr = {
                ...addressForm,
                userId: user.uid,
                createdAt: new Date().toISOString()
            };
            const docRef = await addDoc(addressesRef, newAddr);
            setAddresses([{ id: docRef.id, ...newAddr }, ...addresses]);
            setAddressForm({
                fullName: "",
                phone: "",
                address: "",
                city: "",
                state: "Maharashtra",
                postalCode: "",
                label: "Home"
            });
            success("Address Saved", "Successfully added to your address book.");
        } catch (err) {
            console.error("Error adding address:", err);
            error("Failed to add address", "Please try again.");
        } finally {
            setIsAddingAddress(false);
        }
    };

    const handleDeleteAddress = async (id: string) => {
        try {
            await deleteDoc(firestoreDoc(db, "addresses", id));
            setAddresses(addresses.filter(a => a.id !== id));
            info("Address Removed", "Address deleted successfully.");
        } catch (err) {
            console.error("Error deleting address:", err);
            error("Delete Failed", "Could not remove the address.");
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-12">
                        <div className="flex flex-col md:flex-row items-center gap-8 p-10 bg-muted/20 border border-border/50">
                            <div className="w-32 h-32 rounded-full bg-foreground text-background flex items-center justify-center text-5xl font-bold font-serif shadow-2xl">
                                {(userData?.name || user?.email?.split('@')[0] || "U")[0].toUpperCase()}
                            </div>
                            <div className="space-y-2 text-center md:text-left">
                                <h2 className="text-3xl font-serif font-medium tracking-tight">{userData?.name || "Member"}</h2>
                                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold">{user?.email}</p>
                                <p className="text-[10px] text-muted-foreground font-medium uppercase mt-2">Member Since 2024</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="p-8 border border-border space-y-8 h-full bg-background relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <User className="w-32 h-32" />
                                </div>
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] flex items-center gap-2">
                                    <User className="w-3 h-3 text-primary" />
                                    Your Profile
                                </h3>
                                <form onSubmit={handleUpdateName} className="space-y-6 relative z-10">
                                    <div className="space-y-2">
                                        <label className="text-[8px] uppercase font-bold tracking-[0.3em] text-muted-foreground">Full Name</label>
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="w-full bg-transparent border-b border-border py-4 focus:border-primary outline-none transition-all text-sm font-bold tracking-tight"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isUpdatingName || newName === userData?.name}
                                        className="w-full rounded-none h-14 text-[10px] uppercase font-bold tracking-[0.3em] bg-foreground text-background hover:bg-foreground/90 transition-all"
                                    >
                                        {isUpdatingName ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                                    </Button>
                                </form>
                            </div>

                            <div className="p-8 border border-border bg-muted/5 flex flex-col justify-between">
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.4em]">Account Summary</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 border border-border/50 bg-background space-y-1">
                                            <p className="text-[8px] text-muted-foreground uppercase font-bold">Total Orders</p>
                                            <p className="text-xl font-serif font-bold">{orders.length}</p>
                                        </div>
                                        <div className="p-4 border border-border/50 bg-background space-y-1">
                                            <p className="text-[8px] text-muted-foreground uppercase font-bold">Addresses</p>
                                            <p className="text-xl font-serif font-bold">{addresses.length}</p>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="mt-8 rounded-none border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all uppercase text-[8px] font-bold tracking-[0.3em] py-6"
                                    onClick={logout}
                                >
                                    <LogOut className="w-3 h-3 mr-3" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            case 'addresses':
                return (
                    <div className="space-y-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border pb-8 gap-4">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-serif font-medium tracking-tight">Saved Addresses</h3>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.3em]">Manage your shipping locations</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {addresses.length > 0 ? (
                                addresses.map((addr) => (
                                    <div key={addr.id} className="p-8 border border-border hover:border-primary/50 transition-all flex flex-col justify-between group bg-background relative shadow-sm hover:shadow-xl duration-500">
                                        <button
                                            onClick={() => handleDeleteAddress(addr.id)}
                                            className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-muted rounded-full">
                                                    {addr.label === "Home" && <Home className="w-3 h-3 text-primary" />}
                                                    {addr.label === "Work" && <Briefcase className="w-3 h-3 text-primary" />}
                                                    {(addr.label !== "Home" && addr.label !== "Work") && <Building2 className="w-3 h-3 text-primary" />}
                                                </div>
                                                <span className="text-[8px] font-bold uppercase tracking-[0.4em]">{addr.label}</span>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-lg font-bold tracking-tight">{addr.fullName}</p>
                                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{addr.phone}</p>
                                                <p className="text-xs text-muted-foreground leading-relaxed mt-4 uppercase tracking-[0.05em] font-medium border-l border-border pl-4">
                                                    {addr.address}<br />
                                                    {addr.city}, {addr.state} - {addr.postalCode}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : null}

                            <div className="p-8 border border-dashed border-border flex flex-col items-center justify-center space-y-6 opacity-80 group hover:opacity-100 transition-opacity bg-muted/5 min-h-[300px]">
                                <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                    <Plus className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Add New Address</p>
                                    <p className="text-[8px] text-muted-foreground uppercase font-medium tracking-widest">Add a new delivery location</p>
                                </div>
                                <form onSubmit={handleAddAddress} className="w-full space-y-4 pt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            required placeholder="FULL NAME"
                                            className="bg-transparent border-b border-border py-2 text-[10px] outline-none focus:border-primary transition-all font-bold tracking-widest uppercase"
                                            value={addressForm.fullName}
                                            onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                                        />
                                        <input
                                            required placeholder="PHONE"
                                            className="bg-transparent border-b border-border py-2 text-[10px] outline-none focus:border-primary transition-all font-bold tracking-widest uppercase"
                                            value={addressForm.phone}
                                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                        />
                                    </div>
                                    <input
                                        required placeholder="STREET ADDRESS"
                                        className="w-full bg-transparent border-b border-border py-2 text-[10px] outline-none focus:border-primary transition-all font-bold tracking-widest uppercase"
                                        value={addressForm.address}
                                        onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            required placeholder="CITY"
                                            className="bg-transparent border-b border-border py-2 text-[10px] outline-none focus:border-primary transition-all font-bold tracking-widest uppercase"
                                            value={addressForm.city}
                                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                        />
                                        <input
                                            required placeholder="PIN CODE"
                                            className="bg-transparent border-b border-border py-2 text-[10px] outline-none focus:border-primary transition-all font-bold tracking-widest uppercase"
                                            value={addressForm.postalCode}
                                            onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2 relative">
                                        <label className="text-[8px] uppercase font-bold tracking-[0.4em] text-muted-foreground">State</label>
                                        <select
                                            required
                                            className="w-full bg-transparent border-b border-border py-2 text-[10px] outline-none focus:border-primary transition-all font-bold tracking-widest appearance-none uppercase"
                                            value={addressForm.state}
                                            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                        >
                                            {INDIAN_STATES.map(state => (
                                                <option key={state} value={state} className="bg-background text-foreground">{state.toUpperCase()}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2 relative">
                                        <label className="text-[8px] uppercase font-bold tracking-[0.4em] text-muted-foreground">Label</label>
                                        <select
                                            className="w-full bg-transparent border-b border-border py-2 text-[10px] outline-none focus:border-primary transition-all font-bold tracking-widest appearance-none uppercase"
                                            value={addressForm.label}
                                            onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                                        >
                                            <option value="Home" className="bg-background text-foreground">HOME</option>
                                            <option value="Work" className="bg-background text-foreground">WORK</option>
                                            <option value="Other" className="bg-background text-foreground">OTHER</option>
                                        </select>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isAddingAddress}
                                        className="w-full rounded-none h-14 text-[9px] uppercase font-bold tracking-[0.4em] bg-foreground text-background mt-6"
                                    >
                                        {isAddingAddress ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Address"}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="max-w-xl mx-auto space-y-12 py-12">
                        <div className="space-y-4 text-center">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Shield className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-3xl font-serif font-medium tracking-tight text-center">Password & Security</h3>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.4em]">Update your account password</p>
                        </div>

                        <form onSubmit={handleUpdatePassword} className="space-y-10 p-12 border border-border bg-background shadow-2xl relative">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary/20"></div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[8px] uppercase font-bold tracking-[0.4em] text-muted-foreground">Current Password</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full bg-transparent border-b border-border py-4 focus:border-primary outline-none transition-all text-xs font-bold tracking-widest"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[8px] uppercase font-bold tracking-[0.4em] text-muted-foreground">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-transparent border-b border-border py-4 focus:border-primary outline-none transition-all text-xs font-bold tracking-widest"
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={isUpdatingPassword}
                                className="w-full rounded-none h-14 text-[10px] uppercase font-bold tracking-[0.4em] bg-foreground text-background hover:scale-[1.02] transition-transform"
                            >
                                {isUpdatingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
                            </Button>
                        </form>

                        <div className="p-6 bg-muted/20 border border-border/50 text-center">
                            <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest leading-loose">
                                Security is our priority. Your password must be at least 6 characters <br />
                                and contains mixed complexity for maximum protection.
                            </p>
                        </div>
                    </div>
                );
            case 'orders':
                return (
                    <div className="space-y-12">
                        <div className="flex items-center justify-between border-b border-border pb-8">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-serif font-medium tracking-tight">Order History</h3>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.3em]">View your past purchases</p>
                            </div>
                            <Link href="/shop" className="text-[8px] font-bold uppercase tracking-[0.3em] hover:text-primary transition-all flex items-center gap-2 border border-border px-6 py-3">
                                Go Shopping
                                <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>

                        {loadingOrders ? (
                            <div className="py-24 flex justify-center">
                                <Loader2 className="w-12 h-12 animate-spin text-border" />
                            </div>
                        ) : orders.length > 0 ? (
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <div key={order.id} className="p-10 border border-border hover:border-primary/20 transition-all flex flex-col md:flex-row items-start md:items-center justify-between group bg-background gap-8">
                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground">Order ID: #{order.id.slice(-8)}</p>
                                                <p className="text-2xl font-serif font-medium tracking-tight">₹{order.totalAmount || order.total}</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <span className="text-[8px] font-bold uppercase tracking-[0.3em] bg-muted px-4 py-2">{order.items?.length || 0} Items</span>
                                                <span className="text-[8px] font-bold uppercase tracking-[0.3em] border border-border px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-6 w-full md:w-auto">
                                            <span className="px-6 py-2 bg-foreground text-background text-[10px] font-bold uppercase tracking-[0.4em]">{order.status || 'Processing'}</span>
                                            <Link href={`/orders/${order.id}`} className="text-[8px] font-bold uppercase tracking-[0.4em] underline underline-offset-8 decoration-border/50 hover:decoration-primary transition-all">
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 border border-dashed border-border text-center space-y-6 bg-muted/5">
                                <Package className="w-12 h-12 text-muted-foreground mx-auto opacity-20" />
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.4em]">No orders yet</p>
                                    <p className="text-[8px] text-muted-foreground uppercase font-medium tracking-widest">Start your shopping journey</p>
                                </div>
                                <Link href="/shop" className="inline-block px-12 py-4 border border-foreground text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-all">
                                    Start Shopping
                                </Link>
                            </div>
                        )}
                    </div>
                );
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-background bg-[radial-gradient(circle_at_top_right,var(--color-muted-foreground)_0%,transparent_10%)] opacity-30 fixed inset-0 pointer-events-none" />
            <div className="relative pt-32 pb-32">
                <div className="container mx-auto px-4 lg:px-12 max-w-7xl">
                    {/* Header Area */}
                    <div className="mb-20 space-y-6 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-muted-foreground">
                                <Link href="/" className="text-[10px] font-bold uppercase tracking-[0.3em] hover:text-primary transition-colors">Home</Link>
                                <ChevronRight className="w-3 h-3" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground">Profile</span>
                            </div>
                            <h1 className="text-7xl font-serif font-medium tracking-tighter text-foreground leading-[0.8] drop-shadow-sm">My Profile<span className="text-primary">.</span></h1>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="text-right space-y-1 hidden md:block">
                                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground">Status</p>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 justify-end">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Account Verified
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Sidebar Navigation */}
                        <div className="lg:col-span-3 space-y-8">
                            <div className="flex flex-col gap-2">
                                {TABS.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`
                                                group flex items-center gap-4 px-6 py-5 border transition-all duration-500 relative overflow-hidden
                                                ${isActive ? 'border-foreground bg-foreground text-background' : 'border-border bg-background hover:border-foreground/50'}
                                            `}
                                        >
                                            <Icon className={`w-4 h-4 transition-transform duration-500 group-hover:scale-110 ${isActive ? 'text-background' : 'text-primary'}`} />
                                            <div className="text-left">
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em]">{tab.label}</p>
                                                <p className={`text-[8px] uppercase tracking-widest ${isActive ? 'text-background/60' : 'text-muted-foreground'}`}>{tab.description}</p>
                                            </div>
                                            {isActive && <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary" />}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="p-6 bg-muted/20 border border-border border-dashed space-y-4">
                                <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Security Status</p>
                                <div className="flex items-center gap-2">
                                    <Shield className="w-3 h-3 text-green-500" />
                                    <span className="text-[8px] font-bold uppercase tracking-widest">End-to-end Encrypted</span>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="lg:col-span-9" ref={contentRef}>
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        }>
            <ProfileContent />
        </Suspense>
    );
}
