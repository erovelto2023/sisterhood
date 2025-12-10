# Knowledge Base Implementation Plan

## 1. Database Schema Design

### Updated KnowledgeBase Model (`src/models/KnowledgeBase.ts`)
- **Content**: `title`, `slug`, `content` (Rich Text/Markdown), `excerpt`.
- **Organization**: 
  - `category`: Ref to Category model.
  - `tags`: Array of strings.
  - `type`: (article, tutorial, faq, video).
- **Media**: `featuredImage`, `attachments` (array of { title, url }).
- **Access**: 
  - `accessType`: (public, members_only, paid, tier_specific).
  - `allowedTiers`: Array of strings.
- **Status**: `status` (draft, published, archived).
- **Metadata**: `author` (User ref), `views`, `helpfulCount`, `notHelpfulCount`.
- **Timestamps**: `createdAt`, `updatedAt`, `publishedAt`.

### Category Model (`src/models/Category.ts`)
- `name`, `slug`, `description`, `icon`.
- `parent`: Ref to Category (for nesting).
- `order`: Number.

## 2. Server Actions (`src/lib/actions/kb.actions.ts`)

### Admin Actions
- `createArticle(data)`
- `updateArticle(id, data)`
- `deleteArticle(id)`
- `getAdminArticles(filter)`
- `createCategory(data)`
- `getCategories()`

### User Actions
- `getArticles(filter)`
- `getArticleBySlug(slug)`
- `searchArticles(query)`
- `voteArticle(id, isHelpful)`
- `incrementViewCount(id)`

## 3. Admin Dashboard (`/admin/knowledge-base`)

### Pages
- **Articles List**: Table with status, category, author.
- **Create/Edit Article**: Rich text editor (using a library like `react-quill` or similar if available, or simple textarea for MVP).
- **Categories Manager**: Tree view or list to manage hierarchy.

## 4. Member Area (`/members/knowledge-base`)

### Pages
- **Home**: Search bar, Popular Categories, Featured Articles.
- **Category View**: List of articles in a category.
- **Article View**:
  - Breadcrumbs.
  - Content area.
  - Sidebar (Table of Contents, Related Articles).
  - Feedback section ("Was this helpful?").

## 5. Components Needed
- `ArticleCard`
- `CategoryCard`
- `SearchBox` (with debounced search)
- `FeedbackWidget`
- `RichTextEditor` (Admin side)

## 6. Future/Advanced
- AI Search Integration.
- Version History.
- Commenting System.
