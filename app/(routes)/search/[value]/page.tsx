export const dynamic = 'force-dynamic'

import { Metadata } from 'next'
import SearchIndex from './index'
import Post from '@/app/controllers/Post.server'
import User from '@/app/controllers/User.server'

interface SearchPageProps {
  params: Promise<{ value: string }>
}

export async function generateMetadata({ params }: SearchPageProps): Promise<Metadata> {  
    const searchValue = decodeURIComponent((await params).value)
  return {
    title: `نتائج البحث عن "${searchValue}" - موقعك`,
    description: `اكتشف نتائج البحث عن "${searchValue}" في موقعنا. تصفح المقالات والمستخدمين المتعلقين.`,
    keywords: `${searchValue}, بحث, مقالات, مستخدمين`,
    openGraph: {
      title: `نتائج البحث عن "${searchValue}" - موقعك`,
      description: `اكتشف نتائج البحث عن "${searchValue}" في موقعنا. تصفح المقالات والمستخدمين المتعلقين.`,
      url: `${process.env.BASE_URL}/search/${searchValue}`,
      type: 'website',
    },
    other: {
      schema: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SearchResultsPage',
        'url': `${process.env.BASE_URL}/search/${searchValue}`,
        'name': `نتائج البحث عن "${searchValue}"`,
        'description': `اكتشف نتائج البحث عن "${searchValue}" في موقعنا. تصفح المقالات والمستخدمين المتعلقين.`,
      })
    }
  }
}

 async function searchPosts({ value, page = 1 }: { value: string, page?: number }) {
    "use server"
    return await Post.searchQuery({ value, page })
  }

 async function searchUsers({ value }: { value: string }) {
    "use server"
    return await User.searchQuery({ value })
  }

export default async function SearchPage({ params }: SearchPageProps) {
    const searchValue = decodeURIComponent((await params).value)
  const initialPosts = await searchPosts({ value: searchValue, page: 1 })
  const users = await searchUsers({ value: searchValue })

  return (
    <SearchIndex 
      onSearch={searchPosts}
      initialPosts={initialPosts}
      users={users}
      searchValue={searchValue}
    />
  )
}