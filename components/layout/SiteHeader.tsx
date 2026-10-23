"use client";

import { useCallback, useEffect, useRef, useState, type FocusEvent } from "react";
import { Brand } from "@/components/layout/Brand";
import { useActiveSection } from "@/components/layout/useActiveSection";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button, buttonStyles } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { navigation, peachHero } from "@/lib/content";
import { cn } from "@/lib/cn";

const sectionIds = navigation.map((item) => item.href.slice(1));
const DESKTOP_QUERY = "(min-width: 64rem)"; // Tailwind lg

/**
 * Fixed site header: brand, primary navigation with active-section indicator,
 * theme toggle, primary CTA, and a disclosure-style mobile menu below lg.
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const activeId = useActiveSection(sectionIds);

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

  // Compact header once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close when keyboard focus leaves the header (e.g. tabbing past the last menu link).
  function onHeaderBlur(event: FocusEvent<HTMLElement>) {
    if (menuOpen && !event.currentTarget.contains(event.relatedTarget as Node | null)) {
      closeMenu();
    }
  }

  return (
    <header
      data-scrolled={scrolled || undefined}
      className="group/header fixed inset-x-0 top-0 z-50 flex h-[5.5rem] items-center transition-[height] duration-300 ease-out-expo data-scrolled:h-header motion-reduce:transition-none"
      onBlur={onHeaderBlur}
    >
      {/* Floating deep-red frosted pill, legible over every section. Roomy at the top of the
          page, compact once scrolling starts. */}
      <Container className="relative">
        <div className="flex h-16 items-center justify-between gap-6 rounded-full bg-nav pr-2 pl-4 shadow-[0_12px_40px_-12px_rgb(40_0_8/0.45)] ring-1 ring-white/12 backdrop-blur-xl transition-[height] duration-300 ease-out-expo group-data-scrolled/header:h-14 motion-reduce:transition-none">
          <Brand className="min-h-10" />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = activeId === item.href.slice(1);
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={isActive ? "true" : undefined}
                      className="block rounded-full px-4 py-2.5 text-base font-medium text-ink-2 transition-colors duration-200 hover:text-ink aria-[current]:bg-white/12 aria-[current]:text-ink"
                    >
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
              <Button href={peachHero.primaryCta.href}>{peachHero.primaryCta.label}</Button>
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
        </div>
      </Container>

      {menuOpen ? (
        <>
          <div
            aria-hidden
            className="fixed inset-x-0 top-header bottom-0 -z-20 bg-scrim motion-safe:animate-[fade-in_200ms_ease-out] lg:hidden"
            onClick={() => closeMenu()}
          />
          <nav
            id="mobile-nav"
            aria-label="Primary"
            // data-lenis-prevent: let the panel scroll natively instead of the page.
            data-lenis-prevent
            className="absolute inset-x-3 top-full max-h-[calc(100dvh-var(--header-h)-1rem)] overflow-y-auto rounded-panel bg-paper shadow-lift ring-1 ring-line motion-safe:animate-[menu-in_250ms_var(--ease-out-expo)] lg:hidden"
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
                href={peachHero.primaryCta.href}
                size="lg"
                className="mt-6 w-full sm:hidden"
                onClick={() => closeMenu()}
              >
                {peachHero.primaryCta.label}
              </Button>
            </Container>
          </nav>
        </>
      ) : null}
    </header>
  );
}
