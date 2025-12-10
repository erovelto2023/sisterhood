'use client';

import { useState, useEffect } from 'react';
import { getEmails, markEmailAsRead } from '@/lib/actions/email.actions';
import { useUser } from '@clerk/nextjs';
import { format } from 'date-fns';

export default function InboxPage() {
    const { user } = useUser();
    const [emails, setEmails] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmail, setSelectedEmail] = useState<any>(null);

    useEffect(() => {
        if (user) {
            loadEmails();
        }
    }, [user]);

    const loadEmails = async () => {
        try {
            if (!user) return;
            const data = await getEmails(user.id);
            setEmails(data);
            setLoading(false);
        } catch (error) {
            console.error("Error loading emails", error);
            setLoading(false);
        }
    };

    const handleSelect = async (email: any) => {
        setSelectedEmail(email);
        if (!email.isRead) {
            await markEmailAsRead(email._id);
            setEmails(prev => prev.map(e => e._id === email._id ? { ...e, isRead: true } : e));
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Email List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-800">Inbox</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {emails.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No emails found.
                        </div>
                    ) : (
                        emails.map((email) => (
                            <div
                                key={email._id}
                                onClick={() => handleSelect(email)}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedEmail?._id === email._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                    } ${!email.isRead ? 'font-semibold' : ''}`}
                            >
                                <h3 className="text-sm text-gray-900 truncate font-bold">{email.senderId?.firstName} {email.senderId?.lastName}</h3>
                                <p className="text-sm text-gray-800 truncate">{email.subject}</p>
                                <p className="text-xs text-gray-500 mt-1 truncate">{email.body}</p>
                                <span className="text-[10px] text-gray-400 mt-2 block">
                                    {format(new Date(email.createdAt), 'MMM d, h:mm a')}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Email Content */}
            <div className="flex-1 flex flex-col">
                {selectedEmail ? (
                    <div className="flex-1 flex flex-col">
                        <div className="p-6 border-b border-gray-200">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedEmail.subject}</h1>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>From: {selectedEmail.senderId?.firstName} {selectedEmail.senderId?.lastName}</span>
                                <span>{format(new Date(selectedEmail.createdAt), 'PPP p')}</span>
                            </div>
                        </div>
                        <div className="p-6 flex-1 overflow-y-auto prose max-w-none">
                            <p className="whitespace-pre-wrap text-gray-800">{selectedEmail.body}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
                        <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <p className="text-xl font-medium">Select an email to read</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
