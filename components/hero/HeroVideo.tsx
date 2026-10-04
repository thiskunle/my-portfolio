import { cn } from "@/lib/cn";

/** Only fetched/played when motion is allowed. */
const VIDEO_MEDIA = "(prefers-reduced-motion: no-preference)";

/*
 * Shared footprint for the video and scrim layers: larger than the copy column so the motion
 * is clearly visible, bleeding to the viewport edge on small screens. Edges fade out through
 * an elliptical mask, so no rectangle is ever visible. The hero clips any overflow.
 */
const footprint = cn(
  "pointer-events-none absolute -z-10 motion-reduce:hidden",
  "-inset-x-6 -top-[14%] -bottom-[10%] sm:-inset-x-8",
  "lg:-top-[22%] lg:-right-[8%] lg:-bottom-[18%] lg:-left-[16%]",
  "[mask-image:radial-gradient(ellipse_at_45%_50%,black_42%,transparent_72%)]",
);

/**
 * Decorative 3D loop behind the hero copy (left column). Server-rendered, no JavaScript.
 *
 * Layers, back to front (in the hero's stacking context):
 *   perspective floor → video (re-toned + blended) → scrim → hero copy and CTAs
 *
 * - Video: greyscale + a forest "color" layer re-tones any source colours to the brand hue.
 *   It blends into the page: multiply on light paper (motion reads as forest shading), screen
 *   on dark paper (motion reads as a forest glow, dimmed so light text stays readable).
 * - Scrim: the page colour at partial opacity, so it is a paper wash in light mode and a dark
 *   forest-black wash in dark mode. Readability first; the motion stays visible through it.
 * - Prominence steps up with screen size: subtle behind stacked mobile copy, strongest on desktop.
 *
 * Fallbacks: with reduced motion there is no source (nothing downloads) and both layers are
 * hidden. If loading or autoplay fails, the layers are empty and the hero is unchanged.
 * The hero's pause control also pauses this video (see RoleRotator).
 */
export function HeroVideo() {
  return (
    <>
      <div
        aria-hidden
        className={cn(
          footprint,
          "opacity-30 mix-blend-multiply motion-safe:animate-fade-in sm:opacity-40 lg:opacity-55",
          "dark:opacity-45 dark:mix-blend-screen lg:dark:opacity-60",
        )}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          disableRemotePlayback
          className="gb-hero-video size-full object-cover grayscale dark:brightness-75"
        >
          <source src="/videos/grambyte-3d-loop.mp4" type="video/mp4" media={VIDEO_MEDIA} />
        </video>
        {/* Re-tone to forest. Blends only with the video (this layer is its own group). */}
        <div className="absolute inset-0 bg-forest mix-blend-color" />
      </div>

      {/* Scrim between the video and the copy. */}
      <div aria-hidden className={cn(footprint, "bg-paper/50 dark:bg-paper/55")} />
    </>
  );
}
