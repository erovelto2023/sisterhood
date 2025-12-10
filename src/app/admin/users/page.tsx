import { getUsers, updateUserStatus, updateUserRole, deleteUser } from '@/lib/actions/admin.actions';
import UserList from '@/components/admin/UserList';

export default async function UserManagementPage({
    searchParams,
}: {
    searchParams: Promise<{ query?: string; page?: string }>;
}) {
    const { query, page } = await searchParams;
    const currentPage = Number(page) || 1;
    const { users, totalPages, totalUsers } = await getUsers({
        query,
        page: currentPage,
        limit: 10,
    });

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-500 mt-2">Manage members, moderators, and admins.</p>
            </div>

            <UserList
                users={users}
                totalPages={totalPages}
                currentPage={currentPage}
                totalUsers={totalUsers}
                query={query}
            />
        </div>
    );
}
