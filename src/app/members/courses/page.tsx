import { getCourses, getEnrolledCourses } from '@/lib/actions/student-course.actions';
import Link from 'next/link';
import Image from 'next/image';
import { FaBook, FaClock, FaStar, FaPlayCircle } from 'react-icons/fa';

export default async function CoursesPage() {
    const courses = await getCourses();
    const enrolledCourses = await getEnrolledCourses();

    return (
        <div className="max-w-7xl mx-auto space-y-12">
            {/* My Learning Section */}
            {enrolledCourses.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Continue Learning</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrolledCourses.map((enrollment: any) => (
                            <Link
                                key={enrollment._id}
                                href={`/members/courses/${enrollment.course.slug}/learn`}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
                            >
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                                            <FaPlayCircle className="text-xl" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                            {enrollment.progress}% Complete
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{enrollment.course.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4">Last accessed {new Date(enrollment.lastAccessedAt).toLocaleDateString()}</p>

                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${enrollment.progress}%` }}
                                        />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Course Catalog */}
            <section>
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Explore Courses</h2>
                        <p className="text-gray-500 mt-1">Expand your knowledge with our curated courses.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course: any) => (
                        <Link
                            key={course._id}
                            href={`/members/courses/${course.slug}`}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:translate-y-[-4px] transition-all duration-300 group"
                        >
                            <div className="relative h-48 bg-gray-200">
                                {course.thumbnail ? (
                                    <Image
                                        src={course.thumbnail}
                                        alt={course.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-purple-50 text-purple-200">
                                        <FaBook className="text-5xl" />
                                    </div>
                                )}
                                {course.isFree && (
                                    <span className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                        FREE
                                    </span>
                                )}
                            </div>

                            <div className="p-6">
                                <div className="flex items-center space-x-2 text-xs font-medium text-purple-600 mb-3">
                                    <span className="bg-purple-50 px-2 py-1 rounded-md">{course.category}</span>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-gray-500 capitalize">{course.level}</span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                                    {course.title}
                                </h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                    {course.shortDescription || course.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <div className="w-6 h-6 bg-gray-200 rounded-full mr-2 overflow-hidden relative">
                                            {/* Placeholder for instructor avatar */}
                                            <div className="absolute inset-0 bg-purple-200" />
                                        </div>
                                        {course.instructor.firstName} {course.instructor.lastName}
                                    </div>
                                    <div className="flex items-center text-yellow-500 text-sm font-medium">
                                        <FaStar className="mr-1" />
                                        {course.rating.toFixed(1)}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
