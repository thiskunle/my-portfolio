"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState, type FocusEvent } from "react";
import { Brand } from "@/components/layout/Brand";
import { useActiveSection } from "@/components/layout/useActiveSection";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button, buttonStyles } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { hero, navigation } from "@/lib/content";
import { cn } from "@/lib/cn";
import { durations } from "@/lib/motion";

const sectionIds = navigation.map((item) => item.href.slice(1));
const DESKTOP_QUERY = "(min-width: 64rem)"; // Tailwind lg

/**
 * Fixed site header: brand, primary navigation with active-section indicator,
 * theme toggle, primary CTA, and a disclosure-style mobile menu below lg.
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const activeId = useActiveSection(sectionIds);

  // Transparent over the top of the page, solid once content scrolls beneath it.
  const { scrollY } = useScroll();
  const surfaceOpacity = useTransform(scrollY, [0, 32], [0, 1]);

  const closeMenu = useCallback((returnFocus = false) => {
    setMenuOpen(false);
    if (returnFocus) menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu(true);
    };
    const desktop = matchMedia(DESKTOP_QUERY);
    const onBreakpoint = () => {
      if (desktop.matches) closeMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [menuOpen, closeMenu]);

  // Close when keyboard focus leaves the header (e.g. tabbing past the last menu link).
  function onHeaderBlur(event: FocusEvent<HTMLElement>) {
    if (menuOpen && !event.currentTarget.contains(event.relatedTarget as Node | null)) {
      closeMenu();
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50" onBlur={onHeaderBlur}>
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10 border-b border-line bg-paper/85 backdrop-blur-md"
        style={{ opacity: menuOpen ? 1 : surfaceOpacity }}
      />

      <Container className="flex h-header items-center justify-between gap-6">
        <Brand />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = activeId === item.href.slice(1);
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={isActive ? "true" : undefined}
                    className="relative isolate block rounded-full px-4 py-2.5 text-control font-medium text-ink-2 transition-colors duration-200 hover:text-ink aria-[current]:text-ink"
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active-pill"
                        aria-hidden
                        className="absolute inset-0 -z-10 rounded-full bg-paper-2"
                        transition={{ duration: durations.base }}
                      />
                    ) : null}
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden sm:block">
            <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
          </div>
          <button
            ref={menuButtonRef}
            type="button"
            className={cn(buttonStyles({ variant: "icon" }), "lg:hidden")}
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? "mobile-nav" : undefined}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name={menuOpen ? "x" : "menu"} />
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            key="scrim"
            aria-hidden
            className="fixed inset-x-0 top-header bottom-0 -z-20 bg-scrim lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: durations.fast }}
            onClick={() => closeMenu()}
          />
        ) : null}
        {menuOpen ? (
          <motion.nav
            key="panel"
            id="mobile-nav"
            aria-label="Primary"
            className="absolute inset-x-0 top-full max-h-[calc(100dvh-var(--header-h))] overflow-y-auto border-b border-line bg-paper lg:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <Container className="pt-2 pb-8">
              <ul className="divide-y divide-line">
                {navigation.map((item) => {
                  const isActive = activeId === item.href.slice(1);
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        aria-current={isActive ? "true" : undefined}
                        className="flex min-h-14 items-center justify-between font-display text-xl font-semibold text-ink-2 aria-[current]:text-ink"
                        onClick={() => closeMenu()}
                      >
                        {item.label}
                        {isActive ? <span aria-hidden className="size-2 rounded-full bg-forest" /> : null}
                      </a>
                    </li>
                  );
                })}
              </ul>
              <Button
                href={hero.primaryCta.href}
                size="lg"
                className="mt-6 w-full sm:hidden"
                onClick={() => closeMenu()}
              >
                {hero.primaryCta.label}
              </Button>
            </Container>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
