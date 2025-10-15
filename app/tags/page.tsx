import { genPageMetadata } from 'app/seo'
import TagsPageWrapper from '@/components/TagsPageWrapper'

export const metadata = genPageMetadata({ title: 'Tags', description: 'Things I blog about' })

export default async function Page() {
  return <TagsPageWrapper />
}
