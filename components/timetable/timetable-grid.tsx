"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { useTimetableStore } from "@/lib/store";
import { DAY_LABELS, DAYS, Day, Subject, TimetableEntry } from "@/lib/types";
import { getCellId, sortTimeSlots } from "@/lib/utils";
import { TimetableEntryDialog } from "@/components/timetable/timetable-entry-dialog";

// Farbzuordnungen für die Fächer
const SUBJECT_COLORS: Record<string, { bg: string, text: string, border: string }> = {
  "bg-blue-100 text-blue-800 border-blue-200": { 
    bg: "#dbeafe", // blue-100
    text: "#1e40af", // blue-800
    border: "#bfdbfe" // blue-200
  },
  "bg-red-100 text-red-800 border-red-200": { 
    bg: "#fee2e2", // red-100
    text: "#991b1b", // red-800
    border: "#fecaca" // red-200
  },
  "bg-green-100 text-green-800 border-green-200": { 
    bg: "#dcfce7", // green-100
    text: "#166534", // green-800
    border: "#bbf7d0" // green-200
  },
  "bg-yellow-100 text-yellow-800 border-yellow-200": { 
    bg: "#fef9c3", // yellow-100
    text: "#854d0e", // yellow-800
    border: "#fef08a" // yellow-200
  },
  "bg-purple-100 text-purple-800 border-purple-200": { 
    bg: "#f3e8ff", // purple-100
    text: "#6b21a8", // purple-800
    border: "#e9d5ff" // purple-200
  },
  "bg-pink-100 text-pink-800 border-pink-200": { 
    bg: "#fce7f3", // pink-100
    text: "#9d174d", // pink-800
    border: "#fbcfe8" // pink-200
  },
  "bg-indigo-100 text-indigo-800 border-indigo-200": { 
    bg: "#e0e7ff", // indigo-100
    text: "#3730a3", // indigo-800
    border: "#c7d2fe" // indigo-200
  },
  "bg-orange-100 text-orange-800 border-orange-200": { 
    bg: "#ffedd5", // orange-100
    text: "#9a3412", // orange-800
    border: "#fed7aa" // orange-200
  },
  "bg-teal-100 text-teal-800 border-teal-200": { 
    bg: "#ccfbf1", // teal-100
    text: "#115e59", // teal-800
    border: "#99f6e4" // teal-200
  },
  "bg-cyan-100 text-cyan-800 border-cyan-200": { 
    bg: "#cffafe", // cyan-100
    text: "#155e75", // cyan-800
    border: "#a5f3fc" // cyan-200
  },
};

export function TimetableGrid() {
  const store = useTimetableStore();
  const { timetables, activeTimetableId } = store;
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(null);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(true);

  const activeTimetable = timetables.find((t) => t.id === activeTimetableId);
  const sortedTimeSlots = activeTimetable ? sortTimeSlots(activeTimetable.timeSlots) : [];

  // Funktion zum Zurücksetzen des lokalen Speichers und Neuerstellen der Beispieldaten
  const handleResetStorage = () => {
    // Lokalen Speicher löschen
    localStorage.removeItem('timetable-storage');
    
    // Seite neu laden, um die Beispieldaten neu zu erstellen
    window.location.reload();
  };

  // Funktion zum Öffnen des Dialogs für einen neuen Eintrag
  const handleAddEntry = (day: Day, timeSlotId: string) => {
    setSelectedDay(day);
    setSelectedTimeSlotId(timeSlotId);
    setSelectedEntryId(null);
    setIsEntryDialogOpen(true);
  };

  // Funktion zum Öffnen des Dialogs für einen bestehenden Eintrag
  const handleEditEntry = (entryId: string) => {
    setSelectedEntryId(entryId);
    setSelectedDay(null);
    setSelectedTimeSlotId(null);
    setIsEntryDialogOpen(true);
  };

  // Hilfsfunktion zum Finden eines Eintrags für einen bestimmten Tag und Zeitslot
  const findEntry = (day: Day, timeSlotId: string): TimetableEntry | undefined => {
    if (!activeTimetable) return undefined;
    return activeTimetable.entries.find(
      (entry) => entry.day === day && entry.timeSlotId === timeSlotId
    );
  };

  // Hilfsfunktion zum Finden eines Fachs anhand seiner ID
  const findSubject = (subjectId: string): Subject | undefined => {
    if (!activeTimetable) return undefined;
    return activeTimetable.subjects.find((subject) => subject.id === subjectId);
  };

  // Hilfsfunktion zum Ermitteln der Farbstile für ein Fach
  const getSubjectColorStyles = (subject: Subject): React.CSSProperties => {
    if (!subject.color) {
      // Standardfarbe, wenn keine Farbe definiert ist
      return {
        backgroundColor: "#f9fafb", // gray-50
        color: "#111827", // gray-900
        borderColor: "#e5e7eb", // gray-200
      };
    }
    
    const colors = SUBJECT_COLORS[subject.color] || { bg: "#f9fafb", text: "#111827", border: "#e5e7eb" };
    
    return {
      backgroundColor: colors.bg,
      color: colors.text,
      borderColor: colors.border,
      borderWidth: "1px",
      borderStyle: "solid",
    };
  };

  if (!activeTimetable || sortedTimeSlots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <p className="text-muted-foreground">
          {!activeTimetable
            ? "Kein Stundenplan ausgewählt"
            : "Füge Zeitslots hinzu, um deinen Stundenplan zu erstellen"}
        </p>
      </div>
    );
  }

  return (
    <>
      {showDebug && (
        <div className="mb-4 p-4 bg-gray-100 rounded-md overflow-auto max-h-[300px]">
          <h3 className="font-bold mb-2">Debug Info:</h3>
          <div className="flex gap-2 mb-2">
            <Button size="sm" variant="outline" onClick={() => setShowDebug(false)}>
              Debug ausblenden
            </Button>
            <Button size="sm" variant="destructive" onClick={handleResetStorage}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Daten zurücksetzen
            </Button>
          </div>
          <div>
            <p><strong>Active Timetable ID:</strong> {activeTimetableId}</p>
            <p><strong>Timetable Name:</strong> {activeTimetable.name}</p>
            <p><strong>Entries:</strong> {activeTimetable.entries.length}</p>
            <p><strong>Time Slots:</strong> {activeTimetable.timeSlots.length}</p>
            <p><strong>Subjects:</strong> {activeTimetable.subjects.length}</p>
            <div className="mt-2">
              <p><strong>Subjects Detail:</strong></p>
              <pre className="text-xs bg-gray-200 p-2 rounded">
                {JSON.stringify(activeTimetable.subjects, null, 2)}
              </pre>
            </div>
            <div className="mt-2">
              <p><strong>Entries Detail:</strong></p>
              <pre className="text-xs bg-gray-200 p-2 rounded">
                {JSON.stringify(activeTimetable.entries, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-[auto_1fr] gap-1 overflow-x-auto pb-4">
        {/* Zeitslot-Spalte */}
        <div className="grid gap-1 mt-12">
          {sortedTimeSlots.map((timeSlot) => (
            <div
              key={timeSlot.id}
              className="h-24 flex flex-col justify-center items-center p-2 bg-muted rounded-md"
            >
              <div className="text-sm font-medium">{timeSlot.startTime}</div>
              <div className="text-xs text-muted-foreground">-</div>
              <div className="text-sm font-medium">{timeSlot.endTime}</div>
            </div>
          ))}
        </div>

        {/* Tage und Einträge */}
        <div className="grid grid-cols-7 gap-1">
          {/* Tage-Header */}
          {DAYS.map((day) => (
            <div
              key={day}
              className="h-12 flex items-center justify-center font-medium bg-muted rounded-md"
            >
              {DAY_LABELS[day]}
            </div>
          ))}

          {/* Einträge-Grid */}
          {sortedTimeSlots.map((timeSlot) => (
            <React.Fragment key={timeSlot.id}>
              {DAYS.map((day) => {
                const entry = findEntry(day, timeSlot.id);
                const subject = entry ? findSubject(entry.subjectId) : undefined;

                return (
                  <div
                    key={getCellId(day, timeSlot.id)}
                    className="relative h-24 rounded-md border border-dashed"
                  >
                    {entry && subject ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 p-2 rounded-md cursor-pointer transition-all hover:shadow-md flex flex-col"
                        style={getSubjectColorStyles(subject)}
                        onClick={() => handleEditEntry(entry.id)}
                      >
                        <div className="font-medium text-sm mb-1">{subject.name}</div>
                        <div className="mt-auto flex flex-col gap-1 text-xs">
                          {subject.room && (
                            <div className="flex items-center">
                              <span className="font-bold mr-1">Raum:</span>
                              <span>{subject.room}</span>
                            </div>
                          )}
                          {subject.teacher && (
                            <div className="flex items-center">
                              <span className="font-bold mr-1">Lehrer:</span>
                              <span>{subject.teacher}</span>
                            </div>
                          )}
                          {entry.notes && (
                            <div className="mt-1 italic line-clamp-2 text-xs">{entry.notes}</div>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute inset-0 w-full h-full rounded-md"
                              onClick={() => handleAddEntry(day, timeSlot.id)}
                            >
                              <Plus className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Eintrag hinzufügen</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Dialog zum Hinzufügen/Bearbeiten von Einträgen */}
      <TimetableEntryDialog
        open={isEntryDialogOpen}
        onOpenChange={setIsEntryDialogOpen}
        day={selectedDay}
        timeSlotId={selectedTimeSlotId}
        entryId={selectedEntryId}
      />
    </>
  );
} 