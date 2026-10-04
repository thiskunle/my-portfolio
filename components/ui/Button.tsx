import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "icon";
export type ButtonSize = "md" | "lg";

const base =
  "inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full font-body font-semibold whitespace-nowrap select-none " +
  "transition-[background-color,color,box-shadow,translate] duration-200 ease-out-expo motion-reduce:transition-none " +
  "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-forest text-on-forest hover:bg-forest-hover hover:-translate-y-0.5 active:translate-y-0 motion-reduce:hover:translate-y-0",
  secondary: "text-ink ring-[1.5px] ring-line ring-inset hover:ring-ink active:bg-paper-2",
  ghost: "text-ink-2 hover:bg-paper-2 hover:text-ink active:bg-moss",
  icon: "bg-card text-ink ring-1 ring-line ring-inset hover:text-forest hover:ring-ink active:bg-paper-2",
};

const sizes: Record<ButtonSize, string> = {
  md: "min-h-11 px-5 text-control",
  lg: "min-h-13 px-7 text-base leading-none",
};

const iconSizes: Record<ButtonSize, string> = {
  md: "size-11 text-lg",
  lg: "size-13 text-xl",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(base, variants[variant], variant === "icon" ? iconSizes[size] : sizes[size], className);
}

/* Icon buttons have no visible text, so an accessible name is required. */
type VariantProps =
  | { variant?: Exclude<ButtonVariant, "icon"> }
  | { variant: "icon"; "aria-label": string };

type SharedProps = VariantProps & {
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

type AsLink = SharedProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof SharedProps | "href"> & { href: string };

type AsButton = SharedProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof SharedProps> & { href?: undefined };

export type ButtonProps = AsLink | AsButton;

/** Renders an <a> when given an href, otherwise a <button type="button">. */
export function Button(props: ButtonProps) {
  const { variant, size, className, ...rest } = props;
  const classes = buttonStyles({ variant, size, className });

  if (rest.href !== undefined) {
    return <a className={classes} {...(rest as Omit<AsLink, keyof SharedProps>)} />;
  }

  const { type = "button", ...buttonProps } = rest as Omit<AsButton, keyof SharedProps>;
  return <button type={type} className={classes} {...buttonProps} />;
}
