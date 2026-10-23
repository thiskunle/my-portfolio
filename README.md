# GramByte Technologies Inc. website

Next.js (App Router, static export for GitHub Pages), TypeScript, Tailwind CSS, GSAP and Lenis.

```bash
npm run dev     # http://localhost:3000
npm run build   # static site in out/
npm run lint
```

## Homepage structure

The homepage (`app/page.tsx`) is built from the sections in `components/sections/`:

| Section | Component | Interaction |
|---|---|---|
| Hero | `HeroSection` | Cursor-tracking character, headline rises in line by line |
| About | `AboutSection` | Clickable stack of market cards with live local times |
| Services | `ServicesShowcase` | Cards start scattered and sort into a grid on scroll |
| Selected Work | `WorkSection` | Cards dealt from a pile into the grid; hover tilt |
| Our Story | `StorySection` | Road draws itself through the milestones on scroll |
| Technology Stack | `StackSection` | Draggable tags with a Shuffle button |
| Stats | `StatsSection` | Odometer numbers |
| Contact | `ContactShowcase` | Contact card, copy-email button, contact form |

- **Content** lives in `lib/content.ts`. Edit text, projects, milestones, tags and stats there.
- **Shared pieces** (cards, the hand-drawn underline, curved section edges, the odometer, the tilt hook) live in `components/peach/`.
- **GSAP** is imported only from `lib/gsap.ts`, which registers the plugins. Shared scroll animations are in `lib/animations.ts`.
- **Smooth scrolling** comes from `components/motion/SmoothScroll.tsx` (Lenis, driven by the GSAP ticker).
- **Reduced motion:** every animation is skipped and the final layout shown. Start states set in CSS are in the "GSAP start states" block of `app/globals.css`.

### Adding real project details

Each entry in `workSection.projects` accepts optional `category`, `summary`, `url` and `image` fields. Cards show "Details coming soon" and an initials placeholder until those are filled in.

## Restoring the previous design

The previous homepage is tagged `pre-peach-redesign`. Its components (`components/hero`, `services`, `projects`, `pricing`, `contact/ContactSection`) are still in the repo, unused, and the Motion library remains installed for them.
