'use client';

import { useState } from 'react';
import { addBook, updateBook, deleteBook } from '@/lib/actions/book-club.actions';
import { UploadButton } from '@/lib/uploadthing';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaFilePdf, FaImage } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function BookManager({ bookClubId, initialBooks }: { bookClubId: string, initialBooks: any[] }) {
    const [books, setBooks] = useState(initialBooks);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<any | null>(null);
    const router = useRouter();

    // Form states
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [pdfUrl, setPdfUrl] = useState('');
    const [pageCount, setPageCount] = useState(0);
    const [order, setOrder] = useState(0);

    const resetForm = () => {
        setTitle('');
        setAuthor('');
        setDescription('');
        setCoverImage('');
        setPdfUrl('');
        setPageCount(0);
        setOrder(0);
        setEditingBook(null);
        setIsCreateModalOpen(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addBook(bookClubId, {
                title, author, description, coverImage, pdfUrl, pageCount, order
            });
            resetForm();
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to add book');
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBook) return;
        try {
            await updateBook(editingBook._id, {
                title, author, description, coverImage, pdfUrl, pageCount, order
            });
            resetForm();
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to update book');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this book?')) return;
        try {
            await deleteBook(id);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to delete book');
        }
    };

    const openEditModal = (book: any) => {
        setEditingBook(book);
        setTitle(book.title);
        setAuthor(book.author);
        setDescription(book.description);
        setCoverImage(book.coverImage || '');
        setPdfUrl(book.pdfUrl);
        setPageCount(book.pageCount || 0);
        setOrder(book.order || 0);
        setIsCreateModalOpen(true);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manage Books</h1>
                <button
                    onClick={() => {
                        resetForm();
                        setIsCreateModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                    <FaPlus /> Add Book
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Order</th>
                            <th className="p-4 font-semibold text-gray-600">Cover</th>
                            <th className="p-4 font-semibold text-gray-600">Title</th>
                            <th className="p-4 font-semibold text-gray-600">Author</th>
                            <th className="p-4 font-semibold text-gray-600">PDF</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {initialBooks.map((book) => (
                            <tr key={book._id} className="hover:bg-gray-50">
                                <td className="p-4 text-gray-600">{book.order}</td>
                                <td className="p-4">
                                    <div className="w-10 h-14 bg-gray-200 rounded overflow-hidden">
                                        {book.coverImage ? (
                                            <img src={book.coverImage} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <FaImage />
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-gray-900">{book.title}</td>
                                <td className="p-4 text-gray-600">{book.author}</td>
                                <td className="p-4">
                                    {book.pdfUrl ? (
                                        <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                            <FaFilePdf /> View
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">Missing</span>
                                    )}
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button
                                        onClick={() => openEditModal(book)}
                                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(book._id)}
                                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {initialBooks.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No books found. Add one to get started.
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-gray-800">
                                {editingBook ? 'Edit Book' : 'Add New Book'}
                            </h3>
                            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={editingBook ? handleUpdate : handleCreate} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                                    <input
                                        type="text"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                    <input
                                        type="number"
                                        value={order}
                                        onChange={(e) => setOrder(parseInt(e.target.value))}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none h-24"
                                    />
                                </div>

                                {/* Cover Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                                    {coverImage ? (
                                        <div className="relative w-24 h-36 bg-gray-100 rounded overflow-hidden mb-2">
                                            <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setCoverImage('')}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    ) : (
                                        <UploadButton
                                            endpoint="bookCover"
                                            onClientUploadComplete={(res) => {
                                                if (res && res[0]) setCoverImage(res[0].url);
                                            }}
                                            onUploadError={(error: Error) => {
                                                alert(`ERROR! ${error.message}`);
                                            }}
                                        />
                                    )}
                                </div>

                                {/* PDF Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Book PDF</label>
                                    {pdfUrl ? (
                                        <div className="flex items-center gap-2 p-2 bg-blue-50 text-blue-700 rounded mb-2">
                                            <FaFilePdf />
                                            <span className="text-sm truncate max-w-[150px]">PDF Uploaded</span>
                                            <button
                                                type="button"
                                                onClick={() => setPdfUrl('')}
                                                className="text-red-500 hover:text-red-700 ml-auto"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    ) : (
                                        <UploadButton
                                            endpoint="bookPdf"
                                            onClientUploadComplete={(res) => {
                                                if (res && res[0]) setPdfUrl(res[0].url);
                                            }}
                                            onUploadError={(error: Error) => {
                                                alert(`ERROR! ${error.message}`);
                                            }}
                                        />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Page Count</label>
                                    <input
                                        type="number"
                                        value={pageCount}
                                        onChange={(e) => setPageCount(parseInt(e.target.value))}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium"
                                >
                                    {editingBook ? 'Update Book' : 'Add Book'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
