"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useTimetableStore } from "@/lib/store";
import { DAY_LABELS, DAYS, Day } from "@/lib/types";
import { sortTimeSlots } from "@/lib/utils";

interface BreakFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  breakId?: string;
}

export function BreakForm({ open, onOpenChange, breakId }: BreakFormProps) {
  const { timetables, activeTimetableId, addBreak, updateBreak, deleteBreak } = useTimetableStore();
  
  const [name, setName] = useState("");
  const [timeSlotId, setTimeSlotId] = useState("");
  const [selectedDays, setSelectedDays] = useState<Day[]>([]);
  
  const activeTimetable = timetables.find((t) => t.id === activeTimetableId);
  
  // Use useMemo to prevent recalculation on every render
  const sortedTimeSlots = useMemo(() => {
    return activeTimetable ? sortTimeSlots(activeTimetable.timeSlots) : [];
  }, [activeTimetable]);
  
  const breakItem = useMemo(() => {
    return breakId && activeTimetable 
      ? activeTimetable.breaks?.find((b) => b.id === breakId) 
      : undefined;
  }, [breakId, activeTimetable]);
  
  // Wenn eine Pause bearbeitet wird, lade die Daten
  useEffect(() => {
    if (!open) return; // Only run when dialog is open
    
    if (breakItem) {
      setName(breakItem.name);
      setTimeSlotId(breakItem.timeSlotId);
      setSelectedDays([...breakItem.days]); // Create a new array to avoid reference issues
    } else {
      setName("");
      setTimeSlotId(sortedTimeSlots.length > 0 ? sortedTimeSlots[0].id : "");
      setSelectedDays([]);
    }
  }, [breakItem, sortedTimeSlots, open]);
  
  const handleSave = () => {
    if (!activeTimetableId) {
      toast.error("Kein aktiver Stundenplan ausgewählt");
      return;
    }
    
    if (!name.trim()) {
      toast.error("Bitte gib einen Namen für die Pause ein");
      return;
    }
    
    if (!timeSlotId) {
      toast.error("Bitte wähle einen Zeitslot aus");
      return;
    }
    
    if (selectedDays.length === 0) {
      toast.error("Bitte wähle mindestens einen Tag aus");
      return;
    }
    
    try {
      if (breakId) {
        // Bestehende Pause aktualisieren
        updateBreak(activeTimetableId, breakId, {
          name: name.trim(),
          timeSlotId,
          days: selectedDays,
        });
        toast.success("Pause aktualisiert");
      } else {
        // Neue Pause hinzufügen
        addBreak(activeTimetableId, {
          name: name.trim(),
          timeSlotId,
          days: selectedDays,
        });
        toast.success("Pause hinzugefügt");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error("Fehler beim Speichern der Pause");
      console.error(error);
    }
  };
  
  const handleDelete = () => {
    if (!activeTimetableId || !breakId) return;
    
    try {
      deleteBreak(activeTimetableId, breakId);
      toast.success("Pause gelöscht");
      onOpenChange(false);
    } catch (error) {
      toast.error("Fehler beim Löschen der Pause");
      console.error(error);
    }
  };
  
  const handleDayToggle = (day: Day) => {
    setSelectedDays((prev) => 
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };
  
  if (!activeTimetable) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{breakId ? "Pause bearbeiten" : "Neue Pause erstellen"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="break-name">Name *</Label>
            <Input
              id="break-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Große Pause"
              autoFocus
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="break-timeslot">Zeitslot *</Label>
            <Select value={timeSlotId} onValueChange={setTimeSlotId}>
              <SelectTrigger id="break-timeslot">
                <SelectValue placeholder="Zeitslot auswählen" />
              </SelectTrigger>
              <SelectContent>
                {sortedTimeSlots.map((timeSlot) => (
                  <SelectItem key={timeSlot.id} value={timeSlot.id}>
                    {timeSlot.startTime} - {timeSlot.endTime}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label>Tage *</Label>
            <div className="grid grid-cols-2 gap-2">
              {DAYS.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`day-${day}`} 
                    checked={selectedDays.includes(day)}
                    onCheckedChange={() => handleDayToggle(day)}
                  />
                  <label
                    htmlFor={`day-${day}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {DAY_LABELS[day]}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          {breakId && (
            <Button variant="destructive" onClick={handleDelete}>
              Löschen
            </Button>
          )}
          <div className={`flex gap-2 ${!breakId && "ml-auto"}`}>
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