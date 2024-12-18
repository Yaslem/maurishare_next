import { PostResponse } from "../controllers/Post.server"
import { sendResponseServer } from "../helpers/SendResponse.server"
import AnimationWrapper from "./AnimationWrapper"
import MinimalPost from "./MinimalPost"
import NoDataMessage from "./NoDataMessage"

export function TrendingPosts({ posts }: { posts: Awaited<ReturnType<typeof sendResponseServer<PostResponse[] | null>>> }) {
  if (posts.status === "error") {
    return <NoDataMessage message={posts.message} />
  }

  return (
    <div>
      <h1 className="font-medium text-xl mb-8">
        المنشورات الشائعة <i className="fi fi-rr-arrow-trend-up"></i>
      </h1>
      {posts.data && posts.data.map((post: PostResponse, i: number) => (
        <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={post.id}>
          <MinimalPost post={post} index={i} />
        </AnimationWrapper>
      ))}
    </div>
  )
}