import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { authRoutes, privateRoutes, DEFAULT_LOGIN_REDIRECT } from '@/app/services/routes.server'
import { getUserAuthenticated } from './app/services/auth.server'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    
    const isLoggedIn = await getUserAuthenticated()
    const isPrivateRoute = pathname.includes(privateRoutes)
    console.log(isPrivateRoute)
    const isAuthRoute = authRoutes.includes(pathname)

    if (isAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url))
    }

    if (!isLoggedIn && isPrivateRoute) {
        return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/auth/:path*',
    ]
}