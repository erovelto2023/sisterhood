'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { searchArticles } from '@/lib/actions/kb.actions';
import { FaSearch } from 'react-icons/fa';
import Link from 'next/link';

export default function KBSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.length > 2) {
                const searchResults = await searchArticles(query);
                setResults(searchResults);
                setIsOpen(true);
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Could redirect to a dedicated search page if we had one, 
        // for now just let the dropdown handle navigation
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for answers..."
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                />
                <FaSearch className="absolute left-4 top-5 text-gray-400 text-xl" />
            </form>

            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                    <div className="p-2">
                        {results.map((article) => (
                            <Link
                                key={article._id}
                                href={`/members/knowledge-base/${article.slug}`}
                                className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <div className="font-medium text-gray-900">{article.title}</div>
                                <div className="text-sm text-gray-500 flex items-center mt-1">
                                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full mr-2">
                                        {article.category.name}
                                    </span>
                                    <span className="truncate">{article.excerpt}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
