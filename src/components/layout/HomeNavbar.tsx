'use client';

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function HomeNavbar() {
    return (
        <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <span className="text-3xl">🔥</span>
                        <span className="text-xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent hidden sm:block">
                            Sisterhood of the Rising Phoenix
                        </span>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/blog"
                            className="text-gray-600 hover:text-purple-700 font-medium transition-colors mr-2 hidden md:block"
                        >
                            The Phoenix Scrolls
                        </Link>
                        <SignedOut>
                            <Link
                                href="/sign-in"
                                className="text-gray-600 hover:text-purple-700 font-medium transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/sign-up"
                                className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                Join the Sisterhood
                            </Link>
                        </SignedOut>
                        <SignedIn>
                            <Link
                                href="/members/dashboard"
                                className="mr-4 text-purple-700 hover:text-purple-900 font-medium"
                            >
                                Go to Dashboard
                            </Link>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                    </div>
                </div>
            </div>
        </nav>
    );
}
