import { getBooks } from '@/lib/actions/book-club.actions';
import BookManager from '@/components/admin/BookManager';

export default async function AdminBookManagerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const books = await getBooks(id);

    return <BookManager bookClubId={id} initialBooks={books} />;
}
