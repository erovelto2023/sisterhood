# Course Platform Implementation Plan

## 1. Database Schema

### Course Model (`src/models/Course.ts`)
- **Info**: `title`, `slug`, `description`, `shortDescription`, `thumbnail`, `category`, `level` (beginner, intermediate, advanced).
- **Settings**: `price`, `isFree`, `status` (draft, published, archived).
- **Relations**: `instructor` (User ref), `modules` (virtual).
- **Stats**: `enrollmentCount`, `rating`.

### Module Model (`src/models/Module.ts`)
- **Info**: `title`, `slug`, `description`.
- **Relations**: `course` (Course ref).
- **Ordering**: `order` (number).
- **Settings**: `isPublished`, `isFree`.

### Lesson Model (`src/models/Lesson.ts`)
- **Info**: `title`, `slug`, `description`.
- **Content**: 
  - `type`: 'video' | 'text' | 'quiz' | 'assignment'.
  - `content`: Rich text (markdown/html).
  - `videoUrl`: URL for video (UploadThing/YouTube/Vimeo).
  - `duration`: Number (minutes).
  - `resources`: Array of attachments.
- **Relations**: `module` (Module ref), `course` (Course ref).
- **Ordering**: `order` (number).
- **Settings**: `isFreePreview`, `isPublished`.

### Enrollment Model (`src/models/Enrollment.ts`)
- **Relations**: `user` (User ref), `course` (Course ref).
- **Progress**: 
  - `completedLessons`: Array of Lesson IDs.
  - `currentLesson`: Lesson ID (last accessed).
  - `progress`: Number (0-100).
- **Status**: `active`, `completed`, `expired`.
- **Dates**: `enrolledAt`, `completedAt`, `lastAccessedAt`.

## 2. Server Actions (`src/lib/actions/course.actions.ts`)

### Admin Actions
- `createCourse`, `updateCourse`, `deleteCourse`.
- `createModule`, `updateModule`, `deleteModule`, `reorderModules`.
- `createLesson`, `updateLesson`, `deleteLesson`, `reorderLessons`.
- `getAdminCourses`.

### Student Actions
- `getCourses` (Catalog with filters).
- `getCourseBySlug` (Landing page).
- `enrollInCourse` (Free/Paid logic).
- `getEnrolledCourses` (Dashboard).
- `getCourseContent` (Player - requires enrollment).
- `markLessonComplete`.

## 3. Admin UI (`/admin/courses`)

- **List Page**: Table of courses.
- **Create/Edit Page**: Basic info form.
- **Curriculum Builder**: 
  - View modules and lessons.
  - Add/Edit/Delete modules.
  - Add/Edit/Delete lessons.
  - Drag and drop reordering (optional MVP: simple up/down buttons).

## 4. Student UI (`/members/courses`)

- **Catalog**: Grid of course cards.
- **Landing Page**: Course details, curriculum preview, enroll button.
- **Dashboard**: List of enrolled courses with progress bars.
- **Course Player (`/members/courses/[slug]/learn`)**:
  - **Sidebar**: Accordion of modules/lessons with progress checks.
  - **Main Area**: Video player / Text content.
  - **Navigation**: Previous/Next buttons.

## 5. Components
- `CourseCard`
- `CurriculumAccordion`
- `VideoPlayer`
- `LessonContent`
- `CourseProgress`

## 6. Phased Rollout
1.  **Phase 1**: Core Data Structure & Admin Management (Create Courses/Modules/Lessons).
2.  **Phase 2**: Student Catalog & Enrollment.
3.  **Phase 3**: Course Player & Progress Tracking.
4.  **Phase 4**: Quizzes & Assignments (Future).
