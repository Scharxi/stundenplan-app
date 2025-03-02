"use client";

import { useEffect } from "react";
import { TimetableManager } from "@/components/timetable/timetable-manager";
import { Toaster } from "sonner";
import { useTimetableStore } from "@/lib/store";

export default function Home() {
  const store = useTimetableStore();

  // Erstelle einen Beispiel-Stundenplan, wenn noch keiner existiert
  useEffect(() => {
    if (store.timetables.length === 0) {
      // Erstelle einen neuen Stundenplan
      store.createTimetable("Mein Stundenplan");
      
      // Hole die ID des erstellten Stundenplans
      const timetableId = store.timetables[0]?.id;
      
      if (timetableId) {
        // Füge Zeitslots hinzu
        store.addTimeSlot(timetableId, { startTime: "08:00", endTime: "08:45" });
        store.addTimeSlot(timetableId, { startTime: "08:50", endTime: "09:35" });
        store.addTimeSlot(timetableId, { startTime: "09:50", endTime: "10:35" });
        store.addTimeSlot(timetableId, { startTime: "10:40", endTime: "11:25" });
        store.addTimeSlot(timetableId, { startTime: "11:40", endTime: "12:25" });
        store.addTimeSlot(timetableId, { startTime: "12:30", endTime: "13:15" });
        
        // Füge Fächer hinzu
        store.addSubject(timetableId, { name: "Mathematik", color: "bg-blue-100 text-blue-800 border-blue-200" });
        store.addSubject(timetableId, { name: "Deutsch", color: "bg-red-100 text-red-800 border-red-200" });
        store.addSubject(timetableId, { name: "Englisch", color: "bg-green-100 text-green-800 border-green-200" });
        store.addSubject(timetableId, { name: "Physik", color: "bg-purple-100 text-purple-800 border-purple-200" });
        store.addSubject(timetableId, { name: "Chemie", color: "bg-yellow-100 text-yellow-800 border-yellow-200" });
        store.addSubject(timetableId, { name: "Biologie", color: "bg-pink-100 text-pink-800 border-pink-200" });
      }
    }
  }, [store]);

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      <header className="border-b">
        <div className="container mx-auto py-4">
          <h1 className="text-2xl font-bold">Stundenplan-App</h1>
        </div>
      </header>
      <main>
        <TimetableManager />
      </main>
    </div>
  );
}
