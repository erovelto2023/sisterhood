import { getPlannerDashboard } from '@/lib/actions/planner.actions';
import DailyPlanWidget from '@/components/apps/planner/DailyPlanWidget';
import TaskListWidget from '@/components/apps/planner/TaskListWidget';
import HabitTrackerWidget from '@/components/apps/planner/HabitTrackerWidget';
import Link from 'next/link';
import { FaCalendarAlt, FaBullseye, FaChartLine } from 'react-icons/fa';

export default async function PlannerPage() {
    const dashboard = await getPlannerDashboard();

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">Productivity Planner</h1>
                        <div className="flex gap-2">
                            <Link
                                href="/members/apps/planner/goals"
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                                <FaBullseye /> Goals
                            </Link>
                            <Link
                                href="/members/apps/planner/schedule"
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                                <FaCalendarAlt /> Schedule
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Daily Focus */}
                    <div className="space-y-6">
                        <DailyPlanWidget entry={dashboard.todayEntry} />

                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                            <h3 className="font-bold text-lg mb-2">Weekly Insight</h3>
                            <p className="text-indigo-100 text-sm mb-4">
                                "You've been consistent with your habits this week. Keep it up!"
                            </p>
                            <div className="flex items-center gap-2 text-xs font-bold bg-white/20 inline-flex px-3 py-1 rounded-full">
                                <FaChartLine /> Productivity Score: 85%
                            </div>
                        </div>
                    </div>

                    {/* Middle Column: Tasks & Goals */}
                    <div className="space-y-6">
                        <TaskListWidget tasks={dashboard.tasks} />

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-900">Active Goals</h3>
                                <Link href="/members/apps/planner/goals" className="text-xs text-purple-600 font-medium hover:underline">View All</Link>
                            </div>
                            <div className="space-y-4">
                                {dashboard.goals.length > 0 ? (
                                    dashboard.goals.map((goal: any) => (
                                        <div key={goal._id} className="border border-gray-100 rounded-lg p-3">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-medium text-sm text-gray-800">{goal.title}</span>
                                                <span className="text-xs text-gray-500">{goal.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                <div
                                                    className="bg-green-500 h-1.5 rounded-full transition-all"
                                                    style={{ width: `${goal.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-400 text-center py-2">No active goals</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Habits & Schedule */}
                    <div className="space-y-6">
                        <HabitTrackerWidget habits={dashboard.habits} />

                        {/* Simple Schedule Placeholder */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Today's Schedule</h3>
                            <div className="space-y-3">
                                <div className="flex gap-3 text-sm">
                                    <span className="text-gray-400 font-mono w-12">09:00</span>
                                    <div className="flex-1 p-2 bg-blue-50 text-blue-700 rounded border-l-2 border-blue-400">
                                        Deep Work Block
                                    </div>
                                </div>
                                <div className="flex gap-3 text-sm">
                                    <span className="text-gray-400 font-mono w-12">14:00</span>
                                    <div className="flex-1 p-2 bg-purple-50 text-purple-700 rounded border-l-2 border-purple-400">
                                        Course: Meditation 101
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
