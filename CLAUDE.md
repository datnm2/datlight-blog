# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js blog built with Tailwind CSS v4, TypeScript, and Contentlayer for managing MDX content. The blog supports multi-language content (English and Vietnamese) with custom i18n implementation.

## Content Creation Guidelines

**IMPORTANT**: When creating, writing, or editing blog content (MDX files in `data/blog/`), you MUST refer to and follow the guidelines in `CONTENT_CREATOR_GUIDE.md`. This file contains:
- Master prompts for content creation (short and full versions)
- Minh Đạt's writing style and tone
- Content structure templates
- Writing techniques and best practices
- Checklist before publishing

Always consult `CONTENT_CREATOR_GUIDE.md` before generating any blog post content to ensure consistency with the blog's voice and quality standards.

## Development Commands

```bash
# Development
yarn dev                    # Start dev server at http://localhost:3000
yarn start                  # Alias for yarn dev

# Build & Production
yarn build                  # Build for production (runs postbuild script for tag generation)
yarn serve                  # Start production server
yarn analyze                # Build with bundle analyzer

# Code Quality
yarn lint                   # Run ESLint with auto-fix on pages, app, components, lib, layouts, scripts

# Static Export (for GitHub Pages, S3, etc.)
EXPORT=1 UNOPTIMIZED=1 yarn build              # Basic static export
EXPORT=1 UNOPTIMIZED=1 BASE_PATH=/myblog yarn build  # With base path
```

## Architecture

### Content Management with Contentlayer

- **Content sources**: `data/blog/` (blog posts), `data/authors/` (author info)
- **Document types**: `Blog` and `Authors` defined in `contentlayer.config.ts`
- **Build process**: On build, Contentlayer:
  1. Processes all MDX files from `data/` directory
  2. Generates type-safe content objects
  3. Runs `createTagCount()` to generate tag JSON files per language
  4. Runs `createSearchIndex()` to generate search documents

### Multi-language Support

This blog implements a custom i18n system (not using next-intl):

- **Supported locales**: `en` (English), `vi` (Vietnamese, default)
- **Blog post language**: Set via `language` frontmatter field in MDX files
- **UI translations**: `locales/en.json` and `locales/vi.json`
- **Language provider**: `LanguageProvider` (client-side context) stores locale in localStorage
- **Language switcher**: `LanguageSwitcher` component toggles between locales
- **Tag filtering**: Separate tag count files generated per language:
  - `app/tag-data.json` (all languages)
  - `app/tag-data-en.json` (English posts only)
  - `app/tag-data-vi.json` (Vietnamese posts only)

### Styling with Tailwind CSS v4

- **Configuration**: `css/tailwind.css` uses new v4 `@theme` directive (not `tailwind.config.js`)
- **Custom theme**: Dark green color palette in `--color-primary-*` CSS variables
- **Color system**: Uses OKLCH color space for better perceptual uniformity
- **Prose styling**: Custom `.prose` and `.prose-invert` utilities for MDX content

### Key Configuration Files

- **`data/siteMetadata.js`**: Site-wide settings (title, author, social links, analytics, comments, search, newsletter)
- **`data/headerNavLinks.ts`**: Navigation menu items
- **`data/projectsData.ts`**: Project cards on /projects page
- **`data/authors/`**: Author profiles (MDX files)
- **`data/blog/`**: Blog posts (MDX files with nested routing support)
- **`data/logo.svg`**: Site logo (SVG with dark green theme)

### MDX Processing Pipeline

Configured in `contentlayer.config.ts`:

**Remark plugins** (markdown processing):
- `remarkGfm` - GitHub Flavored Markdown
- `remarkMath` - Math equations
- `remarkAlert` - GitHub-style alerts
- `remarkCodeTitles` - Code block titles
- `remarkImgToJsx` - Convert images to next/image

**Rehype plugins** (HTML processing):
- `rehypeSlug` - Add IDs to headings
- `rehypeAutolinkHeadings` - Add anchor links to headings
- `rehypeKatex` - Render math with KaTeX
- `rehypeCitation` - Bibliography support
- `rehypePrismPlus` - Syntax highlighting with line numbers

### Layout System

Three blog post layouts in `layouts/`:
- **`PostLayout`** - Default 2-column layout with meta and author info
- **`PostSimple`** - Simplified single-column layout
- **`PostBanner`** - Layout with banner image

Two listing layouts:
- **`ListLayout`** - V1 style with search bar
- **`ListLayoutWithTags`** - V2 style with tag sidebar (current default)

### Blog Post Frontmatter Schema

```yaml
title: string (required)
date: date (required)
tags: string[] (optional)
lastmod: date (optional)
draft: boolean (optional)
summary: string (optional)
images: string[] (optional)
authors: string[] (optional, maps to files in data/authors/)
layout: string (optional: PostLayout, PostSimple, PostBanner)
canonicalUrl: string (optional)
language: string (optional, default: "vi")
```

### Integrations

- **Analytics**: Umami (configured via `NEXT_UMAMI_ID` env var)
- **Comments**: Giscus (configured via `NEXT_PUBLIC_GISCUS_*` env vars)
- **Newsletter**: Buttondown
- **Search**: Kbar with local search index

## Important Notes

- Uses **yarn** as package manager (v3.6.1)
- Built on **Next.js 15** with App Router (not Pages Router)
- **React Server Components** are used extensively
- Contentlayer generates `.contentlayer/` directory (gitignored)
- **Husky** + **lint-staged** run on pre-commit
- The default blog post language is Vietnamese (`vi`), not English

## Critical Patterns & Conventions

### URL Encoding for Vietnamese Tags

**CRITICAL**: When working with tag URLs, Vietnamese characters (and any non-ASCII characters) need careful handling for Next.js routing.

**Problem**: Tags with Vietnamese diacritics like `'tâm-lý-học'` or `'tỉnh-thức'` need special handling because:
1. Next.js automatically URL-encodes hrefs in production (but not in development)
2. Using manual encoding (like `encodeURIComponent`) causes double-encoding in production
3. The generated paths become URL-encoded folders like `t%C3%A2m-l%C3%BD-h%E1%BB%8Dc`

**Solution Pattern**:
```typescript
// ✅ CORRECT - Let Next.js handle encoding automatically
<Link href={`/tags/${tagName}`}>

// ❌ WRONG - Don't manually encode, it causes double-encoding in production
<Link href={`/tags/${encodeURIComponent(tagName)}`}>
```

**Files that handle tag URLs** (all must pass raw tag values):
- `components/Tag.tsx` - Individual tag component
- `layouts/ListLayoutWithTags.tsx` - Sidebar tag navigation
- `components/TagsPageWrapper.tsx` - Tags page grid
- `app/tags/[tag]/page.tsx` - Tag page route (pass raw `tag` in `generateStaticParams`)
- `app/tags/[tag]/page/[page]/page.tsx` - Paginated tag pages (pass raw `tag` in `generateStaticParams`)

**In generateStaticParams**:
```typescript
// ✅ CORRECT - Return raw tag values
export const generateStaticParams = async () => {
  return tagKeys.map((tag) => ({ tag: tag }))
}

// ❌ WRONG - Don't encode in generateStaticParams
export const generateStaticParams = async () => {
  return tagKeys.map((tag) => ({ tag: encodeURI(tag) }))
}
```

**When comparing tag from URL pathname**:
```typescript
// ✅ CORRECT - Use decodeURIComponent and compare with original tag
const currentTag = decodeURIComponent(pathname.split('/tags/')[1] || '')
if (currentTag === tagName) { /* active state */ }
```

**Tag data files reference**: Tags are stored in their original form (with diacritics) in:
- `app/tag-data.json` - All tags across all languages
- `app/tag-data-en.json` - English tags only
- `app/tag-data-vi.json` - Vietnamese tags only

