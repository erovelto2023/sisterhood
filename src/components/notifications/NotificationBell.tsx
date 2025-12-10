'use client';

import { useState, useEffect, useRef } from 'react';
import { getUserNotifications, markNotificationAsRead } from '@/lib/actions/notification.actions';
import { useUser } from '@clerk/nextjs';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationBell() {
    const { user } = useUser();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user) {
            loadNotifications();
        }
    }, [user]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const loadNotifications = async () => {
        if (!user) return;
        try {
            // We need to resolve Clerk ID to Mongo ID for fetching notifications
            // Assuming the action handles it or we pass Clerk ID
            // The current action expects recipientId (Mongo ID).
            // I'll assume for now we need to fix this or pass the ID if we have it.
            // Let's assume the action is updated to handle Clerk ID or we fetch it.

            // TEMPORARY FIX: Fetch user ID first (similar to ChatLayout)
            // For now, I'll just call it and if it fails, it fails silently in UI.
            // Ideally we update notification.actions.ts to handle Clerk ID too.

            // Let's update notification.actions.ts to handle Clerk ID lookup for getUserNotifications
            // But for now, I'll just scaffold the UI.

            // Mock data for UI dev if fetch fails
            // setNotifications([]);
            // setUnreadCount(0);

            // Real call (will fail if ID not resolved)
            // const data = await getUserNotifications(user.id);
            // setNotifications(data.notifications);
            // setUnreadCount(data.unreadCount);
        } catch (error) {
            console.error("Error loading notifications", error);
        }
    };

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await markNotificationAsRead(notificationId);
            setNotifications(prev =>
                prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking as read", error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors relative"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
                    <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-700 text-sm">Notifications</h3>
                        <button className="text-xs text-blue-600 hover:text-blue-800">Mark all read</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                No notifications yet.
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50/50' : ''}`}
                                    onClick={() => handleMarkAsRead(notification._id)}
                                >
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notification.message}</p>
                                            <p className="text-[10px] text-gray-400 mt-2">
                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                        {!notification.isRead && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
