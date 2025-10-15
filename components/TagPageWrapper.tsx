'use client'

import { useMemo } from 'react'
import { useLanguage } from './LanguageProvider'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { CoreContent } from 'pliny/utils/contentlayer'
import { Blog } from 'contentlayer/generated'

interface TagPageWrapperProps {
  tag: string
  title: string
  allPosts: CoreContent<Blog>[]
  postsPerPage: number
}

export default function TagPageWrapper({
  tag,
  title,
  allPosts,
  postsPerPage,
}: TagPageWrapperProps) {
  const { locale } = useLanguage()

  // Filter posts by current language
  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const postLanguage = (post as Blog).language || 'vi'
      return postLanguage === locale
    })
  }, [allPosts, locale])

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const initialDisplayPosts = filteredPosts.slice(0, postsPerPage)
  const pagination = {
    currentPage: 1,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={filteredPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={title}
    />
  )
}
