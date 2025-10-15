import { Blog } from 'contentlayer/generated'
import { Locale } from '@/lib/i18n'

export function filterPostsByLanguage(posts: Blog[], locale: Locale): Blog[] {
  return posts.filter((post) => {
    // Check if post has language field, default to 'vi' if not specified
    const postLanguage = post.language || 'vi'
    return postLanguage === locale
  })
}
