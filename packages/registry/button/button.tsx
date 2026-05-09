import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "ghost";
type Size = "sm" | "md";

const variantClasses: Record<Variant, string> = {
  default: "bg-white text-black border border-white hover:bg-white/90",
  ghost: "bg-transparent text-white border border-white/25 hover:bg-white/10",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1 text-[11px]",
  md: "px-[18px] py-2 text-xs",
};

const baseClasses =
  "inline-flex items-center justify-center font-mono transition-colors disabled:opacity-50";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size"> & {
    href?: undefined;
  };

type ButtonAsAnchor = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "size"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export const Button = React.forwardRef<HTMLElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

    if (props.href !== undefined) {
      const { href, ...anchorProps } = props;
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...anchorProps}
        />
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      />
    );
  },
);
Button.displayName = "Button";
