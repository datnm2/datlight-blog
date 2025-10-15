'use client'

import { useLanguage } from './LanguageProvider'
import { languages, languageFlags, Locale } from '@/lib/i18n'
import { usePathname, useRouter } from 'next/navigation'
import { allBlogs } from 'contentlayer/generated'
import {
  isPostDetailPage,
  getSlugFromPathname,
  findPostInLanguage,
  isTagDetailPage,
  getTagFromPathname,
  hasTagInLanguage,
} from '@/lib/utils/postLanguageSwitch'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()

  const toggleLanguage = () => {
    const newLocale: Locale = locale === 'en' ? 'vi' : 'en'

    // Check if we're on a post detail page
    if (isPostDetailPage(pathname)) {
      const currentSlug = getSlugFromPathname(pathname)
      const equivalentPost = findPostInLanguage(currentSlug, newLocale, allBlogs)

      if (equivalentPost) {
        // Navigate to the equivalent post in the target language
        router.push(`/blog/${equivalentPost.slug}`)
      } else {
        // Post doesn't exist in target language, redirect to blog list
        router.push('/blog')
      }
    }
    // Check if we're on a tag detail page
    else if (isTagDetailPage(pathname)) {
      const currentTag = getTagFromPathname(pathname)
      const tagExistsInLanguage = hasTagInLanguage(currentTag, newLocale, allBlogs)

      if (!tagExistsInLanguage) {
        // Tag doesn't have posts in target language, redirect to tags list
        router.push('/tags')
      }
      // If tag exists in target language, stay on the same page
      // The page will automatically filter posts by the new language
    }

    // Always update the locale (this will update static text)
    setLocale(newLocale)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="hover:text-primary-500 dark:hover:text-primary-400 h-8 w-8 rounded p-1"
      title={`Switch to ${locale === 'en' ? 'Tiếng Việt' : 'English'}`}
      aria-label={`Switch to ${locale === 'en' ? 'Vietnamese' : 'English'}`}
    >
      <div className="flex items-center text-lg">
        <span className="mr-1">{languageFlags[locale]}</span>
        <span className="text-sm font-medium">{locale.toUpperCase()}</span>
      </div>
    </button>
  )
}
