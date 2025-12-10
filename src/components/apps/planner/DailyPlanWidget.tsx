'use client';

import { useState } from 'react';
import { updateDailyEntry } from '@/lib/actions/planner.actions';
import { FaSun, FaMoon, FaCheck } from 'react-icons/fa';

export default function DailyPlanWidget({ entry }: { entry: any }) {
    const [priorities, setPriorities] = useState<string[]>(entry?.topPriorities || ['', '', '']);
    const [mood, setMood] = useState(entry?.mood || 0);
    const [saving, setSaving] = useState(false);

    const handlePriorityChange = (index: number, value: string) => {
        const newPriorities = [...priorities];
        newPriorities[index] = value;
        setPriorities(newPriorities);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateDailyEntry({
                topPriorities: priorities.filter(p => p.trim()),
                mood
            });
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Today's Focus</h3>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save'}
                </button>
            </div>

            <div className="space-y-3 mb-6">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Top 3 Priorities</p>
                {priorities.map((p, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                            {i + 1}
                        </span>
                        <input
                            type="text"
                            value={p}
                            onChange={(e) => handlePriorityChange(i, e.target.value)}
                            placeholder={`Priority #${i + 1}`}
                            className="flex-1 border-b border-gray-200 focus:border-purple-500 outline-none py-1 text-sm"
                        />
                    </div>
                ))}
            </div>

            <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Energy Check-in</p>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                        <button
                            key={level}
                            onClick={() => setMood(level)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${mood === level ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
