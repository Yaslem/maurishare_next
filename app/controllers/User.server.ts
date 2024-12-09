import bcrypt from "bcryptjs"
import { sendResponseServer } from "@/app/helpers/SendResponse.server";
import fileService from "@/app/helpers/Upload.server";
import db from "@/app/helpers/db";
import { AccountInfo, NotificationType } from "@prisma/client";
import { getUserAuthenticated } from "@/app/services/auth.server";
import { redirect } from "next/navigation";

export interface userResponse {
    name: string;
    id: string;
    email: string;
    username: string;
    bio: string | null;
    createdAt: Date;
    photo: string;
    socialLinks: {
        twitter: string;
        facebook: string;
        website: string;
        youtube: string;
        instagram: string;
    } | null;
    account: AccountInfo | null;
}

export interface notificationResponse {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    type: NotificationType;
    seen: boolean;
    notificationForId: string;
    postId: string;
    repliedOnCommentId: string | null;
    commentId: string | null;
    commentReplyId: string | null;
}

export default class User {
    static async getProfile({ username }: { username: string }) {
        const user = await db.user.findUnique({
            where: {
                username
            },
            select: {
                id: true,
                photo: true,
                username: true,
                email: true,
                bio: true,
                name: true,
                socialLinks: {
                    select: {
                        instagram: true,
                        facebook: true,
                        twitter: true,
                        youtube: true,
                        website: true
                    }
                },
                account: true,
                createdAt: true
            },
        })
        if (user) {
            return sendResponseServer<userResponse>({ status: "success", action: "getUserProfile", code: 200, data: user, message: "تم جلب المستخدم بنجاح 👍" })
        }
        return sendResponseServer<null>({ status: "error", action: "getUserProfile", code: 404, data: null, message: "هذا المستخدم غير موجود" })
    }
    static async getProfileByAdmin({ username }: { username: string }) {
        const user = await db.user.findUnique({
            where: {
                username
            },
            select: {
                id: true,
                photo: true,
                username: true,
                can_update_post: true,
                can_create_post: true,
                can_delete_post: true,
                can_create_comment: true,
                email: true,
                bio: true,
                name: true,
                posts: {
                  select: {
                      _count: true
                  }
                },

                socialLinks: {
                    select: {
                        instagram: true,
                        facebook: true,
                        twitter: true,
                        youtube: true,
                        website: true
                    }
                },
                account: true,
                createdAt: true
            },
        })
        if (user) {
            return sendResponseServer<userResponse>({ status: "success", action: "getUserProfile", code: 200, data: user, message: "تم جلب المستخدم بنجاح 👍" })
        }
        return sendResponseServer<null>({ status: "error", action: "getUserProfile", code: 404, data: null, message: "هذا المستخدم غير موجود" })
    }
    static async getAllUsers(){
        const users = await db.user.findMany({
            select: {
                id: true,
                photo: true,
                username: true,
                email: true,
                bio: true,
                name: true,
                createdAt: true,
                socialLinks: {
                    select: {
                        instagram: true,
                        facebook: true,
                        twitter: true,
                        youtube: true,
                        website: true
                    }
                },
                account: true
            },
        })
        if (users.length) {
            return sendResponseServer<userResponse[]>({ status: "success", action: "getAllUsers", code: 200, data: users, message: "تم جلب المستخدمين بنجاح 👍" })
        }
        return sendResponseServer<null>({ status: "error", action: "getAllUsers", code: 404, data: null, message: "لا يوجد مستخدمين" })
    }
    static async editProfile({ username, instagram, newUsername, bio, facebook, twitter, youtube, website }: { username: string, instagram: string, newUsername: string, bio: string, facebook: string, twitter: string, youtube: string, website: string }) {
        const bioLimit = 150
        if (!newUsername.length) {
            return sendResponseServer<null>({ status: "error", action: "editProfile", code: 400, data: null, message: "اسم المستخدم مطلوب" })
        }
        if (bio.length > bioLimit) {
            return sendResponseServer<null>({ status: "error", action: "editProfile", code: 400, data: null, message: `الوصف المختصر يجب أن يكون أقل من ${bioLimit} حرفا.` })
        }
        if (facebook.length) {
            if (!facebook.includes(`https://`) || !facebook.includes(`.com`)) {
                return sendResponseServer<null>({ status: "error", action: "editProfile", code: 400, data: null, message: `الرابط "${facebook}" غير صالح.` })
            }
        }

        if (instagram.length) {
            if (!instagram.includes(`https://`) || !instagram.includes(`.com`)) {
                return sendResponseServer<null>({ status: "error", action: "editProfile", code: 400, data: null, message: `الرابط "${instagram}" غير صالح.` })
            }
        }

        if (twitter.length) {
            if (!twitter.includes(`https://`) || !twitter.includes(`.com`)) {
                return sendResponseServer<null>({ status: "error", action: "editProfile", code: 400, data: null, message: `الرابط "${twitter}" غير صالح.` })
            }
        }

        if (youtube.length) {
            if (!youtube.includes(`https://`) || !youtube.includes(`.com`)) {
                return sendResponseServer<null>({ status: "error", action: "editProfile", code: 400, data: null, message: `الرابط "${youtube}" غير صالح.` })
            }
        }

        const user = await db.user.findUnique({
            where: {
                username: newUsername
            },
            select: {
                id: true,
                username: true
            },
        })
        if (user && user.username !== username) {
            return sendResponseServer<null>({ status: "error", action: "editProfile", code: 400, data: null, message: `اسم الحساب "${newUsername}" مستخدم بالفعل من قِبل شخص آخر,` })
        }
        await db.user.update({
            where: { username },
            data: {
                bio,
                username: newUsername,
                socialLinks: {
                    update: {
                        instagram,
                        facebook,
                        twitter,
                        youtube,
                        website
                    }
                }
            }
        })
        return sendResponseServer<null>({ status: "success", action: "editProfile", code: 200, data: null, message: "تم تعديل الحساب بنجاح." })
    }
    static async editProfileByAdmin({ username, instagram, newUsername, bio, facebook, twitter, youtube, website, name, email, can_update_post,can_create_post,can_delete_post, can_create_comment }: { username: string, instagram: string, newUsername: string, bio: string, facebook: string, twitter: string, youtube: string, website: string, name: string, email: string, can_update_post: boolean,can_create_post: boolean,can_delete_post: boolean, can_create_comment: boolean }) {
        const bioLimit = 150
        if (!newUsername.length) {
            return sendResponseServer<null>({ status: "error", action: "editProfile", code: 400, data: null, message: "اسم المستخدم مطلوب" })
        }
        if (bio.length > bioLimit) {
            return sendResponseServer<null>({ status: "error", action: "editProfile", code: 400, data: null, message: `الوصف المختصر يجب أن يكون أقل من ${bioLimit} حرفا.` })
        }
        if (facebook.length) {
            if (!facebook.includes(`https://`) || !facebook.includes(`.com`)) {
                return sendResponseServer<null>({ status: "error", action: "editProfile", code: 400, data: null, message: `الرابط "${facebook}" غير صالح.` })
            }
        }

        if (instagram.length) {
            if (!instagram.includes(`https://`) || !instagram.includes(`.com`)) {
                return sendResponseServer<null>({ status: "error", action: "editProfile", code: 400, data: null, message: `الرابط "${instagram}" غير صالح.` })
            }
        }

        if (twitter.length) {
            if (!twitter.includes(`https://`) || !twitter.includes(`.com`)) {
                return sendResponseServer<null>({ status: "error", action: "editProfile", code: 400, data: null, message: `الرابط "${twitter}" غير صالح.` })
            }
        }

        if (youtube.length) {
            if (!youtube.includes(`https://`) || !youtube.includes(`.com`)) {
                return sendResponseServer<null>({ status: "error", action: "editProfile", code: 400, data: null, message: `الرابط "${youtube}" غير صالح.` })
            }
        }

        const user = await db.user.findUnique({
            where: {
                username: newUsername
            },
            select: {
                id: true,
                username: true
            },
        })
        if (user && user.username !== username) {
            return sendResponseServer<null>({ status: "error", action: "editProfile", code: 400, data: null, message: `اسم الحساب "${newUsername}" مستخدم بالفعل من قِبل شخص آخر,` })
        }
        await db.user.update({
            where: { username },
            data: {
                bio,
                username: newUsername,
                name, email, can_update_post,can_create_post,can_delete_post, can_create_comment,
                socialLinks: {
                    update: {
                        instagram,
                        facebook,
                        twitter,
                        youtube,
                        website
                    }
                }
            }
        })
        return sendResponseServer<null>({ status: "success", action: "editProfile", code: 200, data: null, message: "تم تعديل الحساب بنجاح." })
    }
    static async searchQuery({ value }: { value: string }) {
        const maxLimit = 50
        const users = await db.user.findMany({
            where: {
                OR: [
                    {
                        username: {
                            contains: value
                        },
                    },
                    {
                        name: {
                            contains: value
                        },
                    },
                ]
            },
            select: {
                id: true,
                name: true,
                username: true,
                photo: true,
                email: true,
                bio: true,
                createdAt: true,
                socialLinks: {
                    select: {
                        instagram: true,
                        facebook: true,
                        twitter: true,
                        youtube: true,
                        website: true
                    }
                },
                account: true
            },
            take: maxLimit,
        })
        if (users.length) {
            return sendResponseServer<userResponse[]>({ status: "success", action: "searchQueryUser", code: 200, data: users, message: "تم جلب المستخدمين بنجاح 👍" })
        }
        return sendResponseServer<null>({ status: "error", action: "searchQueryUser", code: 400, data: null, message: "لا توجد مستخدمون" })
    }
    static async getNewNotification(userName: string ) {
        const notification = await db.notification.findFirst({
            where: {
                seen: false,
                notificationFor: {
                    username: userName
                },
                NOT: {
                    user: {
                        username: userName
                    },
                }
            }
        })
        if (notification) {
            return sendResponseServer<notificationResponse>({ status: "success", action: "getNewNotification", code: 200, data: notification, message: "توجد إشعارات جديدة" })
        }
        return sendResponseServer<null>({ status: "error", action: "getNewNotification", code: 400, data: null, message: "لا توجد إشعارات جديدة" })
    }
    static async getNotifications({ username, type = "all", page = 1 }: { username: string, type?: string, page?: number }) {
        const countAll = await db.notification.count({
            where: {
                seen: false,
                notificationFor: {
                    username
                },
                NOT: {
                    user: {
                        username
                    },
                },
            }

        })
        const notificationlimit = 50
        if (type !== "all") {
            const count = await db.notification.count({
                where: {
                    notificationFor: {
                        username
                    },
                    type: type as NotificationType,
                    NOT: {
                        user: {
                            username
                        },
                    },
                }

            })
            const notifications = await db.notification.findMany({
                where: {
                    notificationFor: {
                        username
                    },
                    type: type as NotificationType,
                    NOT: {
                        user: {
                            username
                        },
                    },
                },
                select: {
                    id: true,
                    createdAt: true,
                    updatedAt: true,
                    userId: true,
                    notificationForId: true,
                    postId: true,
                    repliedOnCommentId: true,
                    commentId: true,
                    commentReplyId: true,
                    comment: {
                        select: {
                            id: true,
                            content: true,
                            commentedBy: {
                                select: {
                                    name: true,
                                    username: true,
                                    photo: true
                                }
                            }
                        }
                    },
                    reply: {
                        select: {
                            id: true,
                            content: true,
                            commentedBy: {
                                select: {
                                    name: true,
                                    username: true,
                                    photo: true
                                }
                            }
                        }
                    },
                    repliedOnComment: {
                        select: {
                            id: true,
                            content: true,
                            commentedBy: {
                                select: {
                                    name: true,
                                    username: true,
                                    photo: true
                                }
                            }
                        }
                    },
                    user: {
                        select: {
                            name: true,
                            username: true,
                            photo: true
                        }
                    },
                    type: true,
                    seen: true,
                    post: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            author: {
                                select: {
                                    name: true,
                                    username: true,
                                    photo: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: notificationlimit,
                skip: (page - 1) * notificationlimit,
            })

            await db.notification.updateMany({
                where: {
                    notificationFor: {
                        username
                    },
                    type: type as NotificationType,
                    NOT: {
                        user: {
                            username
                        },
                    },
                },
                data: {
                    seen: true
                }
            })

            if (notifications.length) {
                return sendResponseServer<{results: notificationResponse[], count: number, page: number, countAll: number}>({ status: "success", action: "getNotifications", code: 200, data: { results: notifications, count, page, countAll }, message: "تم جلب الإشعارات بنجاح 👍" })
            }
        } else {
            const count = await db.notification.count({
                where: {
                    notificationFor: {
                        username
                    },
                    NOT: {
                        user: {
                            username
                        },
                    },
                }

            })
            const notifications = await db.notification.findMany({
                where: {
                    notificationFor: {
                        username
                    },
                    NOT: {
                        user: {
                            username
                        },
                    },
                },
                select: {
                    id: true,
                    createdAt: true,
                    updatedAt: true,
                    userId: true,
                    notificationForId: true,
                    postId: true,
                    repliedOnCommentId: true,
                    commentId: true,
                    commentReplyId: true,
                    comment: {
                        select: {
                            id: true,
                            content: true,
                            commentedBy: {
                                select: {
                                    name: true,
                                    username: true,
                                    photo: true
                                }
                            }
                        }
                    },
                    reply: {
                        select: {
                            id: true,
                            content: true,
                            commentedBy: {
                                select: {
                                    name: true,
                                    username: true,
                                    photo: true
                                }
                            }
                        }
                    },
                    repliedOnComment: {
                        select: {
                            id: true,
                            content: true,
                            commentedBy: {
                                select: {
                                    name: true,
                                    username: true,
                                    photo: true
                                }
                            }
                        }
                    },
                    user: {
                        select: {
                            name: true,
                            username: true,
                            photo: true
                        }
                    },
                    type: true,
                    seen: true,
                    post: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            author: {
                                select: {
                                    name: true,
                                    username: true,
                                    photo: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: notificationlimit,
                skip: (page - 1) * notificationlimit,
            })

            await db.notification.updateMany({
                where: {
                    notificationFor: {
                        username
                    },
                    NOT: {
                        user: {
                            username
                        },
                    },
                },
                data: {
                    seen: true
                }
            })

            if (notifications.length) {
                return sendResponseServer<{results: notificationResponse[], count: number, page: number, countAll: number}>({ status: "success", action: "getNotifications", code: 200, data: { results: notifications, count, page, countAll }, message: "تم جلب الإشعارات بنجاح 👍" })
            }
        }

        return sendResponseServer<null>({ status: "error", action: "getNotifications", code: 400, data: null, message: "لا توجد إشعارات" })
    }
    static async addReplyCommentNotification({ notificationId, postId, user, replyingTo, comment }: { notificationId: string, postId: string, user: userResponse, replyingTo: string, comment: string }) {
        if(postId && notificationId){
            const getPost = await db.post.findFirst({
                where: {
                    id: postId
                },
                select: {
                    id: true,
                    author: {
                        select: {
                            id: true
                        }
                    }
                }
            })
            const getNotification = await db.notification.findFirst({
                where: {
                    id: notificationId
                },
                select: {
                    id: true,
                }
            })
            if (getNotification) {
                if (!comment.length) {
                    return sendResponseServer<null>({ status: "error", action: "addReplyCommentNotification", code: 400, data: null, message: "محتوى التعليق مطلوب" })
                }
                if (!replyingTo.length) {
                    return sendResponseServer<null>({ status: "error", action: "addReplyCommentNotification", code: 400, data: null, message: "التعليق المردود عليه مطلوب" })
                }
                if (!getPost) {
                    return sendResponseServer<null>({ status: "error", action: "addReplyCommentNotification", code: 400, data: null, message: "التعليق غير موجود" })
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
                            connect: { id: user.id }
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
    
                await db.notification.update({
                    where: {
                        id: getNotification.id
                    },
                    data: {
                        reply: {
                            connect: { id: getComment.id }
                        }
                    }
                })
                return sendResponseServer<null>({ status: "success", action: "addReplyCommentNotification", code: 200, data: null, message: "تم الرد على التعليق بنجاح 👍" })
            }
        }
        return sendResponseServer<null>({ status: "error", action: "addReplyCommentNotification", code: 400, data: null, message: "حدث خطأ ما بسبب هذا التعليق" })
    }
    static async uploadImg(image: File, username: string) {
        const folder = "avatars"
        const filename = Date.now() + image.name.replaceAll(" ", "_").replaceAll("-", "_");
        await fileService.upload({ folder, file: image, filename })
        await db.user.update({
            where: { username },
            data: { photo: `${folder}/${filename}` }
        })
        const imgUrl = `${folder}/${filename}`
        const user = await getUserAuthenticated()
        if(!user) redirect("/")
        await this.updateUserPhoto(user.username, imgUrl)
        return imgUrl
    }
    static async updateUserPhoto(username: string, photo: string){
        await db.user.update({
            where: { username }, data: { photo }
        })
        return sendResponseServer<null>({ status: "success", action: "updateUserPhoto", code: 200, data: null, message: "تم تحديث صورة المستخدم بنجاح 👍" })
    }
    static async changePassword(username: string, newPassword: string, currentPassword: string) {
        if (!currentPassword.length || !newPassword.length) {
            return sendResponseServer<null>({status: "error", action: "changePassword", code: 400, data: null, message: "املأ جميع الحقول."})
        } else if(newPassword.length < 8 ){
            return sendResponseServer<null>({status: "error", action: "changePassword", code: 400, data: null, message: "كلمة المرور الجديدة يجب أن تكون أطول من 8 أحرف."})
        } else if(newPassword.length > 16 ){
            return sendResponseServer<null>({status: "error", action: "changePassword", code: 400, data: null, message: "كلمة المرور الجديدة يجب أن تكون أقل من 16 أحرف."})
        }
        const user = await db.user.findUnique({where: {username}})

        if(user){
            const checkPassword = await bcrypt.compare(currentPassword, user.password)
            if(checkPassword){
                const hashedPassword = await bcrypt.hash(newPassword, 10)
                await db.user.update({
                    where: {
                        username: user.username
                    },
                    data: {
                        password: hashedPassword
                    }
                })
                return sendResponseServer<null>({status: "success", action: "changePassword", code: 200, data: null, message: "تم تغيير كلمة المرور بنجاح."})
            }
            return sendResponseServer<null>({status: "error", action: "changePassword", code: 400, data: null, message: "كلمة المرور الحالية غير صحيحة."})
        }
        return redirect("/")
    }
}