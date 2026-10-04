import type { ReactNode } from "react";
import { ContactLink } from "@/components/contact/ContactLink";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { projectDialogTitleId } from "@/components/projects/projectDialogs";
import { buttonStyles } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { projectsSection, type Project } from "@/lib/content";

function DetailBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-eyebrow font-medium text-forest uppercase">{label}</h3>
      <div className="mt-2 text-ink-2">{children}</div>
    </div>
  );
}

/**
 * Full project content shown in its dialog. Server-rendered. Optional verified fields
 * (problem, outcome, technologies) render only when present; nothing is shown for missing data.
 */
export function ProjectDetails({ project }: { project: Project }) {
  return (
    <div className="grid md:grid-cols-[1fr_1.15fr]">
      <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[26rem]">
        <ProjectVisual project={project} sizes="(min-width: 768px) 26rem, 100vw" />
      </div>

      <div className="flex flex-col gap-5 p-7 sm:p-10">
        <p className="flex items-center gap-2 font-display text-eyebrow font-medium text-forest uppercase">
          <Icon name={project.icon} className="text-base" />
          {project.category}
        </p>
        <h2 id={projectDialogTitleId(project.id)} className="text-h3">
          {project.title}
        </h2>
        <p className="text-lead text-ink-2">{project.summary}</p>
        <p className="text-ink-2">{project.scope}</p>

        {project.problem ? (
          <DetailBlock label="Problem">
            <p>{project.problem}</p>
          </DetailBlock>
        ) : null}
        {project.outcome ? (
          <DetailBlock label="Outcome">
            <p>{project.outcome}</p>
          </DetailBlock>
        ) : null}
        {project.technologies && project.technologies.length > 0 ? (
          <DetailBlock label="Technologies">
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {project.technologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          </DetailBlock>
        ) : null}

        <div className="mt-auto pt-2">
          <ContactLink
            subject={projectsSection.contactSubject(project)}
            className={buttonStyles({ size: "lg", className: "w-full sm:w-auto" })}
          >
            {projectsSection.projectCta}
          </ContactLink>
        </div>
      </div>
    </div>
  );
}
