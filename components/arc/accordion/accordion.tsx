"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { TargetAndTransition, Variants } from "motion/react";
import { motionTokens } from "../lib/motion-tokens";
import styles from "./accordion.module.css";

export interface AccordionItem { id?: string; title: ReactNode; content: ReactNode; }
export interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: number;
  /** Mount closed panel contents only after they are opened for the first time. */
  lazyMount?: boolean;
  /** "lg" suits page-level FAQs: questions at the large text size, answers at body size. */
  size?: "md" | "lg";
  onValueChange?: (value: string) => void;
  className?: string;
}

/** Height follows the content on a spring that never overshoots; closed panels leave the accessibility tree once they finish collapsing. */
const panelOpen: TargetAndTransition = { height: "auto", opacity: 1, visibility: "visible" };
const panelClosed: TargetAndTransition = { height: 0, opacity: 0, transitionEnd: { visibility: "hidden" } };
/** The answer settles down into place with GPU-compositable transform only. */
const contentOpen: TargetAndTransition = { y: 0 };
const contentClosed: TargetAndTransition = { y: -6 };
const panelMotion: Variants = {
  open: { ...panelOpen, transition: { height: motionTokens.spring.smooth, opacity: { duration: motionTokens.duration.standard, ease: [...motionTokens.ease.enter] } } },
  closed: { ...panelClosed, transition: { height: motionTokens.spring.smooth, opacity: { duration: motionTokens.duration.fast, ease: [...motionTokens.ease.standard] } } },
};
const contentMotion: Variants = {
  open: { ...contentOpen, transition: { y: motionTokens.spring.smooth } },
  closed: { ...contentClosed, transition: { duration: motionTokens.duration.fast, ease: [...motionTokens.ease.standard] } },
};
/** Reduced motion: same end states in one step, so server and client render identical styles. */
const panelStill: Variants = { open: { ...panelOpen, transition: { duration: 0 } }, closed: { ...panelClosed, transition: { duration: 0 } } };
const contentStill: Variants = { open: { ...contentOpen, transition: { duration: 0 } }, closed: { ...contentClosed, transition: { duration: 0 } } };

export function Accordion({ items, defaultOpen = 0, lazyMount = false, size = "md", onValueChange, className }: AccordionProps) {
  const initialValue = defaultOpen >= 0 && defaultOpen < items.length ? String(defaultOpen) : "";
  const [openValue, setOpenValue] = useState(initialValue);
  const [mountedValues, setMountedValues] = useState<Set<string>>(
    () => new Set(initialValue ? [initialValue] : [])
  );
  const reduced = useReducedMotion();
  const handleValueChange = (next: string) => {
    setOpenValue(next);
    if (next) {
      setMountedValues((prev) => {
        if (prev.has(next)) return prev;
        const updated = new Set(prev);
        updated.add(next);
        return updated;
      });
    }
    onValueChange?.(next);
  };
  return <AccordionPrimitive.Root className={[styles.accordion, size === "lg" ? styles.lg : "", className ?? ""].filter(Boolean).join(" ")} type="single" collapsible value={openValue} onValueChange={handleValueChange}>
    {items.map((item, index) => {
      const value = String(index);
      const open = openValue === value;
      const shouldRenderContent = !lazyMount || open || mountedValues.has(value);
      return <AccordionPrimitive.Item className={styles.item} value={value} key={item.id ?? `${typeof item.title === "string" ? item.title : "item"}-${index}`}>
      <AccordionPrimitive.Header className={styles.header}>
        <AccordionPrimitive.Trigger className={styles.trigger}>
          <span className="min-w-0 flex-1">{item.title}</span><motion.span className={styles.icon} initial={false} animate={{ rotate: open ? 180 : 0 }} transition={reduced ? { duration: 0 } : motionTokens.spring.snappy}><ChevronDown width={17} height={17} aria-hidden="true" /></motion.span>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      {/* Radix keeps semantics and ids; motion owns the height so a toggle mid-flight retargets instead of restarting. */}
      <AccordionPrimitive.Content forceMount asChild>
        <motion.div className={styles.panel} initial={false} animate={open ? "open" : "closed"} variants={reduced ? panelStill : panelMotion}>
          <motion.div className={styles.panelInner} variants={reduced ? contentStill : contentMotion}>{shouldRenderContent ? item.content : null}</motion.div>
        </motion.div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>; })}
  </AccordionPrimitive.Root>;
}

export default Accordion;
