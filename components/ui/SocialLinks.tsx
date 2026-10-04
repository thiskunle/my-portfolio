import { Icon } from "@/components/ui/Icon";
import { socialLinks } from "@/lib/content";
import { cn } from "@/lib/cn";

/** Renders only profiles with a confirmed URL; renders nothing while none are supplied. */
export function SocialLinks({ className }: { className?: string }) {
  const links = socialLinks.filter((link) => link.href !== null);
  if (links.length === 0) return null;

  return (
    <ul className={cn("flex gap-2.5", className)}>
      {links.map((link) => (
        <li key={link.id}>
          <a
            href={link.href!}
            target="_blank"
            rel="noopener noreferrer"
            className="grid size-11 place-items-center rounded-xl bg-card text-lg ring-1 ring-line ring-inset transition-[color,translate] duration-200 hover:-translate-y-0.5 hover:text-forest motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <Icon name={link.icon} />
            <span className="sr-only">{`${link.label} (opens in a new tab)`}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
