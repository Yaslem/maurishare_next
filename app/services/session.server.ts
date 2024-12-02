import { cookies } from 'next/headers'

const COOKIE_NAME = '_auth'

const cookieOptions = {
  name: COOKIE_NAME,
  httpOnly: true,
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: true,
  maxAge: 60 * 60 // ساعة واحدة
}

export class SessionManager {
  // إنشاء جلسة جديدة
  static async createSession(data: Record<string, any>) {
    const cookieStore = await cookies()
    console.log(data)
    cookieStore.set({
      value: JSON.stringify(data),
      ...cookieOptions
    })
  }

  // الحصول على بيانات الجلسة
  static async getSession() {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(COOKIE_NAME)
    
    if (!sessionCookie) {
      return null
    }

    try {
      return JSON.parse(sessionCookie.value)
    } catch {
      return null
    }
  }

  // حذف الجلسة
  static async destroySession() {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
  }

  // تحديث بيانات الجلسة
  static async updateSession(data: Record<string, any>) {
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