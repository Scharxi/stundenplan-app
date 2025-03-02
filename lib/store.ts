import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Day, Subject, TimeSlot, Timetable, TimetableEntry, Break, FreeBlock } from './types';

interface TimetableState {
  timetables: Timetable[];
  activeTimetableId: string | null;
  
  // Timetable actions
  createTimetable: (name: string) => void;
  updateTimetable: (id: string, data: Partial<Omit<Timetable, 'id'>>) => void;
  deleteTimetable: (id: string) => void;
  setActiveTimetable: (id: string) => void;
  
  // Subject actions
  addSubject: (timetableId: string, subject: Omit<Subject, 'id'>) => string;
  updateSubject: (timetableId: string, id: string, data: Partial<Omit<Subject, 'id'>>) => void;
  deleteSubject: (timetableId: string, id: string) => void;
  
  // TimeSlot actions
  addTimeSlot: (timetableId: string, timeSlot: Omit<TimeSlot, 'id'>) => string;
  updateTimeSlot: (timetableId: string, id: string, data: Partial<Omit<TimeSlot, 'id'>>) => void;
  deleteTimeSlot: (timetableId: string, id: string) => void;
  
  // Entry actions
  addEntry: (timetableId: string, entry: Omit<TimetableEntry, 'id'>) => string;
  updateEntry: (timetableId: string, id: string, data: Partial<Omit<TimetableEntry, 'id'>>) => void;
  deleteEntry: (timetableId: string, id: string) => void;

  // Break actions
  addBreak: (timetableId: string, breakItem: Omit<Break, 'id'>) => string;
  updateBreak: (timetableId: string, id: string, data: Partial<Omit<Break, 'id'>>) => void;
  deleteBreak: (timetableId: string, id: string) => void;
  
  // FreeBlock actions
  addFreeBlock: (timetableId: string, freeBlock: Omit<FreeBlock, 'id'>) => string;
  updateFreeBlock: (timetableId: string, id: string, data: Partial<Omit<FreeBlock, 'id'>>) => void;
  deleteFreeBlock: (timetableId: string, id: string) => void;
}

export const useTimetableStore = create<TimetableState>()(
  persist(
    (set) => ({
      timetables: [],
      activeTimetableId: null,
      
      createTimetable: (name) => {
        const id = uuidv4();
        set((state) => ({
          timetables: [
            ...state.timetables,
            {
              id,
              name,
              entries: [],
              timeSlots: [],
              subjects: [],
              breaks: [],
              freeBlocks: []
            }
          ],
          activeTimetableId: state.activeTimetableId || id
        }));
      },
      
      updateTimetable: (id, data) => {
        set((state) => ({
          timetables: state.timetables.map((timetable) =>
            timetable.id === id ? { ...timetable, ...data } : timetable
          )
        }));
      },
      
      deleteTimetable: (id) => {
        set((state) => {
          const newTimetables = state.timetables.filter((t) => t.id !== id);
          const newActiveId = state.activeTimetableId === id
            ? newTimetables.length > 0 ? newTimetables[0].id : null
            : state.activeTimetableId;
            
          return {
            timetables: newTimetables,
            activeTimetableId: newActiveId
          };
        });
      },
      
      setActiveTimetable: (id) => {
        set({ activeTimetableId: id });
      },
      
      addSubject: (timetableId, subject) => {
        const id = uuidv4();
        set((state) => ({
          timetables: state.timetables.map((timetable) =>
            timetable.id === timetableId
              ? {
                  ...timetable,
                  subjects: [...timetable.subjects, { id, ...subject }]
                }
              : timetable
          )
        }));
        return id;
      },
      
      updateSubject: (timetableId, id, data) => {
        set((state) => ({
          timetables: state.timetables.map((timetable) =>
            timetable.id === timetableId
              ? {
                  ...timetable,
                  subjects: timetable.subjects.map((subject) =>
                    subject.id === id ? { ...subject, ...data } : subject
                  )
                }
              : timetable
          )
        }));
      },
      
      deleteSubject: (timetableId, id) => {
        set((state) => ({
          timetables: state.timetables.map((timetable) =>
            timetable.id === timetableId
              ? {
                  ...timetable,
                  subjects: timetable.subjects.filter((s) => s.id !== id),
                  entries: timetable.entries.filter((e) => e.subjectId !== id)
                }
              : timetable
          )
        }));
      },
      
      addTimeSlot: (timetableId, timeSlot) => {
        const id = uuidv4();
        set((state) => ({
          timetables: state.timetables.map((timetable) =>
            timetable.id === timetableId
              ? {
                  ...timetable,
                  timeSlots: [...timetable.timeSlots, { id, ...timeSlot }]
                }
              : timetable
          )
        }));
        return id;
      },
      
      updateTimeSlot: (timetableId, id, data) => {
        set((state) => ({
          timetables: state.timetables.map((timetable) =>
            timetable.id === timetableId
              ? {
                  ...timetable,
                  timeSlots: timetable.timeSlots.map((timeSlot) =>
                    timeSlot.id === id ? { ...timeSlot, ...data } : timeSlot
                  )
                }
              : timetable
          )
        }));
      },
      
      deleteTimeSlot: (timetableId, id) => {
        set((state) => ({
          timetables: state.timetables.map((timetable) =>
            timetable.id === timetableId
              ? {
                  ...timetable,
                  timeSlots: timetable.timeSlots.filter((t) => t.id !== id),
                  entries: timetable.entries.filter((e) => e.timeSlotId !== id)
                }
              : timetable
          )
        }));
      },
      
      addEntry: (timetableId, entry) => {
        const id = uuidv4();
        set((state) => ({
          timetables: state.timetables.map((timetable) =>
            timetable.id === timetableId
              ? {
                  ...timetable,
                  entries: [...timetable.entries, { id, ...entry }]
                }
              : timetable
          )
        }));
        return id;
      },
      
      updateEntry: (timetableId, id, data) => {
        set((state) => ({
          timetables: state.timetables.map((timetable) =>
            timetable.id === timetableId
              ? {
                  ...timetable,
                  entries: timetable.entries.map((entry) =>
                    entry.id === id ? { ...entry, ...data } : entry
                  )
                }
              : timetable
          )
        }));
      },
      
      deleteEntry: (timetableId, id) => {
        set((state) => ({
          timetables: state.timetables.map((timetable) =>
            timetable.id === timetableId
              ? {
                  ...timetable,
                  entries: timetable.entries.filter((e) => e.id !== id)
                }
              : timetable
          )
        }));
      },

      // Break actions
      addBreak: (timetableId, breakItem) => {
        const id = uuidv4();
        set((state) => ({
          timetables: state.timetables.map((timetable) =>
            timetable.id === timetableId
              ? {
                  ...timetable,
                  breaks: [...(timetable.breaks || []), { id, ...breakItem }]
                }
              : timetable
          )
        }));
        return id;
      },
      
      updateBreak: (timetableId, id, data) => {
        set((state) => ({
          timetables: state.timetables.map((timetable) =>
            timetable.id === timetableId
              ? {
                  ...timetable,
                  breaks: (timetable.breaks || []).map((breakItem) =>
                    breakItem.id === id ? { ...breakItem, ...data } : breakItem
                  )
                }
              : timetable
          )
        }));
      },
      
      deleteBreak: (timetableId, id) => {
        set((state) => ({
          timetables: state.timetables.map((timetable) =>
            timetable.id === timetableId
              ? {
                  ...timetable,
                  breaks: (timetable.breaks || []).filter((b) => b.id !== id)
                }
              : timetable
          )
        }));
      },
      
      // FreeBlock actions
      addFreeBlock: (timetableId, freeBlock) => {
        const id = uuidv4();
        set((state) => ({
          timetables: state.timetables.map((timetable) =>
            timetable.id === timetableId
              ? {
                  ...timetable,
                  freeBlocks: [...(timetable.freeBlocks || []), { id, ...freeBlock }]
                }
              : timetable
          )
        }));
        return id;
      },
      
      updateFreeBlock: (timetableId, id, data) => {
        set((state) => ({
          timetables: state.timetables.map((timetable) =>
            timetable.id === timetableId
              ? {
                  ...timetable,
                  freeBlocks: (timetable.freeBlocks || []).map((freeBlock) =>
                    freeBlock.id === id ? { ...freeBlock, ...data } : freeBlock
                  )
                }
              : timetable
          )
        }));
      },
      
      deleteFreeBlock: (timetableId, id) => {
        set((state) => ({
          timetables: state.timetables.map((timetable) =>
            timetable.id === timetableId
              ? {
                  ...timetable,
                  freeBlocks: (timetable.freeBlocks || []).filter((fb) => fb.id !== id)
                }
              : timetable
          )
        }));
      }
    }),
    {
      name: 'timetable-storage'
    }
  )
); 