"use server"

import db from "../helpers/db";
import {redirect} from "next/navigation";
import {SessionManager} from "./session.server";
import {exclude} from "../helpers/Global.js";

export async function signIn({email}: {email: string}){
    const user = await db.user.findUnique({where: {email}})
    const userWithoutPassword = exclude(user, ['password', "deletedAt"])
    SessionManager.createSession(userWithoutPassword);
    return redirect("/")
}

export async function logOut(){
    await SessionManager.destroySession()
    return redirect("/")
}

export async function isAuthenticated(){
    return await SessionManager.getSession() ? true : false
}

export async function getUserAuthenticated(){
    return await SessionManager.getSession()
}

export async function updateUserAuthenticated(data: Record<string, any>){
    return await SessionManager.updateSession(data)
}