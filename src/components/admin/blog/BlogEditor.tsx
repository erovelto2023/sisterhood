'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, updatePost } from '@/lib/actions/blog.actions';
import { UploadButton } from '@/lib/uploadthing';
import { FaSave, FaArrowLeft, FaImage, FaTimes } from 'react-icons/fa';
import dynamic from 'next/dynamic';

// Dynamic import for rich text editor (using ReactQuill for now as a robust option)
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

interface BlogEditorProps {
    post?: any;
    categories: any[];
}

const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image', 'video'],
        ['clean']
    ],
};

export default function BlogEditor({ post, categories }: BlogEditorProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState(post?.title || '');
    const [subtitle, setSubtitle] = useState(post?.subtitle || '');
    const [content, setContent] = useState(post?.content || '');
    const [excerpt, setExcerpt] = useState(post?.excerpt || '');
    const [status, setStatus] = useState(post?.status || 'draft');
    const [categoryId, setCategoryId] = useState(post?.category?._id || post?.category || '');
    const [tags, setTags] = useState(post?.tags?.join(', ') || '');
    const [featuredImage, setFeaturedImage] = useState(post?.featuredImage || '');
    const [seoTitle, setSeoTitle] = useState(post?.seoTitle || '');
    const [metaDescription, setMetaDescription] = useState(post?.metaDescription || '');

    const handleSave = async () => {
        if (!title.trim()) return alert('Title is required');

        setLoading(true);
        try {
            const data = {
                title,
                subtitle,
                content,
                excerpt,
                status,
                category: categoryId || undefined,
                tags: tags.split(',').map((t: string) => t.trim()).filter(Boolean),
                featuredImage,
                seoTitle,
                metaDescription
            };

            if (post) {
                await updatePost(post._id, data);
            } else {
                await createPost(data);
            }

            router.push('/admin/blog');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to save post');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900"
                >
                    <FaArrowLeft /> Back
                </button>
                <div className="flex gap-3">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="draft">Draft</option>
                        <option value="review">Review</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </select>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        <FaSave /> {loading ? 'Saving...' : 'Save Post'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Editor */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Post Title"
                            className="w-full text-3xl font-bold border-none placeholder-gray-300 focus:ring-0 p-0"
                        />
                        <input
                            type="text"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            placeholder="Subtitle (optional)"
                            className="w-full text-xl text-gray-500 border-none placeholder-gray-300 focus:ring-0 p-0"
                        />
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 min-h-[500px]">
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            modules={modules}
                            className="h-[400px] mb-12"
                        />
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="font-bold text-gray-900 mb-4">SEO Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                                <input
                                    type="text"
                                    value={seoTitle}
                                    onChange={(e) => setSeoTitle(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder={title}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                                <textarea
                                    value={metaDescription}
                                    onChange={(e) => setMetaDescription(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg h-24"
                                    placeholder={excerpt}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Featured Image */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Featured Image</h3>
                        {featuredImage ? (
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 mb-4">
                                <img src={featuredImage} alt="Featured" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => setFeaturedImage('')}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-sm"
                                >
                                    <FaTimes size={12} />
                                </button>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
                                <FaImage className="mx-auto text-gray-400 mb-2" size={24} />
                                <p className="text-sm text-gray-500 mb-4">Upload a cover image</p>
                                <UploadButton
                                    endpoint="postImage"
                                    onClientUploadComplete={(res) => {
                                        if (res && res[0]) setFeaturedImage(res[0].url);
                                    }}
                                    onUploadError={(error: Error) => {
                                        alert(`ERROR! ${error.message}`);
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Organization */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Organization</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Uncategorized</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                                <input
                                    type="text"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    placeholder="Comma separated tags"
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Excerpt</h3>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg h-32 text-sm"
                            placeholder="Write a short summary..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
