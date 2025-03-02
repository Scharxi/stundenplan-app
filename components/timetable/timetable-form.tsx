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

interface TimetableFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timetableId?: string;
}

export function TimetableForm({ open, onOpenChange, timetableId }: TimetableFormProps) {
  const { timetables, createTimetable, updateTimetable, deleteTimetable } = useTimetableStore();
  
  const [name, setName] = useState("");
  
  const timetable = timetableId
    ? timetables.find((t) => t.id === timetableId)
    : undefined;
  
  // Wenn ein Stundenplan bearbeitet wird, lade die Daten
  useEffect(() => {
    if (timetable) {
      setName(timetable.name);
    } else {
      setName("");
    }
  }, [timetable, open]);
  
  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Bitte gib einen Namen für den Stundenplan ein");
      return;
    }
    
    if (timetableId && timetable) {
      // Stundenplan aktualisieren
      updateTimetable(timetableId, { name });
      toast.success("Stundenplan aktualisiert");
    } else {
      // Neuen Stundenplan erstellen
      createTimetable(name);
      toast.success("Stundenplan erstellt");
    }
    
    onOpenChange(false);
  };
  
  const handleDelete = () => {
    if (!timetableId) return;
    
    deleteTimetable(timetableId);
    toast.success("Stundenplan gelöscht");
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {timetable ? "Stundenplan bearbeiten" : "Neuen Stundenplan erstellen"}
          </DialogTitle>
          <DialogDescription>
            {timetable
              ? "Bearbeite die Details des Stundenplans"
              : "Erstelle einen neuen Stundenplan"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              className="col-span-3"
              placeholder="z.B. Sommersemester 2023"
              autoFocus
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          {timetable && (
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