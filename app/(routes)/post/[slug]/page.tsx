export const dynamic = 'force-dynamic'

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Post from "@/app/controllers/Post.server";
import { getUserAuthenticated } from "@/app/services/auth.server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { type Post as PostType } from "@prisma/client";
import ClientPost from "@/app/components/ClientPost";

async function likePost(slug: string, isLikedByUser: boolean) {
  "use server"
  const user = await getUserAuthenticated();
  if (!user) {
    redirect('/auth/signin');
  }


  const isLikeUser = await Post.getIslikeUserPost({userId: user.id, slug: decodeURIComponent(slug)})


  const response = await Post.likePost({userId: user.id, slug: decodeURIComponent(slug), isLikedByUser: !isLikeUser});
  if (response.status === "success") {
    revalidatePath(`/post/${slug}`);
  }
}

async function addCommentPost(slug: string, comment: string) {
  "use server"
  const user = await getUserAuthenticated();
  if (!user) {
    redirect('/auth/signin');
  }

  if (!user.can_create_comment) {
    redirect('/');
  }

  const response = await Post.addCommentPost({userId: user.id, slug: decodeURIComponent(slug), comment});
  if (response.status === "success") {
    revalidatePath(`/post/${slug}`);
  }
  return response;
}

async function deleteCommentPost(slug: string, commentId: string) {
  "use server"
  const user = await getUserAuthenticated();
  if (!user) {
    redirect('/auth/signin');
  }

  const response = await Post.deleteCommentPost({userId: user.id, slug: decodeURIComponent(slug), commentId});
  if (response.status === "success") {
    revalidatePath(`/post/${slug}`);
  }
  return response;
}

async function addReplyCommentPost(slug: string, data: any) {
  "use server"
  const user = await getUserAuthenticated();
  if (!user) {
    redirect('/auth/signin');
  } 

  const response = await Post.addReplyCommentPost({userId: user.id, slug: decodeURIComponent(slug), replyingTo: data.replyingTo, comment: data.comment, statusReply: data.statusReply});
  if (response.status === "success") {
    revalidatePath(`/post/${slug}`);
  }
  return response;
}   

async function loadMoreComments(slug: string, page: number) {
  "use server"
  const response = await Post.getCommentsPost({slug: decodeURIComponent(slug), page});
  if (response.status === "success") {
    return response;
  }
  return [];
}


interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug
  const response = await Post.getPostBySlug({slug: decodeURIComponent(slug)});
  if (response.status !== "success") return {};

  const {post} = response.data;
  
  return {
    title: `${post.title}`,
    description: post.des || "",
    keywords: post.tags?.join(", ") || "",
    authors: [{ name: post.author.name }],
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
    openGraph: {
        title: `${post.title} | ${process.env.SITE_NAME}`,
        description: post.des || "",
        url: `${process.env.BASE_URL}/post/${post.slug}`,
        type: "article",
        locale: "ar_MR",
        siteName: process.env.SITE_NAME,
        publishedTime: post.publishedAt?.toISOString(),
        modifiedTime: post.updatedAt?.toISOString(),
        authors: [post.author.name],
        images: [
          {
            url: post.banner || "",
            width: 1200,
            height: 630,
            alt: post.title,
            secureUrl: post.banner || "",
            type: "image/jpeg",
          }
        ],
        tags: post.tags || [],
    },
    twitter: {
        card: 'summary_large_image',
        title: `${post.title} | ${process.env.SITE_NAME}`,
        description: post.des || "",
        images: [post.banner || ""],
        creator: '@' + (post.author.twitter || process.env.TWITTER_HANDLE),
        site: '@' + process.env.TWITTER_HANDLE,
    },
    alternates: {
      canonical: `${process.env.BASE_URL}/post/${post.slug}`,
    },
  };
}

export default async function PostSlug({ params }: Props) {
  const user = await getUserAuthenticated();
  const slug = (await params).slug
  const response = await Post.getPostBySlug({slug: decodeURIComponent(slug)});
  if (response.status !== "success") notFound();

  const [isLikeUser, comments] = await Promise.all([
    user ? Post.getIslikeUserPost({userId: user.id, slug: decodeURIComponent(slug)}) : false,
    Post.getCommentsPost({slug: decodeURIComponent(slug), page: 1})
  ]);

  const {post, similar} = response.data;

  return (
    <ClientPost 
      likePost={likePost}
      addReplyCommentPost={addReplyCommentPost}
      addCommentPost={addCommentPost}
      deleteCommentPost={deleteCommentPost}
      loadMoreComments={loadMoreComments}
      post={post}
      similar={similar}
      user={user}
      isLikeUser={isLikeUser}
      initialComments={comments}
    />
  )
}