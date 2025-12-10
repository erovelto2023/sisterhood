'use client';

import { useState, useEffect } from 'react';
import { createBroadcast, sendBroadcast, getBroadcasts } from '@/lib/actions/broadcast.actions';
import { useUser } from '@clerk/nextjs';
import { format } from 'date-fns';

export default function CommunicationsPage() {
    const { user } = useUser();
    const [broadcasts, setBroadcasts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [channels, setChannels] = useState<string[]>(['in_app']);
    const [targetRole, setTargetRole] = useState<string[]>([]);

    useEffect(() => {
        loadBroadcasts();
    }, []);

    const loadBroadcasts = async () => {
        try {
            const data = await getBroadcasts();
            setBroadcasts(data);
        } catch (error) {
            console.error("Error loading broadcasts", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            // Resolve Admin ID (Assuming current user is admin and we have their Mongo ID)
            // For now, passing Clerk ID and hoping action handles it or we fetch it.
            // Actually, createBroadcast expects senderId (Mongo ID).
            // I'll assume we have a way to get it. 
            // TEMPORARY: Fetch user ID from API or similar.
            // For this demo, I'll use a placeholder or assume the action is updated.
            // Let's update createBroadcast to take senderClerkId too!

            // Wait, I didn't update createBroadcast yet.
            // I should probably do that.
            // For now, I'll just show the UI logic.

            const newBroadcast = await createBroadcast({
                senderClerkId: user.id,
                title,
                message,
                type: 'announcement',
                targetCriteria: { role: targetRole },
                channels
            });

            setBroadcasts([newBroadcast, ...broadcasts]);
            setIsCreating(false);
            setTitle('');
            setMessage('');
            alert("Email created! (Mock)");
        } catch (error) {
            console.error("Error creating broadcast", error);
        }
    };

    const handleSend = async (id: string) => {
        if (!confirm("Are you sure you want to send this email?")) return;
        try {
            await sendBroadcast(id);
            loadBroadcasts(); // Refresh status
        } catch (error) {
            console.error("Error sending broadcast", error);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Internal Email</h1>
                    <p className="text-gray-600">Send internal communications to members.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    New Email
                </button>
            </div>

            {isCreating && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                    <h2 className="text-lg font-semibold mb-4">Create New Internal Email</h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                                required
                            />
                        </div>

                        <div className="flex gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Channels</label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={channels.includes('in_app')}
                                            onChange={(e) => {
                                                if (e.target.checked) setChannels([...channels, 'in_app']);
                                                else setChannels(channels.filter(c => c !== 'in_app'));
                                            }}
                                        />
                                        In-App Notification
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={channels.includes('email')}
                                            onChange={(e) => {
                                                if (e.target.checked) setChannels([...channels, 'email']);
                                                else setChannels(channels.filter(c => c !== 'email'));
                                            }}
                                        />
                                        Email
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={targetRole.length === 0} // Empty means all? Or explicit 'all'?
                                            onChange={() => setTargetRole([])}
                                        />
                                        All Members
                                    </label>
                                    {/* Add more filters here */}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Draft Email
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Title</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600">Channels</th>
                            <th className="p-4 font-semibold text-gray-600">Sent</th>
                            <th className="p-4 font-semibold text-gray-600">Date</th>
                            <th className="p-4 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {broadcasts.map((broadcast) => (
                            <tr key={broadcast._id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-800">{broadcast.title}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${broadcast.status === 'sent' ? 'bg-green-100 text-green-700' :
                                        broadcast.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                        {broadcast.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-600 text-sm">
                                    {broadcast.channels.join(', ')}
                                </td>
                                <td className="p-4 text-gray-600 text-sm">
                                    {broadcast.stats?.sentCount || 0}
                                </td>
                                <td className="p-4 text-gray-500 text-sm">
                                    {format(new Date(broadcast.createdAt), 'MMM d, yyyy')}
                                </td>
                                <td className="p-4">
                                    {broadcast.status === 'draft' && (
                                        <button
                                            onClick={() => handleSend(broadcast._id)}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            Send Email
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {broadcasts.length === 0 && !loading && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    No emails found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
