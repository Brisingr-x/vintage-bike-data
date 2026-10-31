import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-ink/10 bg-white shadow-card ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }: CardProps) {
  return <div className={`p-5 ${className}`} {...props} />;
}

export function CardTitle({ className = "", ...props }: CardProps) {
  return <h2 className={`font-semibold tracking-tight ${className}`} {...props} />;
}

export function CardContent({ className = "", ...props }: CardProps) {
  return <div className={`p-5 pt-0 ${className}`} {...props} />;
}
