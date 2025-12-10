import HomeNavbar from "@/components/layout/HomeNavbar";
import LatestBlogPosts from "@/components/layout/LatestBlogPosts";
import Link from "next/link";
import { FaFacebook, FaHeart, FaCalendarAlt, FaComments, FaArrowRight, FaBookOpen, FaLeaf, FaHandsHelping, FaBrain, FaGem, FaShieldAlt } from "react-icons/fa";

export default function Home() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            {/* Navigation */}
            <HomeNavbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/hero-phoenix.png"
                        alt="Rising Phoenix"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gray-900/70"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md text-purple-100 border border-purple-200/20 rounded-full text-sm font-semibold mb-6 tracking-wide uppercase">
                        Rise Stronger. Learn Deeper. Build Together.
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8 leading-tight drop-shadow-lg">
                        You were never meant to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
                            walk this journey alone.
                        </span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-200 mb-10 leading-relaxed drop-shadow-md">
                        The Sisterhood of the Rising Phoenix is a private, members-only sanctuary for women who are ready to heal, learn, and rise—without burnout, pressure, or comparison.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/sign-up"
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center border border-white/20"
                        >
                            Join the Sisterhood <FaArrowRight className="ml-2" />
                        </Link>
                        <Link
                            href="#about"
                            className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Pain Points / Empathy Section */}
            <section id="about" className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12">If You’ve Ever Felt…</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0 mt-1">✕</div>
                            <p className="text-lg text-gray-700">Disconnected from yourself and overwhelmed by "doing all the things."</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0 mt-1">✕</div>
                            <p className="text-lg text-gray-700">Hungry for real growth—not just surface-level inspiration.</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0 mt-1">✕</div>
                            <p className="text-lg text-gray-700">Tired of learning alone with no support system.</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0 mt-1">✕</div>
                            <p className="text-lg text-gray-700">Ready for a new chapter but unsure where to begin.</p>
                        </div>
                    </div>
                    <div className="mt-16 p-8 bg-purple-50 rounded-2xl border border-purple-100">
                        <p className="text-2xl font-serif italic text-purple-900">
                            "You are not broken. You are in a becoming season. And you are exactly where you need to be."
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Inside the Sisterhood</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            A living ecosystem for women’s transformation—designed to support your whole life.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 text-xl mb-6">
                                <FaComments />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Supportive Community</h3>
                            <p className="text-gray-600">
                                Safe discussion spaces, interest-based circles, and accountability pods. Encouragement, not judgment.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-xl mb-6">
                                <FaBookOpen />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Transformational Education</h3>
                            <p className="text-gray-600">
                                Guided courses and learning paths designed for integration. Learn at your own pace with practical tools.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 text-xl mb-6">
                                <FaLeaf />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Soul-Aligned Productivity</h3>
                            <p className="text-gray-600">
                                Integrated planners to set meaningful goals and build habits gently. Productivity for balance, not exhaustion.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 text-xl mb-6">
                                <FaBrain />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Intelligent Guidance</h3>
                            <p className="text-gray-600">
                                Built-in AI support to help break down goals, suggest learning paths, and provide clarity when stuck.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 text-xl mb-6">
                                <FaHandsHelping />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Sisterhood Marketplace</h3>
                            <p className="text-gray-600">
                                Offer skills, barter services, and collaborate. A safe space for women supporting women.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-xl mb-6">
                                <FaGem />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Celebrated Growth</h3>
                            <p className="text-gray-600">
                                Earn badges and certificates for your milestones. Every step forward is honored and celebrated.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Safe Space Section */}
            <section className="py-20 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-10 md:p-16 text-white text-center md:text-left flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-sm font-medium mb-6">
                                <FaShieldAlt /> A Sacred, Protected Space
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">This is a place where you can exhale.</h2>
                            <p className="text-purple-100 text-lg mb-8 leading-relaxed">
                                The Sisterhood is intentionally curated. With clear values, active moderation, and privacy-focused communication, we protect your boundaries so you can focus on your growth.
                            </p>
                            <Link
                                href="/sign-up"
                                className="inline-block px-8 py-4 bg-white text-purple-900 rounded-full font-bold hover:bg-purple-50 transition-colors"
                            >
                                Enter the Sanctuary
                            </Link>
                        </div>
                        <div className="flex-1 flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-30 rounded-full"></div>
                                <span className="text-9xl relative z-10">🔥</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Blog Posts */}
            <LatestBlogPosts />

            {/* Final CTA */}
            <section className="py-24 bg-gray-50 text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">Why the Phoenix?</h2>
                    <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                        The phoenix doesn’t rise because life was easy. She rises because she refuses to stay in the ashes. The Sisterhood exists to remind you: You are resilient. You are capable. And you don’t have to do it alone.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link
                            href="/sign-up"
                            className="px-10 py-4 bg-purple-700 text-white rounded-full font-bold text-lg shadow-xl hover:bg-purple-800 transition-transform hover:-translate-y-1"
                        >
                            Join the Sisterhood Now
                        </Link>
                    </div>
                    <p className="mt-6 text-sm text-gray-500">
                        Free to join. Private community. Transformational growth.
                    </p>
                </div>
            </section>

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
                            <li><Link href="/sign-in" className="hover:text-white transition-colors">Sign In</Link></li>
                            <li><Link href="/sign-up" className="hover:text-white transition-colors">Join Now</Link></li>
                            <li><Link href="/members/courses" className="hover:text-white transition-colors">Courses</Link></li>
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
