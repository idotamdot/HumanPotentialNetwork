import React from "react";
import { cn } from "@/lib/utils";

interface SkillBarProps {
  name: string;
  proficiency: number;
  className?: string;
}

export function SkillBar({ name, proficiency, className }: SkillBarProps) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <div className="flex justify-between text-xs">
        <span>{name}</span>
        <span>{proficiency}%</span>
      </div>
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${proficiency}%` }}
        />
      </div>
    </div>
  );
}
