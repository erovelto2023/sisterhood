import { getAllSpaces } from '@/lib/actions/community.actions';
import CommunityManager from '@/components/admin/CommunityManager';

export default async function AdminCommunityPage() {
    const spaces = await getAllSpaces();

    return <CommunityManager initialSpaces={spaces} />;
}
