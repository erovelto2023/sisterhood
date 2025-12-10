'use client';

import { toggleHabit } from '@/lib/actions/planner.actions';
import { FaFire } from 'react-icons/fa';

export default function HabitTrackerWidget({ habits }: { habits: any[] }) {

    const handleToggle = async (id: string) => {
        await toggleHabit(id);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Habits</h3>

            <div className="space-y-4">
                {habits.map((habit) => (
                    <div key={habit._id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleToggle(habit._id)}
                                className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${habit.completedToday
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : 'bg-white border-gray-300 hover:border-green-500'
                                    }`}
                            >
                                {habit.completedToday && <span className="text-xs">✓</span>}
                            </button>
                            <span className="text-sm font-medium text-gray-700">{habit.title}</span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-orange-500 font-bold">
                            <FaFire />
                            {habit.currentStreak}
                        </div>
                    </div>
                ))}

                {habits.length === 0 && (
                    <p className="text-center text-gray-400 text-sm py-4">No habits tracked yet</p>
                )}
            </div>
        </div>
    );
}
