'use client';

import { useState } from 'react';
import { createGoal, updateGoal, deleteGoal } from '@/lib/actions/planner.actions';
import { FaPlus, FaTrash, FaCheck, FaEdit } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function GoalManager({ initialGoals }: { initialGoals: any[] }) {
    const [goals, setGoals] = useState(initialGoals);
    const [isCreating, setIsCreating] = useState(false);
    const [newGoal, setNewGoal] = useState({ title: '', type: 'personal', description: '' });
    const router = useRouter();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGoal.title.trim()) return;

        try {
            await createGoal(newGoal);
            setNewGoal({ title: '', type: 'personal', description: '' });
            setIsCreating(false);
            router.refresh();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete goal?')) {
            await deleteGoal(id);
            router.refresh();
        }
    };

    const handleProgressUpdate = async (id: string, progress: number) => {
        await updateGoal(id, { progress });
        router.refresh();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">My Goals</h2>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                >
                    <FaPlus /> New Goal
                </button>
            </div>

            {isCreating && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title</label>
                            <input
                                type="text"
                                value={newGoal.title}
                                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                placeholder="e.g., Complete React Course"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={newGoal.type}
                                    onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="personal">Personal</option>
                                    <option value="learning">Learning</option>
                                    <option value="skill">Skill</option>
                                    <option value="project">Project</option>
                                    <option value="habit">Habit</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    value={newGoal.description}
                                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Optional details"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                Create Goal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {initialGoals.map((goal) => (
                    <div key={goal._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-2 ${goal.type === 'learning' ? 'bg-blue-100 text-blue-700' :
                                        goal.type === 'skill' ? 'bg-green-100 text-green-700' :
                                            'bg-gray-100 text-gray-700'
                                    }`}>
                                    {goal.type.charAt(0).toUpperCase() + goal.type.slice(1)}
                                </span>
                                <h3 className="font-bold text-gray-900">{goal.title}</h3>
                                {goal.description && <p className="text-sm text-gray-500 mt-1">{goal.description}</p>}
                            </div>
                            <button
                                onClick={() => handleDelete(goal._id)}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <FaTrash size={14} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Progress</span>
                                <span>{goal.progress}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={goal.progress}
                                onChange={(e) => handleProgressUpdate(goal._id, parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
