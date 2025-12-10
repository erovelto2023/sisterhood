import { getBookClubBySlug, getBookClubMembership, getBooks, getBookClubMembers, getBookClubPosts } from '@/lib/actions/book-club.actions';
import BookClubHeader from '@/components/apps/book-club/BookClubHeader';
import BookClubView from '@/components/apps/book-club/BookClubView';
import { notFound } from 'next/navigation';

export default async function BookClubPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const bookClub = await getBookClubBySlug(slug);

    if (!bookClub) {
        notFound();
    }

    const membership = await getBookClubMembership(bookClub._id);
    const books = await getBooks(bookClub._id);
    const members = await getBookClubMembers(bookClub._id);
    const posts = await getBookClubPosts(bookClub._id);
    const isMember = !!membership;

    return (
        <div className="min-h-full bg-gray-50">
            <BookClubHeader bookClub={bookClub} membership={membership} />
            <BookClubView
                bookClub={bookClub}
                books={books}
                members={members}
                posts={posts}
                isMember={isMember}
            />
        </div>
    );
}
