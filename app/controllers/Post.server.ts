import { sendResponseServer } from "../helpers/SendResponse.server";
import db from "@/app/helpers/db";
import FileStorage from "@/app/helpers/Upload.server";
import { nanoid } from "nanoid";
import {type Tag } from "@prisma/client";
import { userResponse } from "./User.server";

export interface PostResponse {
    id: string;
    title: string;
    slug: string;
    banner: string | null;
    des: string | null;
    isPublished: boolean;
    publishedAt: Date;
    content: string | null;
    updatedAt: Date;
    author: {
        id: string;
        name: string;
        username: string;
        photo: string;
        socialLinks: {
            youtube: string;
            instagram: string;
            facebook: string;
            twitter: string;
            website: string;
        } | null;
    };
    tags: Tag[];
    activity: {
        totalLikes: number;
        totalComments: number;
        totalReads: number;
    } | null;
}

export interface CommentResponse {
    id: string;
    content: string;
    createdAt: Date;
    commentedBy: {
        name: string;
        username: string;
        photo: string;
    } | null;
    postAuthor: {
        name: string;
        username: string;
        photo: string;
    } | null;
    parent: CommentResponse | null;
    children: CommentResponse[];
}

export default class Post {
    static async uploadImg(image: File) {
        const folder = "posts"
        const filename = Date.now() + image.name.replaceAll(" ", "_").replaceAll("-", "_");
        await FileStorage.upload({ folder, file: image, filename })
        return `${folder}/${filename}`
    }
    static async uploadImgPost(image: File) {
        const folder = "posts"
        const filename = Date.now() + image.name.replaceAll(" ", "_").replaceAll("-", "_");
        await FileStorage.upload({ folder, file: image, filename })
        return `${folder}/${filename}`
    }
    static async get(page = 1) {
        const maxLimit = 5
        const count = await db.post.count({
            where: {
                draft: false,
                isPublished: true,
            },
        })
        const posts = await db.post.findMany({
            where: {
                draft: false,
                isPublished: true,
            },
            select: {
                id: true,
                title: true,
                slug: true,
                banner: true,
                des: true,
                isPublished: true,
                publishedAt: true,
                content: true,
                updatedAt: true,
                activity: true,
                tags: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                author: {
                    select: {
                        id: true,
                        photo: true,
                        username: true,
                        name: true,
                        socialLinks: true,
                    }
                }
            },
            orderBy: [
                {
                    activity: {
                        totalReads: "asc"
                    }
                },
                {
                    activity: {
                        totalLikes: "asc"
                    }
                },
                {
                    publishedAt: "asc"
                }
            ],
            take: maxLimit,
            skip: (page - 1) * maxLimit,
        })
        if (posts.length) {
            return sendResponseServer<{results: PostResponse[], count: number, page: number}>({ status: "success", action: "getPosts", code: 200, data: { results: posts, count, page }, message: "تم جلب المنشورات بنجاح 👍" })
        }
        return sendResponseServer<null>({ status: "error", action: "getPosts", code: 404, data: null, message: "لا توجد منشورات" })
    }
    static async getPostsByUsername({ page = 1, username }: { page: number, username: string }) {
        const maxLimit = 5
        const count = await db.post.count({
            where: {
                draft: false,
                author: {
                    username
                }
            },
        })
        const posts = await db.post.findMany({
            where: {
                draft: false,
                author: {
                    username
                }
            },
            select: {
                id: true,
                title: true,
                slug: true,
                banner: true,
                des: true,
                isPublished: true,
                publishedAt: true,
                content: true,
                updatedAt: true,
                activity: {
                    select: {
                        totalComments: true,
                        totalLikes: true,
                        totalReads: true,
                    }
                },
                tags: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                author: {
                    select: {
                        id: true,
                        photo: true,
                        username: true,
                        name: true,
                        socialLinks: true,
                    }
                }
            },
            orderBy: [
                {
                    activity: {
                        totalReads: "asc"
                    }
                },
                {
                    activity: {
                        totalLikes: "asc"
                    }
                },
                {
                    publishedAt: "asc"
                }
            ],
            take: maxLimit,
            skip: (page - 1) * maxLimit,
        })
        if (posts.length) {
            return sendResponseServer<{results: PostResponse[], count: number, page: number}>({ status: "success", action: "getPostsByUsername", code: 200, data: { results: posts, count, page }, message: "تم جلب المنشورات بنجاح 👍" })
        }
        return sendResponseServer<null>({ status: "error", action: "getPostsByUsername", code: 404, data: null, message: "لا توجد منشورات" })
    }
    static async getPostsByAdmin({ page = 1 }: { page: number }) {
        const maxLimit = 5
        const count = await db.post.count({
            where: {
                draft: false,
            },
        })
        const posts = await db.post.findMany({
            where: {
                draft: false,
            },
            select: {
                id: true,
                title: true,
                slug: true,
                banner: true,
                des: true,
                content: true,
                updatedAt: true,
                isPublished: true,
                publishedAt: true,
                activity: {
                    select: {
                        totalComments: true,
                        totalLikes: true,
                        totalReads: true,
                    }
                },
                tags: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                author: {
                    select: {
                        id: true,
                        photo: true,
                        username: true,
                        name: true,
                        socialLinks: true,
                    }
                }
            },
            orderBy: [
                {
                    activity: {
                        totalReads: "asc"
                    }
                },
                {
                    activity: {
                        totalLikes: "asc"
                    }
                },
                {
                    publishedAt: "asc"
                }
            ],
            take: maxLimit,
            skip: (page - 1) * maxLimit,
        })
        if (posts.length) {
            return sendResponseServer<{results: PostResponse[], count: number, page: number}>({ status: "success", action: "getPostsByAdmin", code: 200, data: { results: posts, count, page }, message: "تم جلب المنشورات بنجاح 👍" })
        }
        return sendResponseServer<null>({ status: "error", action: "getPostsByAdmin", code: 404, data: null, message: "لا توجد منشورات" })
    }
    static async getPostsDraftByUsername({ page = 1, username }: { page: number, username: string }) {
        const maxLimit = 5
        const count = await db.post.count({
            where: {
                draft: true,
                author: {
                    username
                }
            },
        })
        const posts = await db.post.findMany({
            where: {
                draft: true,
                author: {
                    username
                }
            },
            select: {
                id: true,
                title: true,
                slug: true,
                banner: true,
                des: true,
                content: true,
                updatedAt: true,
                isPublished: true,
                publishedAt: true,
                activity: {
                    select: {
                        totalComments: true,
                        totalLikes: true,
                        totalReads: true,
                    }
                },
                tags: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                author: {
                    select: {
                        id: true,
                        photo: true,
                        username: true,
                        name: true,
                        socialLinks: true,
                    }
                }
            },
            orderBy: [
                {
                    activity: {
                        totalReads: "asc"
                    }
                },
                {
                    activity: {
                        totalLikes: "asc"
                    }
                },
                {
                    publishedAt: "asc"
                }
            ],
            take: maxLimit,
            skip: (page - 1) * maxLimit,
        })
        if (posts.length) {
            return sendResponseServer<{results: PostResponse[], count: number, page: number}>({ status: "success", action: "getPostsDraftByUsername", code: 200, data: { results: posts, count, page }, message: "تم جلب المنشورات بنجاح 👍" })
        }
        return sendResponseServer<null>({ status: "error", action: "getPostsDraftByUsername", code: 404, data: null, message: "لا توجد منشورات" })
    }
    static async getPostsDraftByAdmin({ page = 1 }: { page: number }) {
        const maxLimit = 5
        const count = await db.post.count({
            where: {
                draft: true,
            },
        })
        const posts = await db.post.findMany({
            where: {
                draft: true
            },
            select: {
                id: true,
                title: true,
                slug: true,
                banner: true,
                des: true,
                content: true,
                updatedAt: true,
                isPublished: true,
                publishedAt: true,
                activity: {
                    select: {
                        totalComments: true,
                        totalLikes: true,
                        totalReads: true,
                    }
                },
                tags: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                author: {
                    select: {
                        id: true,
                        photo: true,
                        username: true,
                        name: true,
                        socialLinks: true,
                    }
                }
            },
            orderBy: [
                {
                    activity: {
                        totalReads: "asc"
                    }
                },
                {
                    activity: {
                        totalLikes: "asc"
                    }
                },
                {
                    publishedAt: "asc"
                }
            ],
            take: maxLimit,
            skip: (page - 1) * maxLimit,
        })
        if (posts.length) {
            return sendResponseServer<{results: PostResponse[], count: number, page: number}>({ status: "success", action: "getPostsDraftByAdmin", code: 200, data: { results: posts, count, page }, message: "تم جلب المنشورات بنجاح 👍" })
        }
        return sendResponseServer<null>({ status: "error", action: "getPostsDraftByAdmin", code: 404, data: null, message: "لا توجد منشورات" })
    }
    static async getPostBySlug({ slug }: { slug: string }) {
        const getPost = await db.post.findFirst({
            where: {
                draft: false,
                slug,
                isPublished: true
            },
            select: {
                id: true,
                author: {
                    select: {
                        username: true,
                        name: true,
                        photo: true,
                        socialLinks: true,
                        account: {
                            select: {
                                totalReads: true
                            }
                        }
                    }
                },
                activity: {
                    select: {
                        totalReads: true
                    }
                },
                tags: true,
            }
        })
        if (getPost) {
            const totalReads = getPost.activity?.totalReads || 0
            await db.post.update({
                where: {
                    id: getPost.id,
                },
                data: {
                    activity: {
                        update: {
                            totalReads: (totalReads + 1)
                        }
                    }
                }
            })
            const userTotalReads = getPost.author?.account?.totalReads || 0
            await db.user.update({
                where: {
                    username: getPost.author.username
                },
                data: {
                    account: {
                        update: {
                            totalReads: (userTotalReads + 1)
                        }
                    }
                }
            })
            const post = await db.post.findUnique({
                where: {
                    id: getPost.id
                },
                select: {
                    id: true,
                    content: true,
                    title: true,
                    slug: true,
                    des: true,
                    updatedAt: true,
                    isPublished: true,
                    banner: true,
                    activity: {
                        select: {
                            id: true,
                            totalComments: true,
                            totalLikes: true,
                            totalReads: true
                        }
                    },
                    tags: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                publishedAt: true,
                author: {
                    select: {
                        id: true,
                        photo: true,
                        username: true,
                        name: true,
                        socialLinks: true,
                    }
                },
                },
            })
            const tagsNames: string[] = []
            post?.tags.map((tag: Tag) => tagsNames.push(tag.name))
            const similar = await db.post.findMany({
                where: {
                    draft: false,
                    isPublished: true,
                    tags: {
                        some: {
                            name: {
                                in: tagsNames
                            }
                        }
                    },
                    NOT: {
                        id: post?.id
                    },
                },
                select: {
                    id: true,
                    content: true,
                    updatedAt: true,
                    title: true,
                    slug: true,
                    des: true,
                    isPublished: true,
                    banner: true,
                    activity: true,
                    tags: true,
                    publishedAt: true,
                    author: {
                        select: {
                            id: true,
                            photo: true,
                            username: true,
                            name: true,
                            socialLinks: true,
                        }
                    }
                },
                orderBy: {
                    publishedAt: "asc"
                },
                take: 5,
            })
            if (post) {
                return sendResponseServer<{post: PostResponse, similar: PostResponse[]}>({ status: "success", action: "getPostBySlug", code: 200, data: { post, similar }, message: "تم جلب المنشور بنجاح 👍" })
            }
        }
        return sendResponseServer<null>({ status: "error", action: "getPostBySlug", code: 404, data: null, message: "لا يوجد هذا المنشور" })
    }
    static async getPostById({ id }: { id: string }) {
        const getPost = await db.post.findUnique({
            where: {
                id,
            },
            select: {
                id: true
            }
        })
        if (getPost) {
            const post = await db.post.findUnique({
                where: {
                    id: getPost.id
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            photo: true,
                            username: true,
                            name: true,
                            socialLinks: true,
                        }
                    },
                    tags: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    activity: true
                }
            })
            if (post) {
                return sendResponseServer<PostResponse>({ status: "success", action: "getPostById", code: 200, data: post, message: "تم جلب المنشور بنجاح 👍" })
            }
        }
        return sendResponseServer<null>({ status: "error", action: "getPostById", code: 404, data: null, message: "لا يوجد هذا المنشور" })
    }
    static async likePost({ slug, userId, isLikedByUser }: { slug: string, userId: string, isLikedByUser: boolean }) {
        const getPost = await db.post.findFirst({
            where: {
                slug,
                draft: false
            },
            select: {
                id: true,
                activity: {
                    select: {
                        totalLikes: true
                    }
                },
                author: {
                    select: {
                        id: true
                    }
                }
            }
        })
        if (getPost) {
            const totalLikes = (getPost.activity?.totalLikes || 0) + (isLikedByUser ? 1 : -1)
            const post = await db.post.update({
                where: {
                    id: getPost.id
                },
                data: {
                    activity: {
                        update: {
                            totalLikes
                        }
                    },
                }
            })
            if (isLikedByUser) {
                await db.notification.create({
                    data: {
                        type: "LIKE",
                        notificationFor: {
                            connect: { id: getPost.author.id }
                        },
                        user: {
                            connect: { id: userId }
                        },
                        post: {
                            connect: { id: getPost.id }
                        }
                    }
                })
            } else {
                const notification = await db.notification.findFirst({
                    where: {
                        type: "LIKE",
                        postId: getPost.id,
                        userId
                    },
                    select: {
                        id: true
                    }
                })
                await db.notification.delete({
                    where: {
                        id: notification?.id
                    },
                })
            }
            if (post) {
                return sendResponseServer<null>({ status: "success", action: "likePost", code: 200, data: null, message: "تم الإعجاب بالمنشور بنجاح 👍" })
            }
        }
        return sendResponseServer<null>({ status: "error", action: "likePost", code: 404, data: null, message: "لا يوجد هذا المنشور" })
    }
    static async addCommentPost({ slug, userId, comment }: { slug: string, userId: string, comment: string }) {
        const getPost = await db.post.findFirst({
            where: {
                slug,
                draft: false
            },
            select: {
                id: true,
                activity: {
                    select: {
                        totalComments: true,
                        totalParentComments: true,
                    }
                },
                author: {
                    select: {
                        id: true
                    }
                }
            }
        })
        if (getPost) {
            if (!comment.length) {
                return sendResponseServer<null>({ status: "error", action: "addCommentPost", code: 400, data: null, message: "محتوى التعليق مطلوب" })
            }
            const getComment = await db.comment.create({
                data: {
                    post: {
                        connect: { id: getPost.id }
                    },
                    postAuthor: {
                        connect: { id: getPost.author.id }
                    },
                    commentedBy: {
                        connect: { id: userId }
                    },
                    content: comment
                }
            })
            const totalComments = getPost.activity?.totalComments || 0
            const totalParentComments = getPost.activity?.totalParentComments || 0
            const post = await db.post.update({
                where: {
                    id: getPost.id
                },
                data: {
                    activity: {
                        update: {
                            totalComments: (totalComments + 1),
                            totalParentComments: (totalParentComments + 1),
                        }
                    },
                }
            })

            await db.notification.create({
                data: {
                    type: "COMMENT",
                    notificationFor: {
                        connect: { id: getPost.author.id }
                    },
                    user: {
                        connect: { id: userId }
                    },
                    post: {
                        connect: { id: getPost.id }
                    },
                    comment: {
                        connect: { id: getComment.id }
                    }
                }
            })
            if (post) {
                const comment = await db.comment.findUnique({
                    where: {
                        id: getComment.id,
                    },
                    include: {
                        commentedBy: true,
                        postAuthor: true,
                        parent: {
                            include: {
                                commentedBy: true,
                                postAuthor: true
                            }
                        },
                        children: {
                            include: {
                                commentedBy: true,
                                postAuthor: true
                            }
                        }
                    }
                });
                if (comment) {
                    const formattedComment: CommentResponse = {
                        ...comment,
                        parent: comment.parent ? {
                            id: comment.parent.id,
                            content: comment.parent.content,
                            createdAt: comment.parent.createdAt,
                            commentedBy: comment.parent.commentedBy ? {
                                name: comment.parent.commentedBy.name,
                                username: comment.parent.commentedBy.username,
                                photo: comment.parent.commentedBy.photo
                            } : null,
                            postAuthor: comment.parent.postAuthor ? {
                                name: comment.parent.postAuthor.name,
                                username: comment.parent.postAuthor.username,
                                photo: comment.parent.postAuthor.photo
                            } : null,
                            parent: null,
                            children: []
                        } : null,
                        children: comment.children.map(child => ({
                            id: child.id,
                            content: child.content,
                            createdAt: child.createdAt,
                            commentedBy: child.commentedBy ? {
                                name: child.commentedBy.name,
                                username: child.commentedBy.username,
                                photo: child.commentedBy.photo
                            } : null,
                            postAuthor: child.postAuthor ? {
                                name: child.postAuthor.name,
                                username: child.postAuthor.username,
                                photo: child.postAuthor.photo
                            } : null,
                            parent: null,
                            children: []
                        }))
                    };
                    return sendResponseServer<CommentResponse>({ status: "success", action: "addCommentPost", code: 200, data: formattedComment, message: "تم التعليق على المنشور بنجاح 👍" });
                }
                return sendResponseServer<null>({ status: "error", action: "addCommentPost", code: 404, data: null, message: "فشل إضافة التعليق" });
            }
        }
        return sendResponseServer<null>({ status: "error", action: "addCommentPost", code: 404, data: null, message: "لا يوجد هذا المنشور" })
    }
    static async addReplyCommentPost({ slug, userId, replyingTo, comment, statusReply = "reply" }: { slug: string, userId: string, replyingTo: string, comment: string, statusReply: "reply" | "repliedOnComment" }) {
        const getPost = await db.post.findFirst({
            where: {
                slug,
                draft: false
            },
            select: {
                id: true,
                activity: {
                    select: {
                        totalComments: true,
                        totalParentComments: true,
                    }
                },
                author: {
                    select: {
                        id: true
                    }
                }
            }
        })
        if (getPost) {
            if (!comment.length) {
                return sendResponseServer<null>({ status: "error", action: "addReplyCommentPost", code: 400, data: null, message: "محتوى التعليق مطلوب" })
            }
            if (!replyingTo.length) {
                return sendResponseServer<null>({ status: "error", action: "addReplyCommentPost", code: 400, data: null, message: "التعليق المردود عليه مطلوب" })
            }
            const getComment = await db.comment.create({
                data: {
                    post: {
                        connect: { id: getPost.id }
                    },
                    postAuthor: {
                        connect: { id: getPost.author.id }
                    },
                    commentedBy: {
                        connect: { id: userId }
                    },
                    content: comment,
                    parent: {
                        connect: { id: replyingTo }
                    }
                },
                include: {
                    commentedBy: true,
                    parent: {
                        select: {
                            commentedBy: true
                        }
                    }
                }
            })
            const totalComments = getPost.activity?.totalComments || 0
            const totalParentComments = getPost.activity?.totalParentComments || 0
            const post = await db.post.update({
                where: {
                    id: getPost.id
                },
                data: {
                    activity: {
                        update: {
                            totalComments: (totalComments + 1),
                            totalParentComments: (totalParentComments + 1),
                        }
                    },
                }
            })

            if(statusReply === "reply"){
                await db.notification.create({
                    data: {
                        type: "REPLY",
                        notificationFor: {
                            connect: { id: getComment.parent?.commentedBy?.id }
                        },
                        user: {
                            connect: { id: userId }
                        },
                        post: {
                            connect: { id: getPost.id }
                        },
                        reply: {
                            connect: { id: getComment.id }
                        }
                    }
                })
            } else if(statusReply === "repliedOnComment") {
                await db.notification.create({
                    data: {
                        type: "REPLY",
                        notificationFor: {
                            connect: { id: getComment.parent?.commentedBy?.id }
                        },
                        user: {
                            connect: { id: userId }
                        },
                        post: {
                            connect: { id: getPost.id }
                        },
                        repliedOnComment: {
                            connect: { id: getComment.id }
                        }
                    }
                })
            }
            if (post) {
                const comment = await db.comment.findUnique({
                    where: {
                        id: getComment.id
                    },
                    include: {
                        commentedBy: true,
                        postAuthor: true,
                        parent: {
                            include: {
                                commentedBy: true,
                                postAuthor: true
                            }
                        },
                        children: {
                            include: {
                                commentedBy: true,
                                postAuthor: true
                            }
                        }
                    }
                })
                if (comment) {
                    const formattedComment: CommentResponse = {
                        ...comment,
                        parent: comment.parent ? {
                            id: comment.parent.id,
                            content: comment.parent.content,
                            createdAt: comment.parent.createdAt,
                            commentedBy: comment.parent.commentedBy ? {
                                name: comment.parent.commentedBy.name,
                                username: comment.parent.commentedBy.username,
                                photo: comment.parent.commentedBy.photo
                            } : null,
                            postAuthor: comment.parent.postAuthor ? {
                                name: comment.parent.postAuthor.name,
                                username: comment.parent.postAuthor.username,
                                photo: comment.parent.postAuthor.photo
                            } : null,
                            parent: null,
                            children: []
                        } : null,
                        children: comment.children.map(child => ({
                            id: child.id,
                            content: child.content,
                            createdAt: child.createdAt,
                            commentedBy: child.commentedBy ? {
                                name: child.commentedBy.name,
                                username: child.commentedBy.username,
                                photo: child.commentedBy.photo
                            } : null,
                            postAuthor: child.postAuthor ? {
                                name: child.postAuthor.name,
                                username: child.postAuthor.username,
                                photo: child.postAuthor.photo
                            } : null,
                            parent: null,
                            children: []
                        }))
                    };  
                    return sendResponseServer<CommentResponse>({ status: "success", action: "addReplyCommentPost", code: 200, data: formattedComment, message: "تم الرد على التعليق بنجاح 👍" })
                }
                return sendResponseServer<null>({ status: "error", action: "addReplyCommentPost", code: 404, data: null, message: "فشل إضافة الرد" });
            }
        }
        return sendResponseServer<null>({ status: "error", action: "addReplyCommentPost", code: 404, data: null, message: "لا يوجد هذا التعليق" })
    }
    static async deleteCommentPost({ slug, userId, commentId }: { slug: string, userId: string, commentId: string }) {
        const getPost = await db.post.findFirst({
            where: {
                slug,
                draft: false
            },
            select: {
                id: true,
                activity: {
                    select: {
                        totalComments: true,
                        totalParentComments: true,
                    }
                },
                author: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        })
        if (getPost) {
            if (!commentId.length) {
                return sendResponseServer<null>({ status: "error", action: "deleteCommentPost", code: 400, data: null, message: "معرف التعليق مطلوب" })
            }
            const comment = await db.comment.findUnique({
                where: {
                    id: commentId
                },
                select: {
                    id: true,
                    children: {
                        select: {
                            id: true,
                            children: true
                        },
                    },
                    commentedBy: true
                },
            })
            if (userId) {
                if (userId === comment?.commentedBy?.id || userId === getPost.author.id) {
                    const totalComments = getPost.activity?.totalComments || 0
                    const totalParentComments = getPost.activity?.totalParentComments || 0
                    if (comment?.children.length) {
                        if (comment.children[0]?.children?.length) {
                            await db.comment.delete({
                                where: {
                                    id: comment?.id
                                }
                            })
                            await db.post.update({
                                where: {
                                    id: getPost.id
                                },
                                data: {
                                    activity: {
                                        update: {
                                            totalComments: (totalComments - 3),
                                            totalParentComments: (totalParentComments - 3),
                                        }
                                    },
                                }
                            })
                        } else {
                            await db.comment.delete({
                                where: {
                                    id: comment?.id
                                }
                            })
                            await db.post.update({
                                where: {
                                    id: getPost.id
                                },
                                data: {
                                    activity: {
                                        update: {
                                            totalComments: (totalComments - 2),
                                            totalParentComments: (totalParentComments - 2),
                                        }
                                    },
                                }
                            })
                        }
                    } else {
                        await db.comment.delete({
                            where: {
                                id: comment?.id
                            }
                        })
                        await db.post.update({
                            where: {
                                id: getPost.id
                            },
                            data: {
                                activity: {
                                    update: {
                                        totalComments: (totalComments - 1),
                                        totalParentComments: (totalParentComments - 1),
                                    }
                                },
                            }
                        })
                    }
                } else {
                    return sendResponseServer<null>({ status: "success", action: "deleteCommentPost", code: 400, data: null, message: "لا يمكنك حذف التعليق" })
                }
            } else {
                return sendResponseServer<null>({ status: "success", action: "deleteCommentPost", code: 400, data: null, message: "يرجى تسجيل الدخول" })
            }

            return sendResponseServer<null>({ status: "success", action: "deleteCommentPost", code: 200, data: null, message: "تم حذف التعليق بنجاح 👍" })
        }
        return sendResponseServer<null>({ status: "error", action: "deleteCommentPost", code: 404, data: null, message: "لا يوجد هذا التعليق" })
    }
    static async getIslikeUserPost({ slug, userId }: { slug: string, userId: string }) {
        const getPost = await db.post.findFirst({
            where: {
                slug,
                draft: false
            },
            select: {
                id: true,
            }
        })
        if (getPost) {
            const isLikeUser = await db.notification.findFirst({
                where: {
                    type: "LIKE",
                    postId: getPost.id,
                    userId
                },
            })
            return isLikeUser ? true : false
        }
        return false
    }
    static async getCommentsPost({ slug, page = 1 }: { slug: string, page: number }) {
        const maxLimit = 5
        const getPost = await db.post.findFirst({
            where: {
                slug,
                draft: false
            },
            select: {
                id: true,
            }
        })
        if (getPost) {
            const count = await db.comment.count({
                where: {
                    parent: null,
                    postId: getPost.id,
                },
            })
            const comments = await db.comment.findMany({
                where: {
                    parent: null,
                    postId: getPost.id,
                },
                select: {
                    id: true,
                    content: true,
                    commentedBy: {
                        select: {
                            name: true,
                            username: true,
                            photo: true
                        }
                    },
                    postAuthor: {
                        select: {
                            name: true,
                            username: true,
                            photo: true
                        }
                    },
                    children: {
                        select: {
                            id: true,
                            content: true,
                            commentedBy: {
                                select: {
                                    name: true,
                                    username: true,
                                    photo: true
                                }
                            },
                            postAuthor: {
                                select: {
                                    name: true,
                                    username: true,
                                    photo: true
                                }
                            },
                            children: {
                                select: {
                                    id: true,
                                    content: true,
                                    commentedBy: {
                                        select: {
                                            name: true,
                                            username: true,
                                            photo: true
                                        }
                                    },
                                    postAuthor: {
                                        select: {
                                            name: true,
                                            username: true,
                                            photo: true
                                        }
                                    },
                                    children: true,
                                    parent: true,
                                    createdAt: true
                                },
                                orderBy: {
                                    createdAt: "desc"
                                },
                            },
                            parent: true,
                            createdAt: true
                        },
                        orderBy: {
                            createdAt: "desc"
                        },
                    },
                    parent: true,
                    createdAt: true,

                },
                orderBy: {
                    createdAt: "desc"
                },
                take: maxLimit,
                skip: (page - 1) * maxLimit,
            })
            if (comments.length) {
                const formattedComments: CommentResponse[] = comments.map(comment => ({
                    id: comment.id,
                    content: comment.content,
                    createdAt: comment.createdAt,
                    commentedBy: comment.commentedBy,
                    postAuthor: comment.postAuthor,
                    parent: null,
                    children: comment.children.map(child => ({
                        id: child.id,
                        content: child.content,
                        createdAt: child.createdAt,
                        commentedBy: child.commentedBy,
                        postAuthor: child.postAuthor,
                        parent: null,
                        children: []
                    }))
                }));
                return sendResponseServer<{ results: CommentResponse[], count: number, page: number }>({ status: "success", action: "getCommentsPost", code: 200, data: { results: formattedComments, count, page }, message: "تم جلب تعليقات المنشور بنجاح 👍" })
            }
        }
        return sendResponseServer<null>({ status: "error", action: "getCommentsPost", code: 404, data: null, message: "لا توجد تعليقات" })
    }
    static async search({ tag, page = 1 }: { tag: string, page: number }) {
        const maxLimit = 5
        const count = await db.post.count({
            where: {
                draft: false,
                isPublished: true,
                tags: {
                    some: {
                        name: {
                            contains: tag
                        }
                    }
                },
            },
        })
        const posts = await db.post.findMany({
            where: {
                draft: false,
                isPublished: true,
                tags: {
                    some: {
                        name: {
                            contains: tag
                        }
                    }
                },
            },
            select: {
                id: true,
                title: true,
                slug: true,
                des: true,
                isPublished: true,
                content: true,
                updatedAt: true,
                banner: true,
                activity: true,
                tags: true,
                publishedAt: true,
                author: {
                    select: {
                        id: true,
                        photo: true,
                        username: true,
                        name: true,
                        socialLinks: true
                    }
                }
            },
            orderBy: [
                {
                    activity: {
                        totalReads: "asc"
                    }
                },
                {
                    activity: {
                        totalLikes: "asc"
                    }
                },
                {
                    publishedAt: "asc"
                }
            ],
            take: maxLimit,
            skip: (page - 1) * maxLimit
        })
        if (posts.length) {
            return sendResponseServer<{ results: PostResponse[], count: number, page: number }>({ status: "success", action: "searchPost", code: 200, data: { results: posts, count, page }, message: "تم جلب المنشورات بنجاح 👍" })
        }
        return sendResponseServer<null>({ status: "error", action: "searchPost", code: 404, data: null, message: "لا توجد منشورات" })
    }
    static async searchQuery({ value, page = 1 }: { value: string, page: number }) {
        const maxLimit = 5
        const count = await db.post.count({
            where: {
                draft: false,
                isPublished: true,
                title: {
                    contains: value
                },
            },
        })
        const posts = await db.post.findMany({
            where: {
                draft: false,
                isPublished: true,
                title: {
                    contains: value
                },
            },
            select: {
                id: true,
                title: true,
                slug: true,
                des: true,
                content: true,
                updatedAt: true,
                isPublished: true,
                banner: true,
                activity: {
                    select: {
                        totalComments: true,
                        totalLikes: true,
                        totalReads: true,
                    }
                },
                tags: true,
                publishedAt: true,
                author: {
                    select: {
                        id: true,
                        photo: true,
                        username: true,
                        name: true,
                        socialLinks: true
                    }
                }
            },
            orderBy: [
                {
                    activity: {
                        totalReads: "asc"
                    }
                },
                {
                    activity: {
                        totalLikes: "asc"
                    }
                },
                {
                    publishedAt: "asc"
                }
            ],
            take: maxLimit,
            skip: (page - 1) * maxLimit
        })
        if (posts.length) {
            return sendResponseServer<{ results: PostResponse[], count: number, page: number }>({ status: "success", action: "searchQueryPost", code: 200, data: { results: posts, count, page }, message: "تم جلب المنشورات بنجاح 👍" })
        }
        return sendResponseServer<null>({ status: "error", action: "searchQueryPost", code: 404, data: null, message: "لا توجد منشورات" })
    }
    static async searchQueryByUser({user, value, page = 1 }: { value: string, page: number, user: userResponse }) {
        const maxLimit = 5
        const count = await db.post.count({
            where: {
                draft: false,
                isPublished: true,
                authorId: user.id,
                title: {
                    contains: value
                },
            },
        })
        const posts = await db.post.findMany({
            where: {
                draft: false,
                isPublished: true,
                authorId: user.id,
                title: {
                    contains: value
                },
            },
            select: {
                id: true,
                title: true,
                slug: true,
                des: true,
                content: true,
                updatedAt: true,
                isPublished: true,
                banner: true,
                activity: {
                    select: {
                        totalComments: true,
                        totalLikes: true,
                        totalReads: true,
                    }
                },
                tags: true,
                publishedAt: true,
                author: {
                    select: {
                        id: true,
                        photo: true,
                        username: true,
                        name: true,
                        socialLinks: true
                    }
                }
            },
            orderBy: [
                {
                    activity: {
                        totalReads: "asc"
                    }
                },
                {
                    activity: {
                        totalLikes: "asc"
                    }
                },
                {
                    publishedAt: "asc"
                }
            ],
            take: maxLimit,
            skip: (page - 1) * maxLimit
        })
        if (posts.length) {
            return sendResponseServer<{ results: PostResponse[], count: number, page: number }>({ status: "success", action: "searchQueryByUser", code: 200, data: { results: posts, count, page }, message: "تم جلب المنشورات بنجاح 👍" })
        }
        return sendResponseServer<null>({ status: "error", action: "searchQueryByUser", code: 404, data: null, message: "لا توجد منشورات" })
    }
    static async searchDraftQuery({ value, page = 1 }: { value: string, page: number }) {
        const maxLimit = 5
        const count = await db.post.count({
            where: {
                draft: true,
                title: {
                    contains: value
                },
            },
        })
        const posts = await db.post.findMany({
            where: {
                draft: true,
                title: {
                    contains: value
                },
            },
            select: {
                id: true,
                title: true,
                slug: true,
                des: true,
                isPublished: true,
                banner: true,
                content: true,
                updatedAt: true,
                activity: {
                    select: {
                        totalComments: true,
                        totalLikes: true,
                        totalReads: true,
                    }
                },
                tags: true,
                publishedAt: true,
                author: {
                    select: {
                        id: true,
                        photo: true,
                        username: true,
                        name: true,
                        socialLinks: true
                    }
                }
            },
            orderBy: [
                {
                    activity: {
                        totalReads: "asc"
                    }
                },
                {
                    activity: {
                        totalLikes: "asc"
                    }
                },
                {
                    publishedAt: "asc"
                }
            ],
            take: maxLimit,
            skip: (page - 1) * maxLimit
        })
        if (posts.length) {
            return sendResponseServer<{ results: PostResponse[], count: number, page: number }>({ status: "success", action: "searchDraftQuery", code: 200, data: { results: posts, count, page }, message: "تم جلب المنشورات بنجاح 👍" })
        }
        return sendResponseServer<null>({ status: "error", action: "searchDraftQuery", code: 404, data: null, message: "لا توجد منشورات" })
    }
    static async searchDraftQueryByUser({user, value, page = 1 }: { value: string, page: number, user: userResponse }) {
        const maxLimit = 5
        const count = await db.post.count({
            where: {
                draft: true,
                authorId: user.id,
                title: {
                    contains: value
                },
            },
        })
        const posts = await db.post.findMany({
            where: {
                draft: true,
                authorId: user.id,
                title: {
                    contains: value
                },
            },
            select: {
                id: true,
                title: true,
                slug: true,
                des: true,
                isPublished: true,
                banner: true,
                content: true,
                updatedAt: true,
                activity: {
                    select: {
                        totalComments: true,
                        totalLikes: true,
                        totalReads: true,
                    }
                },
                tags: true,
                publishedAt: true,
                author: {
                    select: {
                        id: true,
                        photo: true,
                        username: true,
                        name: true,
                        socialLinks: true
                    }
                }
            },
            orderBy: [
                {
                    activity: {
                        totalReads: "asc"
                    }
                },
                {
                    activity: {
                        totalLikes: "asc"
                    }
                },
                {
                    publishedAt: "asc"
                }
            ],
            take: maxLimit,
            skip: (page - 1) * maxLimit
        })
        if (posts.length) {
            return sendResponseServer<{ results: PostResponse[], count: number, page: number }>({ status: "success", action: "searchDraftQueryByUser", code: 200, data: { results: posts, count, page }, message: "تم جلب المنشورات بنجاح 👍" })
        }
        return sendResponseServer<null>({ status: "error", action: "searchDraftQueryByUser", code: 404, data: null, message: "لا توجد منشورات" })
    }
    static async trending() {
        const maxLimit = 5
        const posts = await db.post.findMany({
            where: {
                draft: false,
                isPublished: true,
            },
            select: {
                id: true,
                title: true,
                slug: true,
                banner: true,
                des: true,
                content: true,
                updatedAt: true,
                isPublished: true,
                publishedAt: true,
                activity: true,
                tags: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                author: {
                    select: {
                        id: true,
                        photo: true,
                        username: true,
                        name: true,
                        socialLinks: true
                    }
                }
            },
            orderBy: [
                {
                    activity: {
                        totalReads: "asc"
                    }
                },
                {
                    activity: {
                        totalLikes: "asc"
                    }
                },
                {
                    publishedAt: "asc"
                }
            ],
            take: maxLimit
        })
        if (posts.length) {
            return sendResponseServer<PostResponse[]>({ status: "success", action: "getPosts", code: 200, data: posts, message: "تم جلب المنشورات الشائعة بنجاح 👍" })
        }
        return sendResponseServer<null>({ status: "error", action: "getPosts", code: 404, data: null, message: "لا توجد منشورات" })
    }
    static async create({ title, img, des, tags, content, draft, user }: { title: string, img: string, des: string, tags: string[], content: string, draft: boolean, user: userResponse }) {
        const newContent = content.replaceAll("uploads", '/uploads').replaceAll("//uploads", '/uploads')
        const newTags: Tag[] = []
        const slug = title.replaceAll(" ", "-").trim() + nanoid()
        if (!title.length) {
            return sendResponseServer<null>({ status: "error", action: "createPost", code: 400, data: null, message: "عنوان المنشور مطلوب" })
        }

        if (draft) {
            await db.post.create({
                data: {
                    title,
                    banner: img,
                    des,
                    slug,
                    content,
                    draft,
                    authorId: user.id,
                }
            })
            return sendResponseServer<null>({ status: "success", action: "createPost", code: 200, data: null, message: "تم حفظ المنشور كمسودة بنجاح 👍" })
        }
        if (!img.length) {
            return sendResponseServer<null>({ status: "error", action: "createPost", code: 400, data: null, message: "صورة المنشور مطلوبة." })
        }
        if (!newContent.length) {
            return sendResponseServer<null>({ status: "error", action: "createPost", code: 400, data: null, message: "اكتب شيئا ما." })
        }
        if (!des.length) {
            return sendResponseServer<null>({ status: "error", action: "createPost", code: 400, data: null, message: "الوصف القصير للمنشور مطلوب" })
        }
        if (!tags.length) {
            return sendResponseServer<null>({ status: "error", action: "createPost", code: 400, data: null  , message: "أضف وسما أو اثنين" })
        }

        await Promise.all(tags.map(async tag => {
            const existingTag = await db.tag.findFirst({
                where: {
                    name: tag
                }
            })
            if (existingTag) {
                newTags.push({ id: existingTag.id, name: existingTag.name })
            } else {
                await db.tag.create({
                    data: {
                        name: tag
                    }
                })
                const getTag = await db.tag.findFirst({
                    where: {
                        name: tag
                    }
                })
                if(getTag){
                    newTags.push({ id: getTag?.id, name: getTag?.name })
                }
            }
        }))

        const post = await db.post.create({
            data: {
                title,
                banner: img,
                des,
                slug,
                content: newContent,
                draft,
                authorId: user.id,
                activity: { create: {} },
                tags: {
                    connect: newTags.map(tag => ({ id: tag.id })),
                }
            },
            include: {
                author: {
                    select: {
                        id: true,
                        photo: true,
                        username: true,
                        name: true,
                        socialLinks: true
                    }
                },
                tags: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                activity: true
            }
        });

        const account = await db.accountInfo.findFirst({ where: { userId: user.id } })
        const totalPosts = account?.totalPosts || 0
        await db.accountInfo.update({
            where: {
                id: account?.id
            },
            data: {
                totalPosts: (totalPosts + 1)
            }
        })
        return sendResponseServer<PostResponse>({ status: "success", action: "createPost", code: 200, data: post, message: "تم إنشاء المنشور بنجاح 👍" })
    }
    static async delete({ postId, user }: { postId: string, user: userResponse }) {        
        if (!postId.length) {
            return sendResponseServer<null>({ status: "error", action: "deletePost", code: 400, data: null, message: "المنشور مطلوب" })
        }
        await db.post.delete({
            where: {
                id: postId
            }
        })

        const account = await db.accountInfo.findFirst({ where: { userId: user.id } })
        const totalPosts = account?.totalPosts || 0
        await db.accountInfo.update({
            where: {
                id: account?.id
            },
            data: {
                totalPosts: (totalPosts - 1)
            }
        })
        return sendResponseServer<{ postId: string }>({ status: "success", action: "deletePost", code: 200, data: {postId}, message: "تم حذف المنشور بنجاح 👍" })
    }
    static async publish({ postId, value }: { postId: string, value: boolean }) {
        if (!postId.length) {
            return sendResponseServer<null>({ status: "error", action: "publishPost", code: 400, data: null, message: "المنشور مطلوب" })
        }
        await db.post.update({
            where: {
                id: postId
            },
            data: {
                isPublished: value
            }
        })

        return sendResponseServer<{ postId: string }>({ status: "success", action: "publishPost", code: 200, data: {postId}, message: "تم تحديث المنشور بنجاح 👍" })
    }
    static async edit({ title, img, des, tags, content, draft, id }: { title: string, img: string, des: string, tags: string[], content: string, draft: boolean, user: userResponse, id: string }) {
        const newContent = content.replaceAll("uploads", '/uploads').replaceAll("//uploads", '/uploads')
        const newTags: Tag[] = []
        if (!title.length) {
            return sendResponseServer<null>({ status: "error", action: "createPost", code: 400, data: null, message: "عنوان المنشور مطلوب" })
        }

        if (draft) {
            await db.post.update({
                where: {
                    id
                },
                data: {
                    title,
                    banner: img,
                    des,
                    content,
                    draft,
                }
            })
            return sendResponseServer<null>({ status: "success", action: "createPost", code: 200, data: null, message: "تم تعديل المنشور كمسودة بنجاح 👍" })
        }
        if (!img.length) {
            return sendResponseServer<null>({ status: "error", action: "createPost", code: 400, data: null  , message: "صورة المنشور مطلوبة." })
        }
        if (!newContent.length) {
            return sendResponseServer<null>({ status: "error", action: "createPost", code: 400, data: null  , message: "اكتب شيئا ما." })
        }
        if (!des.length) {
            return sendResponseServer<null>({ status: "error", action: "createPost", code: 400, data: null  , message: "الوصف القصير للمنشور مطلوب" })
        }
        if (!tags.length) {
            return sendResponseServer<null>({ status: "error", action: "createPost", code: 400, data: null  , message: "أضف وسما أو اثنين" })
        }

        await Promise.all(tags.map(async tag => {
            const existingTag = await db.tag.findFirst({
                where: {
                    name: tag
                }
            })
            if (existingTag) {
                newTags.push({ id: existingTag.id, name: existingTag.name })
            } else {
                await db.tag.create({
                    data: {
                        name: tag
                    }
                })
                const getTag = await db.tag.findFirst({
                    where: {
                        name: tag
                    }
                })
                if(getTag){
                    newTags.push({ id: getTag?.id, name: getTag?.name })
                }
            }
        }))

        const post = await db.post.findUnique({
            where: {
                id
            },
            include: {
                author: {
                    select: {
                        id: true,
                        photo: true,
                        username: true,
                        name: true,
                        socialLinks: true
                    }
                },
                tags: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                activity: true
            }
        })

        if(post?.draft && !post?.tags.length){
            await db.post.update({
                where: {
                    id
                },
                data: {
                    title,
                    banner: img,
                    des,
                    content: newContent,
                    draft,
                    activity: { create: {} },
                    tags: {
                        set: [],
                    }
                }
            })
        } else {
            await db.post.update({
                where: {
                    id
                },
                data: {
                    title,
                    banner: img,
                    des,
                    content: newContent,
                    draft,
                    tags: {
                        set: [],
                    }
                }
            })
        }

        await db.post.update({
            where: {
                id
            },
            data: {
                tags: {
                    connect: newTags.map(tag => ({ id: tag.id })),
                }
            }
        })
        if (post) {
            return sendResponseServer<PostResponse>({ status: "success", action: "createPost", code: 200, data: post, message: "تم تعديل المنشور بنجاح 👍" });
        }
        return sendResponseServer<null>({ status: "error", action: "createPost", code: 404, data: null, message: "فشل تعديل المنشور" });
    }
}