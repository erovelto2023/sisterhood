import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import { currentUser } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export default async function MembersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const clerkUser = await currentUser();
    let userRole = 'member';

    if (clerkUser) {
        await dbConnect();
        const user = await User.findOne({ clerkId: clerkUser.id }).select('role');
        if (user) {
            userRole = user.role;
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar userRole={userRole} />
            <div className="flex-1 ml-64 flex flex-col">
                <TopNav />
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
