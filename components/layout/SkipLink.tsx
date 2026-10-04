export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only rounded-full bg-forest px-5 py-3 text-control font-semibold text-on-forest focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60"
    >
      Skip to content
    </a>
  );
}
