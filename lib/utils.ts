import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Vordefinierte Farben für Fächer
export const SUBJECT_COLORS = [
  "bg-red-100 text-red-800 border-red-200",
  "bg-blue-100 text-blue-800 border-blue-200",
  "bg-green-100 text-green-800 border-green-200",
  "bg-yellow-100 text-yellow-800 border-yellow-200",
  "bg-purple-100 text-purple-800 border-purple-200",
  "bg-pink-100 text-pink-800 border-pink-200",
  "bg-indigo-100 text-indigo-800 border-indigo-200",
  "bg-orange-100 text-orange-800 border-orange-200",
  "bg-teal-100 text-teal-800 border-teal-200",
  "bg-cyan-100 text-cyan-800 border-cyan-200",
]

// Generiert eine zufällige Farbe aus der Liste
export function getRandomColor(): string {
  return SUBJECT_COLORS[Math.floor(Math.random() * SUBJECT_COLORS.length)]
}

// Formatiert eine Zeit im Format "HH:MM"
export function formatTime(time: string): string {
  return time
}

// Sortiert Zeitslots nach Startzeit
export function sortTimeSlots<T extends { startTime: string }>(slots: T[]): T[] {
  return [...slots].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime)
  })
}

// Generiert eine eindeutige ID für ein Element in einem Grid
export function getCellId(day: string, timeSlotId: string): string {
  return `${day}-${timeSlotId}`
}
