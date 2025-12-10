import { getAllBookClubs } from '@/lib/actions/book-club.actions';
import BookClubManager from '@/components/admin/BookClubManager';

export default async function AdminBookClubsPage() {
    const bookClubs = await getAllBookClubs();

    return <BookClubManager initialBookClubs={bookClubs} />;
}
