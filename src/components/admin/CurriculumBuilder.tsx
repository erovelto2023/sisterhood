'use client';

import { useState } from 'react';
import { createModule, deleteModule, createLesson, deleteLesson, updateLesson } from '@/lib/actions/course.actions';
import { FaPlus, FaTrash, FaEdit, FaGripVertical, FaVideo, FaFileAlt, FaChevronDown, FaChevronRight } from 'react-icons/fa';

interface CurriculumBuilderProps {
    courseId: string;
    initialModules: any[];
}

export default function CurriculumBuilder({ courseId, initialModules }: CurriculumBuilderProps) {
    const [modules, setModules] = useState(initialModules);
    const [newModuleTitle, setNewModuleTitle] = useState('');
    const [isAddingModule, setIsAddingModule] = useState(false);
    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
    const [addingLessonTo, setAddingLessonTo] = useState<string | null>(null);
    const [newLessonTitle, setNewLessonTitle] = useState('');

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
    };

    const handleAddModule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newModuleTitle.trim()) return;

        try {
            const newModule = await createModule(courseId, newModuleTitle);
            setModules([...modules, { ...newModule, lessons: [] }]);
            setNewModuleTitle('');
            setIsAddingModule(false);
        } catch (error) {
            console.error(error);
            alert('Failed to create module');
        }
    };

    const handleDeleteModule = async (moduleId: string) => {
        if (!confirm('Delete this module and all its lessons?')) return;
        try {
            await deleteModule(moduleId);
            setModules(modules.filter(m => m._id !== moduleId));
        } catch (error) {
            console.error(error);
            alert('Failed to delete module');
        }
    };

    const handleAddLesson = async (e: React.FormEvent, moduleId: string) => {
        e.preventDefault();
        if (!newLessonTitle.trim()) return;

        try {
            const newLesson = await createLesson(moduleId, courseId, newLessonTitle);
            setModules(modules.map(m => {
                if (m._id === moduleId) {
                    return { ...m, lessons: [...(m.lessons || []), newLesson] };
                }
                return m;
            }));
            setNewLessonTitle('');
            setAddingLessonTo(null);
        } catch (error) {
            console.error(error);
            alert('Failed to create lesson');
        }
    };

    const handleDeleteLesson = async (lessonId: string, moduleId: string) => {
        if (!confirm('Delete this lesson?')) return;
        try {
            await deleteLesson(lessonId);
            setModules(modules.map(m => {
                if (m._id === moduleId) {
                    return { ...m, lessons: m.lessons.filter((l: any) => l._id !== lessonId) };
                }
                return m;
            }));
        } catch (error) {
            console.error(error);
            alert('Failed to delete lesson');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Curriculum</h3>
                <button
                    onClick={() => setIsAddingModule(true)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm"
                >
                    <FaPlus className="mr-2" />
                    Add Module
                </button>
            </div>

            {isAddingModule && (
                <form onSubmit={handleAddModule} className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex gap-2">
                    <input
                        type="text"
                        value={newModuleTitle}
                        onChange={(e) => setNewModuleTitle(e.target.value)}
                        placeholder="Module Title (e.g. Introduction)"
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        Add
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsAddingModule(false)}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </form>
            )}

            <div className="space-y-4">
                {modules.map((module) => (
                    <div key={module._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="bg-gray-50 p-4 flex items-center justify-between border-b border-gray-100">
                            <div className="flex items-center flex-1 cursor-pointer" onClick={() => toggleModule(module._id)}>
                                <FaGripVertical className="text-gray-400 mr-3 cursor-move" />
                                {expandedModules[module._id] ? (
                                    <FaChevronDown className="text-gray-500 mr-3" />
                                ) : (
                                    <FaChevronRight className="text-gray-500 mr-3" />
                                )}
                                <span className="font-semibold text-gray-900">{module.title}</span>
                                <span className="ml-3 text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                                    {module.lessons?.length || 0} Lessons
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setAddingLessonTo(module._id)}
                                    className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                    title="Add Lesson"
                                >
                                    <FaPlus />
                                </button>
                                <button
                                    onClick={() => handleDeleteModule(module._id)}
                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Module"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>

                        {expandedModules[module._id] && (
                            <div className="p-4 bg-white space-y-2">
                                {module.lessons?.map((lesson: any) => (
                                    <div key={lesson._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group border border-transparent hover:border-gray-100 transition-all">
                                        <div className="flex items-center">
                                            <FaGripVertical className="text-gray-300 mr-3 cursor-move opacity-0 group-hover:opacity-100" />
                                            {lesson.type === 'video' ? (
                                                <FaVideo className="text-purple-400 mr-3" />
                                            ) : (
                                                <FaFileAlt className="text-blue-400 mr-3" />
                                            )}
                                            <span className="text-gray-700">{lesson.title}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 text-gray-400 hover:text-purple-600 rounded">
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteLesson(lesson._id, module._id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {addingLessonTo === module._id ? (
                                    <form onSubmit={(e) => handleAddLesson(e, module._id)} className="flex gap-2 pl-8 pr-2 py-2">
                                        <input
                                            type="text"
                                            value={newLessonTitle}
                                            onChange={(e) => setNewLessonTitle(e.target.value)}
                                            placeholder="Lesson Title"
                                            className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            autoFocus
                                        />
                                        <button
                                            type="submit"
                                            className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
                                        >
                                            Add
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setAddingLessonTo(null)}
                                            className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200"
                                        >
                                            Cancel
                                        </button>
                                    </form>
                                ) : (
                                    <button
                                        onClick={() => setAddingLessonTo(module._id)}
                                        className="w-full py-2 text-sm text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg border-2 border-dashed border-gray-100 hover:border-purple-200 transition-all flex items-center justify-center"
                                    >
                                        <FaPlus className="mr-2" /> Add Lesson
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
