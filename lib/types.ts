export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

export interface Subject {
  id: string;
  name: string;
  color?: string;
  teacher?: string;
  room?: string;
}

export interface Break {
  id: string;
  name: string;
  timeSlotId: string;
  days: Day[];
}

export interface TimetableEntry {
  id: string;
  day: Day;
  timeSlotId: string;
  subjectId: string;
  notes?: string;
}

export interface Timetable {
  id: string;
  name: string;
  entries: TimetableEntry[];
  timeSlots: TimeSlot[];
  subjects: Subject[];
  breaks: Break[];
}

export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export const DAYS: Day[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const DAY_LABELS: Record<Day, string> = {
  monday: 'Montag',
  tuesday: 'Dienstag',
  wednesday: 'Mittwoch',
  thursday: 'Donnerstag',
  friday: 'Freitag',
  saturday: 'Samstag',
  sunday: 'Sonntag'
}; 