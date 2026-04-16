"use client"

import * as React from "react"
import { motion, type Variants } from "motion/react"
import { cn } from "@/lib/utils"

// ─── Animation Variants ─────────────────────────────────────────────────────
// Uses a subtle blur(2px) for section-level reveal animations.
// StaggerItem variants use ONLY transform + opacity (GPU-compositable) to avoid
// the Lighthouse "non-composited animations" diagnostic when many items animate.

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(2px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
}

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30, filter: "blur(2px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)" },
}

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30, filter: "blur(2px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)" },
}

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9, filter: "blur(2px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
}

const variantMap = {
  "fade-up": fadeInUp,
  "fade-left": fadeInLeft,
  "fade-right": fadeInRight,
  "scale-in": scaleIn,
} as const

type AnimationVariant = keyof typeof variantMap

// ─── Lightweight Variants (compositable only — no filter) ────────────────────
// Used by StaggerItem to keep per-child animations GPU-friendly.

const lightFadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const lightFadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
}

const lightFadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
}

const lightScaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
}

const lightVariantMap = {
  "fade-up": lightFadeInUp,
  "fade-left": lightFadeInLeft,
  "fade-right": lightFadeInRight,
  "scale-in": lightScaleIn,
} as const

// ─── Animated Section Component ─────────────────────────────────────────────

interface AnimatedSectionProps {
  children: React.ReactNode
  variant?: AnimationVariant
  delay?: number
  duration?: number
  className?: string
  once?: boolean
  amount?: number
  as?: "div" | "section"
}

function AnimatedSection({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.6,
  className,
  once = true,
  amount = 0.2,
  as = "div",
}: AnimatedSectionProps) {
  const Component = as === "section" ? motion.section : motion.div

  return (
    <Component
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variantMap[variant]}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </Component>
  )
}

// ─── Staggered Children Container ───────────────────────────────────────────

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  delayChildren?: number
  once?: boolean
  amount?: number
}

function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  delayChildren = 0.2,
  once = true,
  amount = 0.2,
}: StaggerContainerProps) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

// ─── Staggered Child Item ───────────────────────────────────────────────────
// Uses lightweight, GPU-compositable variants (no filter) to prevent
// 201 non-composited animation warnings from Lighthouse.

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
  variant?: AnimationVariant
}

function StaggerItem({
  children,
  className,
  variant = "fade-up",
}: StaggerItemProps) {
  return (
    <motion.div className={cn(className)} variants={lightVariantMap[variant]}>
      {children}
    </motion.div>
  )
}

export {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  staggerContainer,
  variantMap,
  lightVariantMap,
  type AnimatedSectionProps,
  type AnimationVariant,
  type StaggerContainerProps,
  type StaggerItemProps,
}
