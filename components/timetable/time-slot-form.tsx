"use client";

import React, { useEffect, useState, ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { useTimetableStore } from "@/lib/store";

interface TimeSlotFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeSlotId?: string;
}

export function TimeSlotForm({ open, onOpenChange, timeSlotId }: TimeSlotFormProps) {
  const { timetables, activeTimetableId, addTimeSlot, updateTimeSlot, deleteTimeSlot } = useTimetableStore();
  
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("08:45");
  
  const activeTimetable = timetables.find((t) => t.id === activeTimetableId);
  const timeSlot = timeSlotId && activeTimetable
    ? activeTimetable.timeSlots.find((t) => t.id === timeSlotId)
    : undefined;
  
  // Wenn ein Zeitslot bearbeitet wird, lade die Daten
  useEffect(() => {
    if (timeSlot) {
      setStartTime(timeSlot.startTime);
      setEndTime(timeSlot.endTime);
    } else {
      // Standardwerte für einen neuen Zeitslot
      setStartTime("08:00");
      setEndTime("08:45");
    }
  }, [timeSlot, open]);
  
  const handleSave = () => {
    if (!activeTimetableId || !activeTimetable) {
      toast.error("Kein Stundenplan ausgewählt");
      return;
    }
    
    if (!startTime || !endTime) {
      toast.error("Bitte gib Start- und Endzeit ein");
      return;
    }
    
    if (timeSlotId && timeSlot) {
      // Zeitslot aktualisieren
      updateTimeSlot(activeTimetableId, timeSlotId, {
        startTime,
        endTime,
      });
      toast.success("Zeitslot aktualisiert");
    } else {
      // Neuen Zeitslot erstellen
      addTimeSlot(activeTimetableId, {
        startTime,
        endTime,
      });
      toast.success("Zeitslot hinzugefügt");
    }
    
    onOpenChange(false);
  };
  
  const handleDelete = () => {
    if (!activeTimetableId || !timeSlotId) return;
    
    deleteTimeSlot(activeTimetableId, timeSlotId);
    toast.success("Zeitslot gelöscht");
    onOpenChange(false);
  };
  
  if (!activeTimetable) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {timeSlot ? "Zeitslot bearbeiten" : "Neuen Zeitslot hinzufügen"}
          </DialogTitle>
          <DialogDescription>
            {timeSlot
              ? "Bearbeite die Details des Zeitslots"
              : "Füge einen neuen Zeitslot zu deinem Stundenplan hinzu"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startTime" className="text-right">
              Startzeit
            </Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setStartTime(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endTime" className="text-right">
              Endzeit
            </Label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEndTime(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          {timeSlot && (
            <Button variant="destructive" onClick={handleDelete}>
              Löschen
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSave}>Speichern</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 