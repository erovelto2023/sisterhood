import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export default async function ProfilePage() {
    const clerkUser = await currentUser();
    if (!clerkUser) redirect("/sign-in");

    await dbConnect();
    const user = await User.findOne({ clerkId: clerkUser.id });

    if (user) {
        redirect(`/members/${user._id}`);
    }

    return (
        <div className="p-8 text-center">
            User profile not found.
        </div>
    );
}
