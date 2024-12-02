'use client'

import { useEffect, useRef, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import classNames from "classnames"

export const Progressbar = () => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isNavigating, setIsNavigating] = useState(false)
    const [animationComplete, setAnimationComplete] = useState(true)
    const ref = useRef<HTMLDivElement>(null)

    // تتبع التغييرات في المسار وال query parameters
    useEffect(() => {
        setIsNavigating(true)
        
        // إعادة تعيين حالة الانتقال بعد فترة قصيرة
        const timeout = setTimeout(() => {
            setIsNavigating(false)
        }, 100)

        return () => clearTimeout(timeout)
    }, [pathname, searchParams])

    useEffect(() => {
        if (!ref.current) return
        if (isNavigating) setAnimationComplete(false)

        Promise.allSettled(
            (ref.current.getAnimations() || []).map(({ finished }) => finished)
        ).then(() => !isNavigating && setAnimationComplete(true))
    }, [isNavigating])

    return (
        <div
            role="progressbar"
            aria-hidden={!isNavigating}
            aria-valuetext={isNavigating ? "جاري التحميل" : undefined}
            className="fixed inset-x-0 top-0 right-0 z-[8888888] h-1 animate-pulse"
        >
            <div
                ref={ref}
                className={classNames({
                    "h-full bg-gradient-to-l from-[#6366f1] to-[#4338ca] transition-all duration-500 ease-in-out": true,
                    "w-0 opacity-0 transition-none": !isNavigating && animationComplete,
                    "w-4/12": isNavigating && pathname.includes("/submit"),
                    "w-10/12": isNavigating && !pathname.includes("/submit"),
                    "w-full": !isNavigating && !animationComplete
                })}
            />
        </div>
    )
}

export default Progressbar