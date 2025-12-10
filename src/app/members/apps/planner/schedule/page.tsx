import Link from 'next/link';
import { FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';

export default function SchedulePage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link
                    href="/members/apps/planner"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6"
                >
                    <FaArrowLeft /> Back to Planner
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="w-20 h-20 bg-purple-50 text-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaCalendarAlt size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Schedule View Coming Soon</h1>
                    <p className="text-gray-500 max-w-md mx-auto">
                        We're building a powerful calendar integration to help you time-block your learning sessions and deep work.
                    </p>
                </div>
            </div>
        </div>
    );
}
