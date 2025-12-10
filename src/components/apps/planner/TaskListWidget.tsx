'use client';

import { useState } from 'react';
import { createTask, updateTask, deleteTask } from '@/lib/actions/planner.actions';
import { FaPlus, FaTrash, FaCheckCircle, FaRegCircle } from 'react-icons/fa';

export default function TaskListWidget({ tasks }: { tasks: any[] }) {
    const [newTask, setNewTask] = useState('');

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        await createTask({ title: newTask });
        setNewTask('');
    };

    const handleToggle = async (task: any) => {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        await updateTask(task._id, { status: newStatus });
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete task?')) {
            await deleteTask(id);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Tasks</h3>

            <form onSubmit={handleCreate} className="mb-4">
                <div className="relative">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Add a new task..."
                        className="w-full pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-2 text-purple-600 hover:text-purple-700"
                    >
                        <FaPlus />
                    </button>
                </div>
            </form>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <div key={task._id} className="flex items-center group">
                            <button
                                onClick={() => handleToggle(task)}
                                className={`mr-3 ${task.status === 'completed' ? 'text-green-500' : 'text-gray-300 hover:text-purple-500'}`}
                            >
                                {task.status === 'completed' ? <FaCheckCircle size={18} /> : <FaRegCircle size={18} />}
                            </button>
                            <span className={`flex-1 text-sm ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                {task.title}
                            </span>
                            <button
                                onClick={() => handleDelete(task._id)}
                                className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-400 text-sm py-4">No pending tasks</p>
                )}
            </div>
        </div>
    );
}
