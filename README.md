# GramByte Technologies Inc. website

Next.js (App Router, static export for GitHub Pages), TypeScript, Tailwind CSS, GSAP and Lenis.

```bash
npm run dev     # http://localhost:3000
npm run build   # static site in out/
npm run lint
```

## Homepage structure

The homepage (`app/page.tsx`) is built from the sections in `components/sections/`:

| Section | Component | Background | Interaction |
|---|---|---|---|
| Hero | `HeroSection` | Red | Cursor-tracking character, headline rises in line by line |
| About | `AboutSection` | Burgundy | Market picker; the chosen card comes forward with its text and local time |
| Services | `ServicesShowcase` | Cream | Scattered cards pin and settle into the grid on scroll |
| Selected Work | `WorkSection` | Red | Cards dealt into the grid; hover enlarge; View project opens a viewer |
| Our Story | `StorySection` | Burgundy | Glowing road draws through editorial date milestones |
| Technology Stack | `StackSection` | Cream | Throwable tags (Draggable + Inertia), Shuffle and Reset |
| Stats | `StatsSection` | Red | Odometer count-up with supporting copy |
| Contact | `ContactShowcase` | Cream | One card: headline, compact form, email copy, portrait |

- **Content** lives in `lib/content.ts`. Edit text, projects, milestones, tags and stats there.
- **Shared pieces** (cards, the hand-drawn underline, curved section edges, the odometer, the tilt hook) live in `components/peach/`.
- **GSAP** is imported only from `lib/gsap.ts`, which registers the plugins. Shared scroll animations are in `lib/animations.ts`.
- **Smooth scrolling** comes from `components/motion/SmoothScroll.tsx` (Lenis, driven by the GSAP ticker).
- **Section colours:** `.gb-section-red`, `-burgundy` and `-cream` in `app/globals.css`. The cream scope re-points the colour tokens, so any component placed inside switches to dark-on-light automatically.
- **Reduced motion:** every animation is skipped and the final layout shown. Start states set in CSS are in the "GSAP start states" block of `app/globals.css`.

### Adding real project details

Each entry in `workSection.projects` accepts optional `category`, `summary`, `url` and `image` fields. Cards show "Details coming soon" and an initials placeholder until those are filled in.

## Restoring the previous design

The previous homepage is tagged `pre-peach-redesign`. Its components (`components/hero`, `services`, `projects`, `pricing`, `contact/ContactSection`) are still in the repo, unused, and the Motion library remains installed for them.
