"use server"

import db from "../helpers/db";
import {redirect} from "next/navigation";
import {SessionManager} from "./session.server";
import {exclude} from "@/app/helpers/Global";
import { userResponse } from "@/app/controllers/User.server";

export async function signIn({email}: {email: string}){
    const user = await db.user.findUnique({where: {email}}) as userResponse | null
    if(!user) return redirect("/auth/signin?error=user-not-found")
    const userWithoutPassword = exclude(user, ['password', "deletedAt"]) as userResponse
    SessionManager.createSession(userWithoutPassword);
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

export async function updateUserAuthenticated(data: userResponse){
    return await SessionManager.updateSession(data)
}