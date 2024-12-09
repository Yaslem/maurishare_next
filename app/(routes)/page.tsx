export const dynamic = 'force-dynamic'

import { Suspense } from "react"
import AnimationWrapper from "@/app/components/AnimationWrapper"
import Loader from "@/app/components/Loader"
import InPageNavigation from "@/app/components/inPageNavigation"
import Post from "@/app/controllers/Post.server"
import { Categories } from "@/app/components/Categoties"
import { TrendingPosts } from "@/app/components/TrendingPosts"
import { PostsList } from "@/app/components/PostsList"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `${process.env.SITE_NAME} | المنصة الموريتانية الأولى للأبحاث العلمية`,
  description: process.env.SITE_DESCRIPTION,
  keywords: [
    ...process.env.SITE_KEYWORDS?.split(',') || [],
    'أبحاث علمية موريتانية',
    'دراسات أكاديمية',
    'منشورات علمية',
    'باحثين موريتانيين'
  ],
  openGraph: {
    title: process.env.SITE_NAME + " | المنصة الموريتانية الأولى للأبحاث العلمية والدراسات الأكاديمية",
    description: process.env.SITE_DESCRIPTION,
    type: "website",
    locale: "ar_MR",
    siteName: process.env.SITE_NAME,
    images: [
      {
        url: `${process.env.BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${process.env.SITE_NAME} - منصة البحث العلمي الموريتانية`,
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: process.env.SITE_NAME + " | منصة الأبحاث العلمية الموريتانية",
    description: process.env.SITE_DESCRIPTION,
    images: ["/twitter-image.jpg"],
  },
  alternates: {
    canonical: `${process.env.BASE_URL}/`,
    languages: {
      'ar-MR': '/ar',
      'fr-MR': '/fr',
    }
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  metadataBase: new URL(process.env.BASE_URL || "https://maurishare.com"),
}

async function getPosts(page = 1) {
  "use server"
  return await Post.get(page)
}

async function searchPosts(tag: string, page = 1) {
  "use server"
  return await Post.search({ tag, page })
}

export default async function HomePage() {
  const initialPosts = await Post.get()
  const trendingPosts = await Post.trending()

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        <div className="w-full">
          <InPageNavigation 
            defaultHidden={["المنشورات الشائعة"]} 
            routes={["الرئيسية", "المنشورات الشائعة"]}
            defaultActiveIndex={0}
          >
            <Suspense fallback={<Loader />}>
              <PostsList 
                initialPosts={initialPosts}
                getPosts={getPosts}
                searchPosts={searchPosts}
              />
            </Suspense>

            <Suspense fallback={<Loader />}>
              <TrendingPosts posts={trendingPosts} />
            </Suspense>
          </InPageNavigation>
        </div>

        <aside className="min-w-[40%] lg:min-w-[400px] max-w-min border-r border-grey pr-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <Categories />
            <TrendingPosts posts={trendingPosts} />
          </div>
        </aside>
      </section>
    </AnimationWrapper>
  )
}