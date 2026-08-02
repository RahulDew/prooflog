import type { ComponentPropsWithoutRef, ReactNode, ElementType } from "react";
import { cn } from "../../lib/utils";

export type ButtonVariant =
  "primary" | "secondary" | "pill" | "sm" | "icon" | "disabled";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export type ButtonProps<T extends ElementType = "button"> = {
  as?: T;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  children?: ReactNode;
} & Omit<
  ComponentPropsWithoutRef<T>,
  "as" | "variant" | "size" | "leftIcon" | "rightIcon"
>;

const variantStyles: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  pill: "px-3 py-1.5 rounded-[4px] border font-mono text-xs font-bold uppercase tracking-wider bg-zinc-100 border-zinc-300 text-zinc-700 hover:bg-zinc-200 dark:bg-[#0a0a0c] dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-white dark:hover:border-zinc-700",
  sm: "h-10 px-4 rounded-[4px] border font-mono text-xs font-bold uppercase tracking-wider bg-white border-zinc-300 text-zinc-800 hover:border-zinc-400 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500",
  icon: "p-2 rounded-[4px] border flex items-center justify-center bg-white border-zinc-300 text-blue-600 hover:border-blue-600 dark:bg-[#0a0a0c] dark:border-zinc-800 dark:text-orange-500 dark:hover:border-orange-500",
  disabled:
    "w-full py-3.5 px-6 rounded-[4px] font-mono font-bold text-xs uppercase tracking-wider cursor-not-allowed border flex items-center justify-center gap-2 bg-zinc-200 text-zinc-500 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-500 dark:border-zinc-700",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-12 px-5 text-xs",
  lg: "h-14 px-7 text-sm",
  icon: "p-2",
};

export function Button<T extends ElementType = "button">({
  variant = "primary",
  size,
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  as,
  ...props
}: ButtonProps<T>) {
  const Component = (as || "button") as ElementType;
  const isButtonDisabled = disabled || isLoading || variant === "disabled";
  const sizeClass = size ? sizeStyles[size] : "";

  let spinnerElement: ReactNode = null;
  if (isLoading) {
    spinnerElement = (
      <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
    );
  }

  let leftIconElement: ReactNode = null;
  if (!isLoading && leftIcon) {
    leftIconElement = <span className="shrink-0 mr-2">{leftIcon}</span>;
  }

  let rightIconElement: ReactNode = null;
  if (!isLoading && rightIcon) {
    rightIconElement = <span className="shrink-0 ml-2">{rightIcon}</span>;
  }

  return (
    <Component
      disabled={Component === "button" ? isButtonDisabled : undefined}
      className={cn(
        variantStyles[variant],
        sizeClass,
        isButtonDisabled && "opacity-60 cursor-not-allowed pointer-events-none",
        className,
      )}
      {...props}
    >
      {spinnerElement}
      {leftIconElement}
      {children}
      {rightIconElement}
    </Component>
  );
}
