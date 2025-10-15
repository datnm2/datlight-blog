import { Blog } from 'contentlayer/generated'
import { Locale } from '@/lib/i18n'
import { slug as slugify } from 'github-slugger'

/**
 * Extract the base slug without the language prefix
 * e.g., "en/software-engineering/big-o-notation" -> "software-engineering/big-o-notation"
 */
export function getBaseSlug(slug: string): string {
  const parts = slug.split('/')
  // Remove the first part (language) and return the rest
  return parts.slice(1).join('/')
}

/**
 * Find equivalent post in target language
 * @param currentSlug - Current post slug (e.g., "vi/software-engineering/big-o-notation")
 * @param targetLocale - Target language
 * @param allPosts - All blog posts
 * @returns The equivalent post in target language, or undefined if not found
 */
export function findPostInLanguage(
  currentSlug: string,
  targetLocale: Locale,
  allPosts: Blog[]
): Blog | undefined {
  const baseSlug = getBaseSlug(currentSlug)
  const targetSlug = `${targetLocale}/${baseSlug}`

  return allPosts.find((post) => post.slug === targetSlug)
}

/**
 * Check if current path is a blog post detail page
 */
export function isPostDetailPage(pathname: string): boolean {
  // Post detail pages have format: /blog/{language}/{category}/{post-name}
  // Must have at least 4 parts when split by /
  const parts = pathname.split('/').filter(Boolean)
  return parts[0] === 'blog' && parts.length >= 3
}

/**
 * Extract slug from pathname
 * e.g., "/blog/vi/software-engineering/big-o-notation" -> "vi/software-engineering/big-o-notation"
 */
export function getSlugFromPathname(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean)
  // Remove "blog" from the start
  return parts.slice(1).join('/')
}

/**
 * Check if current path is a tag detail page
 */
export function isTagDetailPage(pathname: string): boolean {
  // Tag detail pages have format: /tags/{tag}
  const parts = pathname.split('/').filter(Boolean)
  return parts[0] === 'tags' && parts.length === 2
}

/**
 * Extract tag from pathname
 * e.g., "/tags/algorithms" -> "algorithms"
 */
export function getTagFromPathname(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean)
  return parts[1] || ''
}

/**
 * Check if a tag has posts in the target language
 * @param tag - The tag slug (e.g., "algorithms")
 * @param targetLocale - Target language
 * @param allPosts - All blog posts
 * @returns true if at least one post with this tag exists in the target language
 */
export function hasTagInLanguage(tag: string, targetLocale: Locale, allPosts: Blog[]): boolean {
  return allPosts.some((post) => {
    const postLanguage = post.language || 'vi'
    return postLanguage === targetLocale && post.tags?.some((t) => slugify(t) === tag)
  })
}
