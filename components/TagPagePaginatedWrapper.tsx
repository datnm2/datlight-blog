'use client'

import { useMemo } from 'react'
import { useLanguage } from './LanguageProvider'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { CoreContent } from 'pliny/utils/contentlayer'
import { Blog } from 'contentlayer/generated'
import { notFound } from 'next/navigation'

interface TagPagePaginatedWrapperProps {
  tag: string
  title: string
  allPosts: CoreContent<Blog>[]
  postsPerPage: number
  pageNumber: number
}

export default function TagPagePaginatedWrapper({
  tag,
  title,
  allPosts,
  postsPerPage,
  pageNumber,
}: TagPagePaginatedWrapperProps) {
  const { locale } = useLanguage()

  // Filter posts by current language
  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const postLanguage = (post as Blog).language || 'vi'
      return postLanguage === locale
    })
  }, [allPosts, locale])

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)

  // Return 404 for invalid page numbers or empty pages
  if (pageNumber > totalPages) {
    return notFound()
  }

  const initialDisplayPosts = filteredPosts.slice(
    postsPerPage * (pageNumber - 1),
    postsPerPage * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
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
