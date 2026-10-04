import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import type { Project } from "@/lib/content";

type ProjectVisualProps = {
  project: Pick<Project, "icon" | "image">;
  sizes: string;
};

/**
 * Project image when one is supplied (project.image), otherwise a decorative placeholder built
 * from the category icon on the brand grid. Never a fake screenshot. Fills its positioned parent.
 */
export function ProjectVisual({ project, sizes }: ProjectVisualProps) {
  if (project.image) {
    return (
      <Image
        src={project.image.src}
        alt={project.image.alt}
        fill
        sizes={sizes}
        className="object-cover"
      />
    );
  }

  return (
    <div aria-hidden className="absolute inset-0 grid place-items-center bg-linear-140 from-moss to-paper-2">
      <div className="gb-grid-paper absolute inset-0 [mask-image:radial-gradient(closest-side,black,transparent)]" />
      <Icon name={project.icon} strokeWidth={1.4} className="relative text-[3.5rem] text-forest" />
    </div>
  );
}
