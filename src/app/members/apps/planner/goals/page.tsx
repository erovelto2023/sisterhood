import { getGoals } from '@/lib/actions/planner.actions';
import GoalManager from '@/components/apps/planner/GoalManager';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default async function GoalsPage() {
    const goals = await getGoals();

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link
                    href="/members/apps/planner"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6"
                >
                    <FaArrowLeft /> Back to Planner
                </Link>

                <GoalManager initialGoals={goals} />
            </div>
        </div>
    );
}
