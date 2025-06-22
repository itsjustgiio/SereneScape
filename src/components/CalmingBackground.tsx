"use client";

import { cn } from "@/lib/utils";

export function CalmingBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "fixed inset-0 -z-10 calming-background-animation",
        className
      )}
      aria-hidden="true"
    />
  );
}
