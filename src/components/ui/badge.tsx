import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "muted",
  children,
}: {
  className?: string;
  tone?: "muted" | "ok" | "warn" | "bad" | "accent";
  children: ReactNode;
}) {
  const tones = {
    muted: "text-muted bg-subtle",
    ok: "text-ok bg-ok/10",
    warn: "text-warn bg-warn/10",
    bad: "text-bad bg-bad/10",
    accent: "text-accent-fg bg-accent",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
