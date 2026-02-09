import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-black text-white py-12 md:py-16 border-t border-gray-900">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-2xl font-bold tracking-tighter mb-4 text-primary">LUXE.</h3>
                        <p className="text-gray-400 text-sm">
                            Premium essentials for the modern lifestyle. Quality, comfort, and style in every stitch.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-white">Shop</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/shop/new-arrivals" className="hover:text-primary transition-colors">New Arrivals</Link></li>
                            <li><Link href="/shop/men" className="hover:text-primary transition-colors">Men</Link></li>
                            <li><Link href="/shop/women" className="hover:text-primary transition-colors">Women</Link></li>
                            <li><Link href="/shop/accessories" className="hover:text-primary transition-colors">Accessories</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-white">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                            <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-white">Stay in the loop</h4>
                        <p className="text-gray-400 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-gray-900 border border-gray-800 rounded-l-full px-4 py-2 text-sm w-full focus:outline-none focus:border-primary transition-colors text-white"
                            />
                            <button className="bg-primary text-black px-4 py-2 rounded-r-full text-sm font-bold hover:bg-primary/90 transition-colors">
                                Join
                            </button>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>© 2024 LUXE. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
