"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FaHome, FaBook, FaUsers, FaTh, FaUser, FaCertificate,
    FaSearch, FaUserFriends, FaComments, FaCalendarAlt,
    FaLightbulb, FaShoppingBag, FaEnvelope, FaShieldAlt, FaMedal
} from "react-icons/fa";
import clsx from "clsx";

const menuItems = [
    { label: "Dashboard", icon: FaHome, href: "/members/dashboard" },
    { label: "Courses", icon: FaBook, href: "/members/courses" },
    { label: "Community Portal", icon: FaUsers, href: "/members/community" },
    { label: "Apps", icon: FaTh, href: "/members/apps" },
    { label: "My Profile", icon: FaUser, href: "/members/profile" },
    { label: "My Certificates", icon: FaCertificate, href: "/members/certificates" },
    { label: "My Badges", icon: FaMedal, href: "/members/badges" },
    { label: "Search Members", icon: FaSearch, href: "/members/search?page=1" },
    { label: "Friend Requests", icon: FaUserFriends, href: "/members/friends" },
    { label: "Events", icon: FaCalendarAlt, href: "/members/events" },
    { label: "Knowledge Base", icon: FaLightbulb, href: "/members/knowledge-base" },
    { label: "Browse Listings", icon: FaShoppingBag, href: "/members/listings" },
    { label: "Inbox", icon: FaEnvelope, href: "/members/inbox" },
    { label: "Messages", icon: FaComments, href: "/members/chat" },
];

export default function Sidebar({ userRole = 'member' }: { userRole?: string }) {
    const pathname = usePathname();
    const isMod = userRole === 'admin' || userRole === 'moderator';

    return (
        <aside className="w-64 bg-[#4C1D95] text-white flex flex-col h-screen fixed left-0 top-0 overflow-y-auto">
            <div className="p-6 text-2xl font-bold border-b border-purple-800">
                Sisterhood
            </div>

            <div className="flex-1 py-4">
                <div className="px-4 mb-2 text-xs font-semibold text-purple-300 uppercase tracking-wider">
                    Member Menu
                </div>
                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200",
                                    isActive
                                        ? "bg-purple-800 text-white border-l-4 border-white"
                                        : "text-purple-100 hover:bg-purple-700 hover:text-white"
                                )}
                            >
                                <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {isMod && (
                    <>
                        <div className="mt-8 px-4 mb-2 text-xs font-semibold text-purple-300 uppercase tracking-wider">
                            Moderator Tools
                        </div>
                        <nav className="space-y-1">
                            <Link
                                href="/admin/dashboard"
                                className="flex items-center px-4 py-3 text-sm font-medium text-purple-100 hover:bg-purple-700 hover:text-white transition-colors duration-200"
                            >
                                <FaShieldAlt className="mr-3 h-5 w-5" />
                                Mod Dashboard
                            </Link>
                            <Link
                                href="/admin/communications"
                                className="flex items-center px-4 py-3 text-sm font-medium text-purple-100 hover:bg-purple-700 hover:text-white transition-colors duration-200"
                            >
                                <FaEnvelope className="mr-3 h-5 w-5" />
                                Communications
                            </Link>
                        </nav>
                    </>
                )}
            </div>

            <div className="p-4 border-t border-purple-800">
                <div className="text-xs text-purple-300 text-center">
                    &copy; 2025 Sisterhood
                </div>
            </div>
        </aside>
    );
}
