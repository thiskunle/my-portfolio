import { ProjectDetails } from "@/components/projects/ProjectDetails";
import { ProjectDialog } from "@/components/projects/ProjectDialog";
import { ProjectRail } from "@/components/projects/ProjectRail";
import { ProjectRing } from "@/components/projects/ProjectRing";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects, projectsSection } from "@/lib/content";

/**
 * Recent Projects (#portfolio, original anchor). Desktop shows the 3D ring; smaller screens a
 * swipeable rail. Both open the same server-rendered dialogs, so every project's full content
 * is present in the HTML.
 */
export function ProjectsSection() {
  return (
    <section
      id="portfolio"
      aria-labelledby="projects-title"
      className="overflow-x-clip border-t border-line py-section"
    >
      <Container>
        <SectionHeading id="projects-title" title={projectsSection.title} align="center" />

        <div className="mt-14 hidden lg:block">
          <ProjectRing projects={projects} />
        </div>
        <div className="mt-10 lg:hidden">
          <ProjectRail projects={projects} />
        </div>
      </Container>

      {projects.map((project) => (
        <ProjectDialog key={project.id} projectId={project.id}>
          <ProjectDetails project={project} />
        </ProjectDialog>
      ))}
    </section>
  );
}
