'use client';

import { useState } from 'react';
import { markLessonComplete } from '@/lib/actions/student-course.actions';
import { FaCheckCircle, FaRegCircle, FaChevronLeft, FaChevronRight, FaBars } from 'react-icons/fa';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

interface CoursePlayerProps {
    course: any;
    curriculum: any[];
    enrollment: any;
}

export default function CoursePlayer({ course, curriculum, enrollment }: CoursePlayerProps) {
    // Flatten lessons to find current index easily
    const allLessons = curriculum.flatMap(module => module.lessons);

    if (allLessons.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Content Available</h2>
                    <p className="text-gray-500 mb-4">This course doesn't have any lessons yet.</p>
                    <Link href="/members/courses" className="text-purple-600 hover:text-purple-700 font-medium">
                        &larr; Back to Courses
                    </Link>
                </div>
            </div>
        );
    }

    // Determine current lesson
    const currentLessonId = enrollment.currentLesson || allLessons[0]?._id;
    const initialLessonIndex = allLessons.findIndex((l: any) => l._id === currentLessonId);

    const [currentLessonIndex, setCurrentLessonIndex] = useState(initialLessonIndex >= 0 ? initialLessonIndex : 0);
    const [completedLessons, setCompletedLessons] = useState<string[]>(enrollment.completedLessons || []);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const currentLesson = allLessons[currentLessonIndex];
    const isCompleted = completedLessons.includes(currentLesson._id);

    const handleLessonComplete = async () => {
        if (!isCompleted) {
            try {
                await markLessonComplete(currentLesson._id, course._id);
                setCompletedLessons([...completedLessons, currentLesson._id]);
            } catch (error) {
                console.error('Failed to mark lesson complete', error);
            }
        }
    };

    const navigateLesson = (direction: 'next' | 'prev') => {
        if (direction === 'next' && currentLessonIndex < allLessons.length - 1) {
            setCurrentLessonIndex(currentLessonIndex + 1);
        } else if (direction === 'prev' && currentLessonIndex > 0) {
            setCurrentLessonIndex(currentLessonIndex - 1);
        }
    };

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
            {/* Sidebar - Curriculum */}
            <div
                className={`flex-shrink-0 bg-gray-50 border-r border-gray-200 transition-all duration-300 ${isSidebarOpen ? 'w-80' : 'w-0'
                    } overflow-y-auto`}
            >
                <div className="p-4 border-b border-gray-200 sticky top-0 bg-gray-50 z-10">
                    <h2 className="font-bold text-gray-900 line-clamp-1">{course.title}</h2>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                        <div
                            className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${(completedLessons.length / allLessons.length) * 100}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {Math.round((completedLessons.length / allLessons.length) * 100)}% Complete
                    </p>
                </div>

                <div className="py-2">
                    {curriculum.map((module, mIndex) => (
                        <div key={module._id} className="mb-2">
                            <div className="px-4 py-2 bg-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Module {mIndex + 1}: {module.title}
                            </div>
                            <div>
                                {module.lessons.map((lesson: any) => {
                                    const isLessonCompleted = completedLessons.includes(lesson._id);
                                    const isActive = lesson._id === currentLesson._id;

                                    return (
                                        <button
                                            key={lesson._id}
                                            onClick={() => setCurrentLessonIndex(allLessons.findIndex((l: any) => l._id === lesson._id))}
                                            className={`w-full text-left px-4 py-3 flex items-start space-x-3 hover:bg-gray-100 transition-colors ${isActive ? 'bg-purple-50 border-r-4 border-purple-600' : ''
                                                }`}
                                        >
                                            <div className="mt-0.5 flex-shrink-0">
                                                {isLessonCompleted ? (
                                                    <FaCheckCircle className="text-green-500" />
                                                ) : (
                                                    <FaRegCircle className={`text-gray-300 ${isActive ? 'text-purple-400' : ''}`} />
                                                )}
                                            </div>
                                            <span className={`text-sm ${isActive ? 'font-medium text-purple-900' : 'text-gray-600'}`}>
                                                {lesson.title}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Top Bar */}
                <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white flex-shrink-0">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                    >
                        <FaBars />
                    </button>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => navigateLesson('prev')}
                            disabled={currentLessonIndex === 0}
                            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            <FaChevronLeft className="mr-1" /> Previous
                        </button>
                        <button
                            onClick={() => navigateLesson('next')}
                            disabled={currentLessonIndex === allLessons.length - 1}
                            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            Next <FaChevronRight className="ml-1" />
                        </button>
                    </div>
                </div>

                {/* Lesson Content */}
                <div className="flex-1 overflow-y-auto p-8 lg:p-12">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">{currentLesson.title}</h1>

                        {currentLesson.type === 'video' && currentLesson.videoUrl && (
                            <div className="aspect-video bg-black rounded-xl overflow-hidden mb-8 shadow-lg">
                                <iframe
                                    src={currentLesson.videoUrl}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        )}

                        <div className="prose prose-purple max-w-none text-gray-700 mb-12">
                            <ReactMarkdown>{currentLesson.content || ''}</ReactMarkdown>
                        </div>

                        {/* Completion Action */}
                        <div className="border-t border-gray-200 pt-8 flex justify-end">
                            <button
                                onClick={handleLessonComplete}
                                disabled={isCompleted}
                                className={`px-6 py-3 rounded-xl font-bold flex items-center transition-all ${isCompleted
                                    ? 'bg-green-100 text-green-700 cursor-default'
                                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200'
                                    }`}
                            >
                                {isCompleted ? (
                                    <>
                                        <FaCheckCircle className="mr-2" /> Completed
                                    </>
                                ) : (
                                    <>
                                        Mark as Complete <FaChevronRight className="ml-2" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
