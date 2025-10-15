import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allBlogs } from 'contentlayer/generated'
import tagData from 'app/tag-data.json'
import { notFound } from 'next/navigation'
import TagPagePaginatedWrapper from '@/components/TagPagePaginatedWrapper'

const POSTS_PER_PAGE = 5

export const generateStaticParams = async () => {
  const tagCounts = tagData as Record<string, number>
  return Object.keys(tagCounts).flatMap((tag) => {
    const postCount = tagCounts[tag]
    const totalPages = Math.max(1, Math.ceil(postCount / POSTS_PER_PAGE))
    return Array.from({ length: totalPages }, (_, i) => ({
      tag: encodeURI(tag),
      page: (i + 1).toString(),
    }))
  })
}

export default async function TagPage(props: { params: Promise<{ tag: string; page: string }> }) {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  const pageNumber = parseInt(params.page)

  // Get all posts with this tag (don't filter by language here, let client component do it)
  const allPostsWithTag = allCoreContent(
    sortPosts(allBlogs.filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)))
  )

  // Return 404 for invalid page numbers
  if (pageNumber <= 0 || isNaN(pageNumber)) {
    return notFound()
  }

  return (
    <TagPagePaginatedWrapper
      tag={tag}
      title={title}
      allPosts={allPostsWithTag}
      postsPerPage={POSTS_PER_PAGE}
      pageNumber={pageNumber}
    />
  )
}
