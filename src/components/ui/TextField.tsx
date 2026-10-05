import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  hideLabel?: boolean;
  helperText?: string;
  error?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  containerClassName?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    id: explicitId,
    label,
    hideLabel = false,
    helperText,
    error,
    startIcon,
    endIcon,
    className = "",
    containerClassName = "",
    type = "text",
    disabled = false,
    required = false,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const inputId = explicitId || `text-field-${generatedId}`;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const describedBy = [
    error ? errorId : null,
    helperText && !error ? helperId : null,
  ].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`ui-field ${error ? "ui-field--error" : ""} ${containerClassName}`.trim()}>
      <label htmlFor={inputId} className={`ui-field__label ${hideLabel ? "sr-only" : ""}`.trim()}>
        {label}
        {required && <span className="ui-field__required" aria-hidden="true">*</span>}
      </label>

      <div className="ui-field__control-wrapper">
        {startIcon && <span className="ui-field__icon ui-field__icon--start" aria-hidden="true">{startIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          required={required}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedBy}
          className={`ui-field__input ${className}`.trim()}
          {...rest}
        />
        {endIcon && <span className="ui-field__icon ui-field__icon--end" aria-hidden="true">{endIcon}</span>}
      </div>

      {error ? (
        <p id={errorId} className="ui-field__error" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="ui-field__helper">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});
