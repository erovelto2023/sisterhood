import { getCategories } from '@/lib/actions/blog.actions';
import BlogEditor from '@/components/admin/blog/BlogEditor';

export default async function NewPostPage() {
    const categories = await getCategories();

    return <BlogEditor categories={categories} />;
}
