"use client";

import { useEffect, useState } from "react";
import { buttonStyles } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/**
 * Appears after one viewport of scrolling. Links to #top so focus returns to the start of the
 * page. Always rendered; hidden with CSS (and removed from the tab order) until needed.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setVisible(window.scrollY > window.innerHeight);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <a
      href="#top"
      aria-label="Back to top"
      aria-hidden={visible ? undefined : true}
      tabIndex={visible ? undefined : -1}
      className={buttonStyles({
        variant: "icon",
        size: "lg",
        className: cn(
          "fixed right-5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 shadow-lift transition-[opacity,scale] duration-200 motion-reduce:transition-none",
          !visible && "pointer-events-none scale-90 opacity-0",
        ),
      })}
    >
      <Icon name="arrow-up" />
    </a>
  );
}
