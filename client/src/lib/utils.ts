import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ComponentType } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Theme management helpers
export interface MoodTheme {
  name: string;
  value: string;
  color: string;
  icon: ComponentType<any>;
  description?: string;
}

export function setThemeColor(color: string) {
  document.documentElement.style.setProperty("--primary", color);
}

export function saveTheme(theme: MoodTheme) {
  localStorage.setItem("hpn-user-mood-theme", JSON.stringify(theme));
}

export function getTheme(): MoodTheme | null {
  const saved = localStorage.getItem("hpn-user-mood-theme");
  return saved ? JSON.parse(saved) : null;
}

// Sample skill data for demo purposes
export const skillsData = [
  { id: 1, userId: 1, name: "Web Development", category: "core", proficiency: 85 },
  { id: 2, userId: 1, name: "Project Management", category: "core", proficiency: 72 },
  { id: 3, userId: 1, name: "Data Analysis", category: "core", proficiency: 65 },
  { id: 4, userId: 1, name: "Content Creation", category: "core", proficiency: 90 },
  { id: 5, userId: 1, name: "Climate Action", category: "passion" },
  { id: 6, userId: 1, name: "Education", category: "passion" },
  { id: 7, userId: 1, name: "Technology", category: "passion" },
  { id: 8, userId: 1, name: "Arts & Culture", category: "passion" },
];
