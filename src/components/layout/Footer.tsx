import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, CreditCard, ArrowRight } from "lucide-react";

const Footer = () => {
    return (
        <footer className="relative bg-background text-foreground pt-32 pb-12 border-t border-border overflow-hidden">
            {/* Decorative Background Text */}
            <div className="absolute -bottom-20 -left-10 text-[25vw] font-serif font-bold text-muted/5 select-none pointer-events-none tracking-tighter">
                LUXE
            </div>

            <div className="container mx-auto px-4 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-24 mb-24">
                    {/* Brand Section */}
                    <div className="md:col-span-12 lg:col-span-5 space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-serif font-bold tracking-[0.3em]">LUXE<span className="text-primary">.</span></h2>
                            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-[0.2em] leading-loose max-w-sm">
                                Curating a lifestyle of silent luxury and intentional design.
                                We believe in the power of essentials to elevate the everyday.
                            </p>
                        </div>

                        <div className="flex gap-8 items-center border-l border-border pl-6">
                            <Link href="#" className="opacity-40 hover:opacity-100 transition-all duration-500">
                                <Instagram className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="opacity-40 hover:opacity-100 transition-all duration-500">
                                <Facebook className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="opacity-40 hover:opacity-100 transition-all duration-500">
                                <Twitter className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="md:col-span-12 lg:col-span-3 grid grid-cols-2 gap-8">
                        <div className="space-y-8">
                            <h4 className="text-[8px] font-bold uppercase tracking-[0.4em] text-muted-foreground">Selection</h4>
                            <ul className="space-y-5 text-[10px] font-bold uppercase tracking-widest">
                                <li><Link href="/shop" className="hover:text-primary transition-all duration-300 inline-block">The Shop</Link></li>
                                <li><Link href="/collections" className="hover:text-primary transition-all duration-300 inline-block">Collections</Link></li>
                                <li><Link href="/shop/new" className="hover:text-primary transition-all duration-300 inline-block">Latest</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-8">
                            <h4 className="text-[8px] font-bold uppercase tracking-[0.4em] text-muted-foreground">Company</h4>
                            <ul className="space-y-5 text-[10px] font-bold uppercase tracking-widest">
                                <li><Link href="/about" className="hover:text-primary transition-all duration-300 inline-block">Our Story</Link></li>
                                <li><Link href="/contact" className="hover:text-primary transition-all duration-300 inline-block">Contact</Link></li>
                                <li><Link href="/terms" className="hover:text-primary transition-all duration-300 inline-block">Privacy</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Newsletter - Minimalist version */}
                    <div className="md:col-span-12 lg:col-span-4 space-y-8">
                        <div className="space-y-2">
                            <h4 className="text-[8px] font-bold uppercase tracking-[0.4em] text-muted-foreground">Newsletter</h4>
                            <p className="text-[10px] uppercase font-bold tracking-widest">Access the inner circle</p>
                        </div>

                        <form className="relative group max-w-xs">
                            <input
                                type="email"
                                placeholder="YOUR@EMAIL.COM"
                                className="w-full bg-transparent border-b border-border/60 py-4 text-[10px] tracking-widest font-bold focus:outline-none focus:border-primary transition-all duration-700 placeholder:text-muted/40 uppercase"
                            />
                            <button className="absolute right-0 bottom-4 opacity-40 hover:opacity-100 transition-all">
                                <ArrowRight className="w-4 h-4 transition-transform group-focus-within:translate-x-1" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar - Ultra Clean */}
                <div className="border-t border-border/50 pt-10 flex flex-col md:flex-row justify-between items-center text-[8px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60 gap-8">
                    <div className="flex gap-12">
                        <p>© 2024 LUXE INC.</p>
                        <p>India / Global</p>
                    </div>

                    <div className="flex items-center gap-10">
                        <div className="flex gap-4 opacity-30">
                            <CreditCard className="w-3 h-3" />
                            <span>Secured Payment Gateway</span>
                        </div>
                        <span className="text-foreground/40">Made with Intention</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
