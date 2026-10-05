import {
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
} from "react";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "article" | "section";
  isInteractive?: boolean;
  children: ReactNode;
  className?: string;
}

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  {
    as: Component = "article",
    isInteractive = false,
    children,
    className = "",
    tabIndex,
    ...rest
  },
  ref,
) {
  const interactiveClass = isInteractive ? "ui-card--interactive" : "";
  const combinedClass = `ui-card ${interactiveClass} ${className}`.trim();
  const calculatedTabIndex = isInteractive && tabIndex === undefined ? 0 : tabIndex;

  if (Component === "div") {
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        tabIndex={calculatedTabIndex}
        className={combinedClass}
        {...rest}
      >
        {children}
      </div>
    );
  }

  if (Component === "section") {
    return (
      <section
        ref={ref}
        tabIndex={calculatedTabIndex}
        className={combinedClass}
        {...rest}
      >
        {children}
      </section>
    );
  }

  return (
    <article
      ref={ref}
      tabIndex={calculatedTabIndex}
      className={combinedClass}
      {...rest}
    >
      {children}
    </article>
  );
});

export function CardHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <header className={`ui-card__header ${className}`.trim()}>{children}</header>;
}

export function CardTitle({
  children,
  as: Component = "h3",
  className = "",
}: {
  children: ReactNode;
  as?: "h2" | "h3" | "h4";
  className?: string;
}) {
  return <Component className={`ui-card__title ${className}`.trim()}>{children}</Component>;
}

export function CardKicker({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`ui-card__kicker ${className}`.trim()}>{children}</p>;
}

export function CardBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`ui-card__body ${className}`.trim()}>{children}</div>;
}

export function CardFooter({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <footer className={`ui-card__footer ${className}`.trim()}>{children}</footer>;
}
