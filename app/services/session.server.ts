import { cookies } from 'next/headers'
import { type userResponse } from '@/app/controllers/User.server'

const COOKIE_NAME = '_auth'

const cookieOptions = {
  name: COOKIE_NAME,
  httpOnly: true,
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: true,
  maxAge: 60 * 60
}

export class SessionManager {
  static async createSession(data: userResponse) {
    const cookieStore = await cookies()
    cookieStore.set({
      value: JSON.stringify(data),
      ...cookieOptions
    })
  }

  static async getSession() {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(COOKIE_NAME)
    
    if (!sessionCookie) {
      return null
    }

    try {
      return JSON.parse(sessionCookie.value) as userResponse
    } catch {
      return null
    }
  }
  
  static async destroySession() {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
  }

  static async updateSession(data: userResponse) {
    const cookieStore = await cookies()
    const currentSession = await this.getSession()
    
    cookieStore.set({
      ...cookieOptions,
      value: JSON.stringify({
        ...currentSession,
        ...data
      })
    })
  }
}