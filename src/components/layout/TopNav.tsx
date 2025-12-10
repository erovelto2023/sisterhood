"use client";

import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

import NotificationBell from "../notifications/NotificationBell";

export default function TopNav({ title }: { title?: string }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 sticky top-0 z-10">
            <h1 className="text-xl font-bold text-gray-800">
                {title || "Sisterhood"}
            </h1>
            <div className="flex items-center space-x-4">
                <NotificationBell />
                <span className="text-sm text-gray-600">Welcome back!</span>
                {mounted && <UserButton afterSignOutUrl="/" />}
            </div>
        </header>
    );
}
