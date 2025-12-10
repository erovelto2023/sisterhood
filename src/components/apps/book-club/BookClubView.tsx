'use client';

import { useState } from 'react';
import { FaBook, FaCommentDots, FaUsers, FaDownload, FaLock } from 'react-icons/fa';
import BookClubFeed from './BookClubFeed';
import BookClubMembers from './BookClubMembers';

interface BookClubViewProps {
    bookClub: any;
    books: any[];
    members: any[];
    posts: any[];
    isMember: boolean;
}

export default function BookClubView({ bookClub, books, members, posts, isMember }: BookClubViewProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'books' | 'discussions' | 'members'>('overview');

    return (
        <div>
            {/* Tab Navigation */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-8 flex gap-8">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-amber-600 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('books')}
                        className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'books' ? 'border-amber-600 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Books ({books.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('discussions')}
                        className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'discussions' ? 'border-amber-600 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Discussions
                    </button>
                    <button
                        onClick={() => setActiveTab('members')}
                        className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'members' ? 'border-amber-600 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Members ({members.length})
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-8">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white rounded-2xl p-8 shadow-sm">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">About this Club</h2>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {bookClub.description || "No description provided."}
                                </p>
                            </div>

                            {/* Recent Books Preview */}
                            <div className="bg-white rounded-2xl p-8 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Current Reading</h2>
                                    <button onClick={() => setActiveTab('books')} className="text-amber-600 text-sm font-medium hover:underline">View All</button>
                                </div>
                                {books.length > 0 ? (
                                    <div className="flex gap-6 p-4 rounded-xl border border-gray-100">
                                        <div className="w-24 h-36 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden shadow-sm">
                                            {books[0].coverImage ? (
                                                <img src={books[0].coverImage} alt={books[0].title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs text-center p-2">No Cover</div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 text-lg">{books[0].title}</h3>
                                            <p className="text-gray-500 text-sm">by {books[0].author}</p>
                                            <p className="text-gray-600 text-sm mt-3 line-clamp-2">{books[0].description}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-sm">No books added yet.</div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                                <h3 className="font-bold text-amber-900 mb-2">Reading Schedule</h3>
                                <p className="text-amber-700/80 text-sm mb-4">
                                    Keep up with the group!
                                </p>
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-100/50">
                                    <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Current Goal</div>
                                    <div className="font-medium text-gray-900">{bookClub.currentGoal || 'No active goal'}</div>
                                    {bookClub.nextMeeting && (
                                        <div className="text-sm text-gray-500 mt-1">
                                            Next Meeting: {new Date(bookClub.nextMeeting).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'books' && (
                    <div className="space-y-6">
                        {books.map((book: any, index: number) => (
                            <div key={book._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-6">
                                <div className="w-32 h-48 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden shadow-sm">
                                    {book.coverImage ? (
                                        <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs text-center p-2">
                                            No Cover
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-xl">{book.title}</h3>
                                            <p className="text-gray-500">by {book.author}</p>
                                        </div>
                                        <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                            Book {index + 1}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mt-4 leading-relaxed">{book.description}</p>

                                    <div className="mt-6 flex gap-3">
                                        {isMember ? (
                                            <>
                                                {book.pdfUrl && (
                                                    <a
                                                        href={book.pdfUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors"
                                                    >
                                                        <FaDownload size={12} /> Download PDF
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => setActiveTab('discussions')}
                                                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                                                >
                                                    <FaCommentDots size={12} /> Discuss
                                                </button>
                                            </>
                                        ) : (
                                            <div className="flex items-center gap-2 text-gray-400 text-sm bg-gray-50 px-4 py-2 rounded-lg w-fit">
                                                <FaLock size={12} /> Join to access content
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {books.length === 0 && (
                            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                No books added yet.
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'discussions' && (
                    <BookClubFeed
                        bookClubId={bookClub._id}
                        initialPosts={posts}
                        isMember={isMember}
                    />
                )}

                {activeTab === 'members' && (
                    <BookClubMembers members={members} />
                )}
            </div>
        </div>
    );
}
