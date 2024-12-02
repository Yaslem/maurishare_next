import Validate from "../helpers/Validate";
import {sendResponseServer} from "../helpers/SendResponse.server";
import bcrypt from "bcryptjs"
import db from "../helpers/db";
import {nanoid} from "nanoid"
import {getUserAuthenticated, signIn} from "../services/auth.server";
import { redirect } from "next/navigation";
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
                            }
                    })
                    return sendResponseServer({status: "success", action: "signUp", message: "تم التسجيل بنجاح", data: user})
                } catch (e) {
                    return sendResponseServer({status: "error", action: "signUp", code: 400, message: "حدث خطأ ما."})
                }
            }else {
                return sendResponseServer({status: "error", action: "signUp", code: 400, message: "المستخدم موجود بالفعل"})
            }
        }
        return sendResponseServer({status: "error", action: "signUp", code: 400, message: "بعض البيانات مطلوبة.", data: validated.error.format()})
    }
    static async signIn(email: string, password: string) {
        const validated = Validate.signIn.safeParse({email, password})
        if(validated.success){
            const user = await AuthServer.getUserByEmail(email)
            if(!user){
                return sendResponseServer({status: "error", action: "signIn", code: 400, message: "الحساب غير موجود."})
            }
            const checkPassword = await bcrypt.compare(password, user.password)
            if(!checkPassword){
                return sendResponseServer({status: "error", action: "signIn", code: 400, message: "البيانات غير صحيحة، تأكد مرة أخرى"})
            }

            await signIn({email: user.email})
        }
        return sendResponseServer({status: "error", action: "signIn", code: 400, message: "بعض البيانات مطلوبة.", data: validated.error?.format()})
    }
}
