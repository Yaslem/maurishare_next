import { type userResponse } from "@/app/controllers/User.server"

export function exclude(user: userResponse, keys: string[]) {
    return Object.fromEntries(
        Object.entries(user).filter(([key]) => !keys.includes(key))
    );
}