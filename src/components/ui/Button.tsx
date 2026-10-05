import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    fullWidth = false,
    startIcon,
    endIcon,
    children,
    className = "",
    type = "button",
    disabled = false,
    ...rest
  },
  ref,
) {
  const variantClass = `ui-button--${variant}`;
  const sizeClass = `ui-button--${size}`;
  const fullWidthClass = fullWidth ? "ui-button--full" : "";
  const combinedClass = `ui-button ${variantClass} ${sizeClass} ${fullWidthClass} ${className}`.trim();

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={combinedClass}
      aria-disabled={disabled || undefined}
      {...rest}
    >
      {startIcon && <span className="ui-button__icon ui-button__icon--start" aria-hidden="true">{startIcon}</span>}
      {children && <span className="ui-button__label">{children}</span>}
      {endIcon && <span className="ui-button__icon ui-button__icon--end" aria-hidden="true">{endIcon}</span>}
    </button>
  );
});
