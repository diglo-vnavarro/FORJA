import { forwardRef, useId, type ReactNode, type SelectHTMLAttributes } from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label: string;
  options: SelectOption[];
  hideLabel?: boolean;
  helperText?: string;
  error?: string;
  containerClassName?: string;
  icon?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    id: explicitId,
    label,
    options,
    hideLabel = false,
    helperText,
    error,
    className = "",
    containerClassName = "",
    disabled = false,
    required = false,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const selectId = explicitId || `select-${generatedId}`;
  const helperId = `${selectId}-helper`;
  const errorId = `${selectId}-error`;

  const describedBy = [
    error ? errorId : null,
    helperText && !error ? helperId : null,
  ].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`ui-field ${error ? "ui-field--error" : ""} ${containerClassName}`.trim()}>
      <label htmlFor={selectId} className={`ui-field__label ${hideLabel ? "sr-only" : ""}`.trim()}>
        {label}
        {required && <span className="ui-field__required" aria-hidden="true">*</span>}
      </label>

      <div className="ui-field__control-wrapper ui-field__control-wrapper--select">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          required={required}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedBy}
          className={`ui-field__select ${className}`.trim()}
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
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
