import { type Tag, type Activity, type Comment, type User, type SocialLinks } from "@prisma/client";


export interface Post {
  id: string;
  title: string;
  publishedAt: string;
  isPublished: boolean;
  tags: Tag[];
  banner: string;
  des: string;
  content: string;
  comments: Comment[];
  author: User;
  activities: Activity[];
}

export interface UserType extends User {
  socialLinks: SocialLinks[];
}

export interface ResponseServer<T> {
  status: "success" | "error"
  code: number
  message: string
  action: string
  data: T
}

export interface NotificationData {
  id: string;
  type: 'LIKE' | 'COMMENT' | 'REPLY';
  user: UserType;
  post: Post;
  seen: boolean;
  repliedOnComment: Comment | null;
  comment: Comment;
  reply: Comment;
  createdAt: Date;
}