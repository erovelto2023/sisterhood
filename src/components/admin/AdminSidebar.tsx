"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FaHome, FaUsers, FaBook, FaCertificate, FaCalendarAlt,
    FaLightbulb, FaShoppingBag, FaShieldAlt, FaArrowLeft, FaMedal, FaEnvelope, FaComments, FaBookOpen, FaPenNib
} from "react-icons/fa";
import clsx from "clsx";

const menuItems = [
    { label: "Dashboard", icon: FaHome, href: "/admin/dashboard" },
    { label: "User Manager", icon: FaUsers, href: "/admin/users" },
    { label: "Course Manager", icon: FaBook, href: "/admin/courses" },
    { label: "Certificate Manager", icon: FaCertificate, href: "/admin/certificates" },
    { label: "Badge Manager", icon: FaMedal, href: "/admin/badges" },
    { label: "Event Manager", icon: FaCalendarAlt, href: "/admin/events" },
    { label: "Knowledge Base", icon: FaLightbulb, href: "/admin/knowledge-base" },
    { label: "Store Manager", icon: FaShoppingBag, href: "/admin/store" },
    { label: "Mod Manager", icon: FaShieldAlt, href: "/admin/moderators" },
    { label: "Community Manager", icon: FaComments, href: "/admin/community" },
    { label: "Book Club Manager", icon: FaBookOpen, href: "/admin/book-clubs" },
    { label: "Blog Manager", icon: FaPenNib, href: "/admin/blog" },
    { label: "Internal Email", icon: FaEnvelope, href: "/admin/communications" },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen fixed left-0 top-0 overflow-y-auto">
            <div className="p-6 text-2xl font-bold border-b border-gray-800">
                Admin Panel
            </div>

            <div className="flex-1 py-4">
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
                                        ? "bg-gray-800 text-white border-l-4 border-purple-500"
                                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                )}
                            >
                                <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-gray-800">
                <Link
                    href="/members/dashboard"
                    className="flex items-center px-4 py-3 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-200 rounded-lg"
                >
                    <FaArrowLeft className="mr-3 h-5 w-5" />
                    Back to Site
                </Link>
            </div>
        </aside>
    );
}
