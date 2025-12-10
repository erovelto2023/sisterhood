import ChatLayout from '@/components/chat/ChatLayout';

export default function ChatPage() {
    return (
        <div className="h-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                <p className="text-gray-500">Chat with other members and admins.</p>
            </div>
            <ChatLayout />
        </div>
    );
}
