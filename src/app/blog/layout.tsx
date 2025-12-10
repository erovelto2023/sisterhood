import HomeNavbar from "@/components/layout/HomeNavbar";

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white">
            <HomeNavbar />
            <div className="pt-20">
                {children}
            </div>
            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">🔥</span>
                            <span className="text-lg font-bold text-white">Sisterhood of the Rising Phoenix</span>
                        </div>
                        <p className="max-w-xs text-sm">
                            A non-profit community dedicated to the empowerment, healing, and education of women everywhere.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/sign-in" className="hover:text-white transition-colors">Sign In</a></li>
                            <li><a href="/sign-up" className="hover:text-white transition-colors">Join Now</a></li>
                            <li><a href="/blog" className="hover:text-white transition-colors">The Phoenix Scrolls</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Connect</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-sm text-center">
                    &copy; {new Date().getFullYear()} Sisterhood of the Rising Phoenix. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
