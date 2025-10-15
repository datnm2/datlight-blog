'use client'

import { useLanguage } from './LanguageProvider'
import { filterPostsByLanguage } from '@/lib/utils/languageFilter'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { Blog } from 'contentlayer/generated'
import { CoreContent } from 'pliny/utils/contentlayer'

interface BlogListWrapperProps {
  allPosts: CoreContent<Blog>[]
  postsPerPage: number
}

export default function BlogListWrapper({ allPosts, postsPerPage }: BlogListWrapperProps) {
  const { locale, t } = useLanguage()

  // Filter posts by current language
  const filteredPosts = filterPostsByLanguage(allPosts as Blog[], locale) as CoreContent<Blog>[]

  const pageNumber = 1
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const initialDisplayPosts = filteredPosts.slice(0, postsPerPage * pageNumber)
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={filteredPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={t('blog.allPosts')}
    />
  )
}
