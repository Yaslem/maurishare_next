import Validate from "@/app/helpers/Validate";
import {sendResponseServer} from "@/app/helpers/SendResponse.server";
import bcrypt from "bcryptjs"
import db from "@/app/helpers/db";
import {nanoid} from "nanoid"
import {signIn} from "@/app/services/auth.server";
import { userResponse } from "./User.server";
import { ZodFormattedError } from "zod";

export default class AuthServer {
    static async getUserByEmail(email: string) {
        return await db.user.findUnique({where: {email}})
    }
    static async getUserByUserName(username: string) {
        return await db.user.findUnique({where: {username}})
    }
    static async generateUserName(email: string){
        let username = email.split("@")[0]
        if(await AuthServer.getUserByUserName(username)){
            return username += nanoid()
        }
        return username
    }
    static async signUp(name: string, email: string, password: string) {
        const validated = Validate.signUp.safeParse({name, email, password})
        if(validated.success){
            if(!await AuthServer.getUserByEmail(email)){
                const username = await AuthServer.generateUserName(email)
                const hashedPassword = await bcrypt.hash(password, 10)
                try {
                    const user = await db.user.create({
                        data: {
                                name,
                                email, 
                                username, 
                                password: hashedPassword,
                                account: {
                                    create: {}
                                },
                                socialLinks: {
                                    create: {}
                                }
                            },
                        include: {
                            socialLinks: true,
                            account: true
                        }
                    })
                    return sendResponseServer<userResponse>({status: "success", action: "signUp", code: 200, data: user, message: "تم التسجيل بنجاح"})
                } catch {
                    return sendResponseServer<null>({status: "error", action: "signUp", code: 400, data: null, message: "حدث خطأ ما."})
                }
            }else {
                return sendResponseServer<null>({status: "error", action: "signUp", code: 400, data: null, message: "المستخدم موجود بالفعل"})
            }
        }
        return sendResponseServer<ZodFormattedError<{ name: string; email: string; password: string; }, string>>({status: "error", action: "signUp", code: 400, data: validated.error.format(), message: "بعض البيانات مطلوبة."})
    }
    static async signIn(email: string, password: string) {
        const validated = Validate.signIn.safeParse({email, password})
        if(validated.success){
            const user = await AuthServer.getUserByEmail(email)
            if(!user){
                return sendResponseServer<null>({status: "error", action: "signIn", code: 400, data: null, message: "الحساب غير موجود."})
            }
            const checkPassword = await bcrypt.compare(password, user.password)
            if(!checkPassword){
                return sendResponseServer<null>({status: "error", action: "signIn", code: 400, data: null, message: "البيانات غير صحيحة، تأكد مرة أخرى"})
            }

            await signIn({email: user.email})
            return sendResponseServer<null>({status: "success", action: "signIn", code: 200, data: null, message: "تم تسجيل الدخول بنجاح"})
        }
        if(validated.error){
            return sendResponseServer<ZodFormattedError<{ email: string; password: string; }, string>>({status: "error", action: "signIn", code: 400, data: validated.error.format(), message: "بعض البيانات مطلوبة."})
        }
        return sendResponseServer<null>({status: "error", action: "signIn", code: 400, data: null, message: "بعض البيانات مطلوبة."})
    }
}
