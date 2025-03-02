"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TimetableManager } from "@/components/timetable/timetable-manager";
import { Toaster } from "sonner";
import { useTimetableStore } from "@/lib/store";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const store = useTimetableStore();

  // Beispieldaten erstellen, wenn keine vorhanden sind
  useEffect(() => {
    if (store.timetables.length === 0) {
      console.log("Erstelle Beispieldaten...");
      
      // Stundenplan erstellen
      const timetableId = store.createTimetable("Mein Stundenplan");
      
      console.log("Stundenplan erstellt:", timetableId);
      
      // Zeitslots erstellen
      const timeSlot1 = store.addTimeSlot(timetableId, {
        startTime: "08:00",
        endTime: "08:45"
      });
      
      const timeSlot2 = store.addTimeSlot(timetableId, {
        startTime: "08:50",
        endTime: "09:35"
      });
      
      const timeSlot3 = store.addTimeSlot(timetableId, {
        startTime: "09:35",
        endTime: "09:55"
      });
      
      const timeSlot4 = store.addTimeSlot(timetableId, {
        startTime: "09:55",
        endTime: "10:40"
      });
      
      const timeSlot5 = store.addTimeSlot(timetableId, {
        startTime: "10:45",
        endTime: "11:30"
      });
      
      const timeSlot6 = store.addTimeSlot(timetableId, {
        startTime: "11:35",
        endTime: "12:20"
      });
      
      console.log("Zeitslots erstellt");
      
      // Fächer erstellen
      const subject1 = store.addSubject(timetableId, {
        name: "Mathematik",
        color: "bg-red-200 text-red-800 border-red-300",
        teacher: "Herr Schmidt",
        room: "R101"
      });
      
      const subject2 = store.addSubject(timetableId, {
        name: "Deutsch",
        color: "bg-blue-200 text-blue-800 border-blue-300",
        teacher: "Frau Müller",
        room: "R102"
      });
      
      const subject3 = store.addSubject(timetableId, {
        name: "Englisch",
        color: "bg-green-200 text-green-800 border-green-300",
        teacher: "Herr Johnson",
        room: "R103"
      });
      
      const subject4 = store.addSubject(timetableId, {
        name: "Biologie",
        color: "bg-yellow-200 text-yellow-800 border-yellow-300",
        teacher: "Frau Weber",
        room: "R104"
      });
      
      const subject5 = store.addSubject(timetableId, {
        name: "Geschichte",
        color: "bg-purple-200 text-purple-800 border-purple-300",
        teacher: "Herr Meyer",
        room: "R105"
      });
      
      console.log("Fächer erstellt");
      
      // Einträge erstellen
      store.addEntry(timetableId, {
        day: "monday",
        timeSlotId: timeSlot1,
        subjectId: subject1,
      });
      
      store.addEntry(timetableId, {
        day: "monday",
        timeSlotId: timeSlot2,
        subjectId: subject2,
      });
      
      store.addEntry(timetableId, {
        day: "monday",
        timeSlotId: timeSlot4,
        subjectId: subject3,
      });
      
      store.addEntry(timetableId, {
        day: "tuesday",
        timeSlotId: timeSlot1,
        subjectId: subject4,
      });
      
      store.addEntry(timetableId, {
        day: "tuesday",
        timeSlotId: timeSlot2,
        subjectId: subject5,
      });
      
      store.addEntry(timetableId, {
        day: "wednesday",
        timeSlotId: timeSlot1,
        subjectId: subject1,
      });
      
      store.addEntry(timetableId, {
        day: "wednesday",
        timeSlotId: timeSlot2,
        subjectId: subject3,
      });
      
      store.addEntry(timetableId, {
        day: "thursday",
        timeSlotId: timeSlot1,
        subjectId: subject2,
      });
      
      store.addEntry(timetableId, {
        day: "thursday",
        timeSlotId: timeSlot2,
        subjectId: subject4,
      });
      
      store.addEntry(timetableId, {
        day: "friday",
        timeSlotId: timeSlot1,
        subjectId: subject5,
      });
      
      store.addEntry(timetableId, {
        day: "friday",
        timeSlotId: timeSlot2,
        subjectId: subject1,
      });
      
      console.log("Einträge erstellt");
      
      // Pausen erstellen
      store.addBreak(timetableId, {
        name: "Große Pause",
        timeSlotId: timeSlot3,
        days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      });
      
      store.addBreak(timetableId, {
        name: "Mittagspause",
        timeSlotId: timeSlot5,
        days: ["monday", "wednesday", "thursday"],
      });
      
      console.log("Pausen erstellt");
      
      // Freiblöcke erstellen
      store.addFreeBlock(timetableId, {
        description: "Lernzeit",
        timeSlotId: timeSlot6,
        days: ["monday", "wednesday"],
        color: "bg-emerald-200 text-emerald-800 border-emerald-300",
      });
      
      store.addFreeBlock(timetableId, {
        description: "Sport AG",
        timeSlotId: timeSlot4,
        days: ["friday"],
        color: "bg-orange-200 text-orange-800 border-orange-300",
      });
      
      console.log("Freiblöcke erstellt");
    }
    
    setIsLoaded(true);
  }, [store]);
  
  const resetLocalStorage = () => {
    localStorage.clear();
    window.location.reload();
  };
  
  if (!isLoaded) {
    return <div>Lade...</div>;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      <header className="border-b">
        <div className="container mx-auto py-4">
          <h1 className="text-2xl font-bold">Stundenplan-App</h1>
        </div>
      </header>
      <main>
        <div className="fixed bottom-4 right-4 z-50">
          <Button variant="outline" onClick={resetLocalStorage}>
            Daten zurücksetzen
          </Button>
        </div>
        <TimetableManager />
      </main>
    </div>
  );
}
