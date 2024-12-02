'use client'

import { motion, AnimatePresence } from "framer-motion"

interface AnimationProps {
    children: React.ReactNode
    keyValue?: string
    className?: string
    initial?: Record<string, number>
    animate?: Record<string, number>
    transition?: {
        duration?: number
        delay?: number
        ease?: string
    }
}

const AnimationWrapper = ({
    children,
    keyValue,
    className,
    initial = { opacity: 0 },
    animate = { opacity: 1 },
    transition = { duration: 1 }
}: AnimationProps) => {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={keyValue}
                initial={initial}
                animate={animate}
                transition={transition}
                className={className}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}

export default AnimationWrapper