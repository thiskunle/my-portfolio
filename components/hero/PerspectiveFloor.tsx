/**
 * Decorative perspective grid from the original hero, refined into an engineering-paper
 * grid (minor and forest-tinted major lines). Pure CSS: the drift is a compositor-only
 * transform, disabled under reduced motion and paused by the hero's pause control.
 */
export function PerspectiveFloor() {
  return (
    <div aria-hidden className="gb-floor -z-10">
      <div className="gb-floor-grid motion-safe:animate-floor-drift" />
    </div>
  );
}
