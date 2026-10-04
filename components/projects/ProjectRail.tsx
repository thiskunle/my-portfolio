import { OpenProjectButton } from "@/components/projects/OpenProjectButton";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { buttonStyles } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { Project } from "@/lib/content";

/**
 * Mobile/tablet presentation: a native horizontal scroll-snap rail. Swipe or scroll to browse;
 * no drag logic or 3D. Server-rendered; only the "View details" buttons are client islands.
 */
export function ProjectRail({ projects }: { projects: readonly Project[] }) {
  return (
    <div>
      <ul
        aria-label="Recent projects"
        className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-4 sm:-mx-8 sm:scroll-px-8 sm:px-8"
      >
        {projects.map((project, i) => (
          <li key={project.id} className="w-[82%] max-w-sm shrink-0 snap-start sm:w-[46%]">
            <article
              aria-labelledby={`rail-${project.id}-title`}
              className="flex h-full flex-col overflow-hidden rounded-card bg-card ring-1 ring-line ring-inset"
            >
              <div className="relative aspect-[4/3]">
                <ProjectVisual project={project} sizes="(min-width: 640px) 46vw, 82vw" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-forest">
                  <Icon name={project.icon} />
                  {project.category}
                </p>
                <h3 id={`rail-${project.id}-title`} className="mt-2 text-xl leading-snug">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm text-ink-2">{project.summary}</p>
                <div className="mt-auto pt-5">
                  <OpenProjectButton
                    projectId={project.id}
                    className={buttonStyles({ variant: "secondary", className: "w-full" })}
                  >
                    View details
                    <span className="sr-only">: {project.title}</span>
                  </OpenProjectButton>
                </div>
              </div>
            </article>
            <span className="sr-only">
              Project {i + 1} of {projects.length}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-ink-2">Swipe or scroll sideways to browse projects.</p>
    </div>
  );
}
