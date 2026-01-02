import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Linear interpolation
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

// Random number in range
export function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
