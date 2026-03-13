"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

type Props = React.ComponentProps<typeof motion.svg> & {
  speed?: number
  onAnimationComplete?: () => void
}

export function FadhilSignatureEffect({
  className,
  speed = 1,
  onAnimationComplete,
  ...props
}: Props) {
  const [start, setStart] = useState(false)

  useEffect(() => {
    const id = requestIdleCallback(() => setStart(true))
    return () => cancelIdleCallback(id)
  }, [])

  const duration = 2 * speed

  return (
    <motion.svg
      className={cn("w-full max-w-70", className)}
      fill="none"
      viewBox="0 0 400 150"
      {...props}
    >
      <defs>
        <clipPath id="fadhil-reveal">
          <motion.rect
            x="0"
            y="0"
            height="150"
            initial={{ width: 0 }}
            animate={start ? { width: 400 } : { width: 0 }}
            transition={{
              duration,
              ease: "easeInOut",
            }}
            onAnimationComplete={onAnimationComplete}
          />
        </clipPath>
      </defs>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="select-none"
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "110px",
          fontWeight: "600",
        }}
        fill="transparent"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.1"
      >
        Fadhil
      </text>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="select-none"
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "110px",
          fontWeight: "600",
        }}
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        clipPath="url(#fadhil-reveal)"
      >
        Fadhil
      </text>
    </motion.svg>
  )
}
