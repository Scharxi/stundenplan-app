"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { useTimetableStore } from "@/lib/store";
import { DAY_LABELS, DAYS, Day, Subject, TimetableEntry } from "@/lib/types";
import { cn, getCellId, sortTimeSlots } from "@/lib/utils";
import { TimetableEntryDialog } from "./timetable-entry-dialog";

export function TimetableGrid() {
  const { timetables, activeTimetableId } = useTimetableStore();
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(null);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  const activeTimetable = timetables.find((t) => t.id === activeTimetableId);
  const sortedTimeSlots = activeTimetable ? sortTimeSlots(activeTimetable.timeSlots) : [];

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
                        className={cn(
                          "absolute inset-0 p-2 rounded-md cursor-pointer transition-all hover:shadow-md",
                          subject.color
                        )}
                        onClick={() => handleEditEntry(entry.id)}
                      >
                        <div className="font-medium">{subject.name}</div>
                        {subject.room && (
                          <div className="text-xs mt-1">Raum: {subject.room}</div>
                        )}
                        {subject.teacher && (
                          <div className="text-xs">Lehrer: {subject.teacher}</div>
                        )}
                        {entry.notes && (
                          <div className="text-xs mt-1 italic">{entry.notes}</div>
                        )}
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