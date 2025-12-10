import { getPostById, getCategories } from '@/lib/actions/blog.actions';
import BlogEditor from '@/components/admin/blog/BlogEditor';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [post, categories] = await Promise.all([
        getPostById(id),
        getCategories()
    ]);

    if (!post) notFound();

    return <BlogEditor post={post} categories={categories} />;
}
