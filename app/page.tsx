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
      console.log("Erstelle Beispiel-Stundenplan...");
      
      // Erstelle einen neuen Stundenplan
      store.createTimetable("Mein Stundenplan");
      
      // Hole die ID des erstellten Stundenplans
      const timetableId = store.timetables[0]?.id;
      
      if (timetableId) {
        console.log("Timetable ID:", timetableId);
        
        // Füge Zeitslots hinzu
        const timeSlot1 = store.addTimeSlot(timetableId, { startTime: "08:00", endTime: "08:45" });
        const timeSlot2 = store.addTimeSlot(timetableId, { startTime: "08:50", endTime: "09:35" });
        const timeSlot3 = store.addTimeSlot(timetableId, { startTime: "09:50", endTime: "10:35" });
        const timeSlot4 = store.addTimeSlot(timetableId, { startTime: "10:40", endTime: "11:25" });
        const timeSlot5 = store.addTimeSlot(timetableId, { startTime: "11:40", endTime: "12:25" });
        const timeSlot6 = store.addTimeSlot(timetableId, { startTime: "12:30", endTime: "13:15" });
        
        console.log("Zeitslots erstellt:", timeSlot1, timeSlot2, timeSlot3, timeSlot4, timeSlot5, timeSlot6);
        
        // Füge Fächer hinzu
        const mathId = store.addSubject(timetableId, { 
          name: "Mathematik", 
          color: "bg-blue-100 text-blue-800 border-blue-200",
          teacher: "Herr Schmidt",
          room: "A101"
        });
        
        const deutschId = store.addSubject(timetableId, { 
          name: "Deutsch", 
          color: "bg-red-100 text-red-800 border-red-200",
          teacher: "Frau Müller",
          room: "B203"
        });
        
        const englishId = store.addSubject(timetableId, { 
          name: "Englisch", 
          color: "bg-green-100 text-green-800 border-green-200",
          teacher: "Frau Johnson",
          room: "C305"
        });
        
        const physicsId = store.addSubject(timetableId, { 
          name: "Physik", 
          color: "bg-purple-100 text-purple-800 border-purple-200",
          teacher: "Herr Weber",
          room: "D107"
        });
        
        const chemistryId = store.addSubject(timetableId, { 
          name: "Chemie", 
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          teacher: "Frau Becker",
          room: "E210"
        });
        
        const biologyId = store.addSubject(timetableId, { 
          name: "Biologie", 
          color: "bg-pink-100 text-pink-800 border-pink-200",
          teacher: "Herr Fischer",
          room: "F112"
        });
        
        console.log("Fächer erstellt:", mathId, deutschId, englishId, physicsId, chemistryId, biologyId);
        
        // Füge Beispiel-Einträge hinzu
        const entry1 = store.addEntry(timetableId, {
          day: "monday",
          timeSlotId: timeSlot1,
          subjectId: mathId,
          notes: "Hausaufgaben nicht vergessen"
        });
        
        const entry2 = store.addEntry(timetableId, {
          day: "monday",
          timeSlotId: timeSlot2,
          subjectId: deutschId
        });
        
        const entry3 = store.addEntry(timetableId, {
          day: "tuesday",
          timeSlotId: timeSlot1,
          subjectId: englishId,
          notes: "Vokabeltest"
        });
        
        const entry4 = store.addEntry(timetableId, {
          day: "wednesday",
          timeSlotId: timeSlot3,
          subjectId: physicsId
        });
        
        const entry5 = store.addEntry(timetableId, {
          day: "thursday",
          timeSlotId: timeSlot4,
          subjectId: chemistryId,
          notes: "Labor-Experiment"
        });
        
        const entry6 = store.addEntry(timetableId, {
          day: "friday",
          timeSlotId: timeSlot5,
          subjectId: biologyId
        });
        
        const entry7 = store.addEntry(timetableId, {
          day: "friday",
          timeSlotId: timeSlot6,
          subjectId: mathId,
          notes: "Wiederholung für die Klausur"
        });
        
        console.log("Einträge erstellt:", entry1, entry2, entry3, entry4, entry5, entry6, entry7);
        
        // Setze den aktiven Stundenplan
        store.setActiveTimetable(timetableId);
        console.log("Aktiver Stundenplan gesetzt:", timetableId);
      }
    } else {
      // Aktualisiere bestehende Fächer, falls sie keine Farbe, Lehrer oder Raum haben
      store.timetables.forEach(timetable => {
        timetable.subjects.forEach(subject => {
          const needsUpdate = !subject.color || !subject.teacher || !subject.room;
          
          if (needsUpdate) {
            console.log(`Aktualisiere Fach: ${subject.name} (${subject.id})`);
            
            // Standardwerte für fehlende Eigenschaften
            const defaultColors = [
              "bg-blue-100 text-blue-800 border-blue-200",
              "bg-red-100 text-red-800 border-red-200",
              "bg-green-100 text-green-800 border-green-200",
              "bg-purple-100 text-purple-800 border-purple-200",
              "bg-yellow-100 text-yellow-800 border-yellow-200",
              "bg-pink-100 text-pink-800 border-pink-200"
            ];
            
            const defaultTeachers = [
              "Herr Schmidt", "Frau Müller", "Herr Weber", 
              "Frau Becker", "Herr Fischer", "Frau Johnson"
            ];
            
            const defaultRooms = [
              "A101", "B203", "C305", "D107", "E210", "F112"
            ];
            
            // Zufällige Auswahl für fehlende Werte
            const randomIndex = Math.floor(Math.random() * defaultColors.length);
            
            store.updateSubject(timetable.id, subject.id, {
              color: subject.color || defaultColors[randomIndex],
              teacher: subject.teacher || defaultTeachers[randomIndex],
              room: subject.room || defaultRooms[randomIndex]
            });
          }
        });
      });
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
