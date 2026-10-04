"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { buttonStyles } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { durations } from "@/lib/motion";

/** Appears after one viewport of scrolling. Links to #top so focus returns to the start of the page. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setVisible(y > window.innerHeight);
  });

  return (
    <AnimatePresence>
      {visible ? (
        <motion.a
          key="back-to-top"
          href="#top"
          aria-label="Back to top"
          className={buttonStyles({
            variant: "icon",
            size: "lg",
            className:
              "fixed right-5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 shadow-lift",
          })}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: durations.fast }}
        >
          <Icon name="arrow-up" />
        </motion.a>
      ) : null}
    </AnimatePresence>
  );
}
