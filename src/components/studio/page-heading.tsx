import type { ReactNode } from "react";

export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="studio-page-heading">
      <div className="min-w-0">
        {eyebrow && <p className="studio-eyebrow">{eyebrow}</p>}
        <h1 className="studio-title">{title}</h1>
        {description && <p className="studio-description">{description}</p>}
      </div>
      {children && <div className="studio-heading-actions">{children}</div>}
    </header>
  );
}
